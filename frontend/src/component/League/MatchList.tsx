import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchGlobalMatches,
  fetchTournaments,
  MatchData,
  TournamentData,
} from '../../services/api.services';
import { useAuth } from '../../context/AuthContext';
import ScoreEntryModal from './ScoreEntryModal';

const MatchList = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const isAdmin = role === 'Admin';

  // Filter State
  const [selectedTournament, setSelectedTournament] = useState<string>('all');

  // Modal states
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const [entryMatch, setEntryMatch] = useState<MatchData | null>(null);
  const [showEntryModal, setShowEntryModal] = useState(false);

  const loadData = () => {
    Promise.all([fetchGlobalMatches(), fetchTournaments()])
      .then(([matchesData, tournamentsData]) => {
        setMatches(matchesData);
        setTournaments(tournamentsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtering
  const filteredMatches =
    selectedTournament === 'all'
      ? matches
      : matches.filter((m) => m.tourneyId === Number(selectedTournament));

  // Group by Tournament for clean display
  const groupedMatches: Record<number, MatchData[]> = {};
  filteredMatches.forEach((match) => {
    const tId = match.tourneyId;
    if (tId) {
      if (!groupedMatches[tId]) {
        groupedMatches[tId] = [];
      }
      groupedMatches[tId].push(match);
    }
  });

  const handleViewResult = (match: MatchData) => {
    setSelectedMatch(match);
    setShowResultModal(true);
  };

  const handleEnterScore = (match: MatchData, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening result modal if clicking this button
    setEntryMatch(match);
    setShowEntryModal(true);
  };

  const handleEntrySuccess = () => {
    loadData(); // Refresh data to show new results/status
  };

  if (loading) return <div className="p-20 text-center">Loading Fixtures...</div>;

  return (
    <div className="mt-28 min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Fixtures
            </h1>
            <p className="text-slate-500 mt-1">Upcoming matches and results</p>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Filter by Tournament
            </label>
            <select
              className="input-field bg-white"
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
            >
              <option value="all">All Tournaments</option>
              {tournaments.map((t) => (
                <option key={t.tourneyId} value={t.tourneyId}>
                  {t.tourneyLocation}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {Object.keys(groupedMatches).length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No matches found for the selected filter.</p>
            </div>
          )}

          {Object.entries(groupedMatches).map(([tourneyId, tourneyMatches]) => {
            const tournament = tournaments.find((t) => t.tourneyId === Number(tourneyId));
            if (!tournament) return null;

            return (
              <div
                key={tourneyId}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Tournament Header inside the card */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    {tournament.tourneyLocation}
                  </h3>
                  <span className="text-sm font-bold text-slate-500 uppercase">
                    {new Date(tournament.tourneyDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Matches List */}
                <div className="divide-y divide-slate-100">
                  {tourneyMatches.map((match) => {
                    const hasResult = match.hasResult || false;
                    const isPastDate = new Date(match.tourneyDate) < new Date();

                    return (
                      <div
                        key={match.matchId}
                        className={`p-6 transition-colors flex flex-col md:flex-row items-center justify-between gap-4 ${
                          hasResult ? 'hover:bg-green-50/30 cursor-pointer' : 'hover:bg-blue-50/30'
                        }`}
                        onClick={() => hasResult && handleViewResult(match)}
                      >
                        <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                          <div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded text-center shadow-sm">
                            <div className="text-[10px] text-slate-400 font-bold uppercase">
                              Lane
                            </div>
                            <div className="text-lg font-black text-blue-600 leading-none">
                              {match.lanes}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-between w-full md:px-8">
                          <div
                            className={`text-lg font-bold w-5/12 text-right ${
                              hasResult && match.winningTeamId === match.oddLaneTeamId
                                ? 'text-green-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {match.oddLaneTeam}
                            {hasResult && (
                              <span className="ml-2 text-sm">({match.oddLaneWins || 0})</span>
                            )}
                          </div>
                          <div className="w-2/12 text-center text-xs font-bold text-slate-300 uppercase">
                            VS
                          </div>
                          <div
                            className={`text-lg font-bold w-5/12 text-left ${
                              hasResult && match.winningTeamId === match.evenLaneTeamId
                                ? 'text-green-600'
                                : 'text-slate-900'
                            }`}
                          >
                            {match.evenLaneTeam}
                            {hasResult && (
                              <span className="ml-2 text-sm">({match.evenLaneWins || 0})</span>
                            )}
                          </div>
                        </div>

                        <div className="w-full md:w-auto text-right flex items-center gap-3 justify-end">
                          {isAdmin && (
                            <button
                              onClick={(e) => handleEnterScore(match, e)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200 transition-colors"
                            >
                              Enter Scores
                            </button>
                          )}

                          {hasResult ? (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                              ✓ Completed
                            </span>
                          ) : isPastDate ? (
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase">
                              Pending Result
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase">
                              Scheduled
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Modal - Simple View (Summary) */}
      {showResultModal && selectedMatch && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowResultModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Match Result</h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-slate-200">
                <div className="text-sm text-slate-500 font-bold uppercase">
                  {selectedMatch.tourneyLocation}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(selectedMatch.tourneyDate).toLocaleDateString()}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <div
                      className={`text-2xl font-black mb-2 ${selectedMatch.winningTeamId === selectedMatch.oddLaneTeamId ? 'text-green-600' : 'text-slate-700'}`}
                    >
                      {selectedMatch.oddLaneTeam}
                    </div>
                    <div className="text-4xl font-black text-blue-600">
                      {selectedMatch.oddLaneWins || 0}
                    </div>
                  </div>
                  <div className="text-slate-300 font-bold text-xl px-4">VS</div>
                  <div className="text-center flex-1">
                    <div
                      className={`text-2xl font-black mb-2 ${selectedMatch.winningTeamId === selectedMatch.evenLaneTeamId ? 'text-green-600' : 'text-slate-700'}`}
                    >
                      {selectedMatch.evenLaneTeam}
                    </div>
                    <div className="text-4xl font-black text-blue-600">
                      {selectedMatch.evenLaneWins || 0}
                    </div>
                  </div>
                </div>
                {selectedMatch.winningTeamName && (
                  <div className="text-center mt-6 pt-4 border-t border-slate-200">
                    <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                      🏆 Winner: {selectedMatch.winningTeamName}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowResultModal(false)}
              className="btn btn-primary w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Score Entry Modal */}
      {showEntryModal && entryMatch && (
        <ScoreEntryModal
          match={entryMatch}
          onClose={() => setShowEntryModal(false)}
          onSuccess={handleEntrySuccess}
        />
      )}
    </div>
  );
};

export default MatchList;
