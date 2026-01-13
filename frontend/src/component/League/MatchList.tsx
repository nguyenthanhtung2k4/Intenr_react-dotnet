import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchGlobalMatches,
  fetchTournaments,
  MatchData,
  TournamentData,
} from '../../services/api.services';

const MatchList = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedTournament, setSelectedTournament] = useState<string>('all');

  useEffect(() => {
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
                  {tourneyMatches.map((match) => (
                    <div
                      key={match.matchId}
                      className="p-6 hover:bg-blue-50/30 transition-colors flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded text-center shadow-sm">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Lane</div>
                          <div className="text-lg font-black text-blue-600 leading-none">
                            {match.lanes}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-between w-full md:px-8">
                        <div className="text-lg font-bold text-slate-900 w-5/12 text-right">
                          {match.oddLaneTeam}
                        </div>
                        <div className="w-2/12 text-center text-xs font-bold text-slate-300 uppercase">
                          VS
                        </div>
                        <div className="text-lg font-bold text-slate-900 w-5/12 text-left">
                          {match.evenLaneTeam}
                        </div>
                      </div>

                      <div className="w-full md:w-auto text-right">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full uppercase">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchList;
