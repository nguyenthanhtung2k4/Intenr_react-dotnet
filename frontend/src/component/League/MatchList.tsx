import React, { useEffect, useState } from 'react';
import {
  fetchGlobalMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  fetchTeams,
  fetchTournaments,
  MatchData,
  TournamentData,
  MatchCreateData,
} from '../../services/api.services';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Team } from '../../types/Team';

const MatchList = () => {
  const { role, isAuthenticated } = useAuth();
  const toast = useToast();

  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);

  // Form State
  const [formData, setFormData] = useState<MatchCreateData>({
    tourneyId: 0,
    lanes: '',
    oddLaneTeamId: 0,
    evenLaneTeamId: 0,
  });
  const [creating, setCreating] = useState(false);

  // Initial Fetch
  const refreshMatches = async () => {
    setLoading(true);
    try {
      const data = await fetchGlobalMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMatches();
  }, []);

  useEffect(() => {
    refreshMatches();
  }, []);

  // Fetch Admin Data
  useEffect(() => {
    console.log('MatchList Role:', role, 'ShowForm:', showCreateForm);
    if (role === 'Admin' && showCreateForm) {
      const loadAdminData = async () => {
        try {
          const [teamsData, tourneysData] = await Promise.all([fetchTeams(), fetchTournaments()]);
          setTeams(teamsData);
          setTournaments(tourneysData);
          if (teamsData.length === 0 || tourneysData.length === 0) {
            toast.showToast(
              'Warning: No teams or tournaments found. Please add them first.',
              'warning',
            );
          }
        } catch (error) {
          console.error('Failed to load admin data', error);
          toast.showToast('Failed to load options', 'error');
        }
      };
      loadAdminData();
    }
  }, [role, showCreateForm]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.tourneyId ||
      !formData.oddLaneTeamId ||
      !formData.evenLaneTeamId ||
      !formData.lanes
    ) {
      toast.showToast('Please fill all fields', 'warning');
      return;
    }
    if (formData.oddLaneTeamId === formData.evenLaneTeamId) {
      toast.showToast('Teams must be different', 'warning');
      return;
    }

    setCreating(true);
    try {
      if (editingMatchId) {
        await updateMatch(editingMatchId, formData);
        toast.showToast('Match updated successfully!', 'success');
      } else {
        await createMatch(formData);
        toast.showToast('Match scheduled successfully!', 'success');
      }
      setShowCreateForm(false);
      setEditingMatchId(null);
      setFormData({ tourneyId: 0, lanes: '', oddLaneTeamId: 0, evenLaneTeamId: 0 });
      refreshMatches();
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to save match', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (match: MatchData) => {
    setEditingMatchId(match.matchId);
    setFormData({
      tourneyId: match.tourneyId || 0,
      lanes: match.lanes,
      oddLaneTeamId: match.oddLaneTeamId || 0,
      evenLaneTeamId: match.evenLaneTeamId || 0,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;
    try {
      await deleteMatch(id);
      toast.showToast('Match deleted successfully', 'success');
      refreshMatches();
    } catch (error) {
      toast.showToast('Failed to delete match', 'error');
    }
  };

  if (loading && matches.length === 0)
    return <div className="text-center p-10 text-[#00f3ff] animate-pulse">Loading Fixtures...</div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl animate-fade-in-up mt-24">
      <div className="flex justify-between items-end mb-8 border-b-2 border-[#00f3ff]/30 pb-4">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] uppercase tracking-tighter filter drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            Match Fixtures
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm">
            Upcoming league games and lane assignments
          </p>
        </div>

        {/* Admin Action */}
        {role === 'Admin' && (
          <>

            <button
              onClick={() => {
                if (showCreateForm) {
                  setShowCreateForm(false);
                  setEditingMatchId(null);
                  setFormData({ tourneyId: 0, lanes: '', oddLaneTeamId: 0, evenLaneTeamId: 0 });
                } else {
                  setShowCreateForm(true);
                }
              }}
              style={{ marginTop: '1rem' }}
              className="bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] border border-[#00f3ff]/50 px-6 py-2 rounded-full font-bold uppercase text-sm tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              {showCreateForm
                ? editingMatchId
                  ? 'Cancel Edit'
                  : 'Cancel Scheduling'
                : '+ Schedule Match'}
            </button>
          </>
        )}
      </div>

      {/* Admin Create Form */}
      {showCreateForm && role === 'Admin' && (
        <div className="mb-10 bg-[#1a1b26]/90 border border-[#00f3ff]/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wide border-l-4 border-[#ff00ff] pl-3">
            {editingMatchId ? 'Edit Match' : 'Schedule New Match'}
          </h3>
          <form
            onSubmit={handleCreateSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white"
          >
            {/* Tournament Select */}
            <div className="md:col-span-2">
              <label className="block text-[#00f3ff] text-xs font-bold uppercase mb-2">
                Tournament / Date
              </label>
              <select
                className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 focus:border-[#00f3ff] focus:outline-none transition-colors"
                value={formData.tourneyId}
                onChange={(e) => setFormData({ ...formData, tourneyId: Number(e.target.value) })}
              >
                <option value={0}>-- Select Tournament --</option>
                {tournaments.map((t) => (
                  <option key={t.tourneyId} value={t.tourneyId}>
                    {t.tourneyLocation} - {new Date(t.tourneyDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Odd Team */}
            <div>
              <label className="block text-[#00f3ff] text-xs font-bold uppercase mb-2">
                Odd Lane Team
              </label>
              <select
                className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 focus:border-[#00f3ff] focus:outline-none transition-colors"
                value={formData.oddLaneTeamId}
                onChange={(e) =>
                  setFormData({ ...formData, oddLaneTeamId: Number(e.target.value) })
                }
              >
                <option value={0}>-- Select Team --</option>
                {teams.map((t) => (
                  <option key={t.TeamId} value={t.TeamId}>
                    {t.teamName}
                  </option>
                ))}
              </select>
            </div>

            {/* Even Team */}
            <div>
              <label className="block text-[#ff00ff] text-xs font-bold uppercase mb-2">
                Even Lane Team
              </label>
              <select
                className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 focus:border-[#ff00ff] focus:outline-none transition-colors"
                value={formData.evenLaneTeamId}
                onChange={(e) =>
                  setFormData({ ...formData, evenLaneTeamId: Number(e.target.value) })
                }
              >
                <option value={0}>-- Select Team --</option>
                {teams.map((t) => (
                  <option key={t.TeamId} value={t.TeamId}>
                    {t.teamName}
                  </option>
                ))}
              </select>
            </div>

            {/* Lanes */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2">
                Lanes (e.g. 1-2)
              </label>
              <input
                type="text"
                placeholder="Ex: 5-6"
                className="w-full bg-[#0b0c15] border border-gray-700 rounded-lg p-3 focus:border-white focus:outline-none transition-colors"
                value={formData.lanes}
                onChange={(e) => setFormData({ ...formData, lanes: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                disabled={creating}
                className="bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] text-black font-black uppercase py-3 px-8 rounded-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.4)] transition-all transform hover:scale-105"
              >
                {creating ? 'Saving...' : editingMatchId ? 'Update Match' : 'Confirm Match'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Match List */}
      <div className="glass-panel rounded-2xl p-1 overflow-hidden">
        <div className="grid grid-cols-1 gap-4">
          {matches.map((match) => (
            <div
              key={match.matchId}
              className="relative bg-[#0b0c15]/80 p-6 rounded-xl border border-white/5 hover:border-[#00f3ff]/50 transition-all duration-300 group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00f3ff] opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Date & Location */}
                <div className="text-center md:text-left min-w-[120px]">
                  <div className="text-[#00f3ff] font-bold text-lg">
                    {new Date(match.tourneyDate).toLocaleDateString()}
                  </div>
                  <div className="text-gray-500 text-xs font-mono uppercase tracking-widest">
                    {match.tourneyLocation}
                  </div>
                </div>

                {/* Teams VS */}
                <div className="flex-1 flex items-center justify-center gap-8 w-full">
                  <div className="text-right flex-1">
                    <span className="text-white text-xl font-black uppercase tracking-tight group-hover:text-shadow-neon transition-all">
                      {match.oddLaneTeam}
                    </span>
                  </div>
                  <div className="bg-[#1a1b26] rounded-full px-3 py-1 border border-white/10 text-gray-400 font-mono text-xs">
                    VS
                  </div>
                  <div className="text-left flex-1">
                    <span className="text-white text-xl font-black uppercase tracking-tight group-hover:text-shadow-neon transition-all">
                      {match.evenLaneTeam}
                    </span>
                  </div>
                </div>

                {/* Lanes */}
                <div className="text-right min-w-[100px] flex flex-col items-end gap-2">
                  <div>
                    <div className="text-gray-400 text-xs font-mono mb-1">LANES</div>
                    <div className="text-[#ff0055] font-bold text-2xl font-mono">{match.lanes}</div>
                  </div>

                  {role === 'Admin' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(match)}
                        className="text-xs bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded hover:bg-yellow-500/40 transition-colors uppercase font-bold tracking-wide"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(match.matchId)}
                        className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded hover:bg-red-500/40 transition-colors uppercase font-bold tracking-wide"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <div className="text-center p-12 text-gray-500 font-mono">
              No matches scheduled yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchList;
