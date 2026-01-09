import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeams, createTeam, deleteTeam, Team } from '../../../services/api.services';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const ViewTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const isAdmin = role === 'Admin';
  const toast = useToast();
  const navigate = useNavigate();

  // Create Form State
  const [showCreate, setShowCreate] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const loadTeams = async () => {
    try {
      const data = await fetchTeams();
      setTeams(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      await createTeam({ TeamName: newTeamName, CaptainId: null });
      toast.showToast('Team created successfully', 'success');
      setNewTeamName('');
      setShowCreate(false);
      loadTeams();
    } catch (error) {
      toast.showToast('Failed to create team', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this team?')) return;
    try {
      await deleteTeam(id);
      toast.showToast('Team deleted', 'success');
      loadTeams();
    } catch (error) {
      toast.showToast('Failed to delete team', 'error');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Teams...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Teams</h1>
            <p className="text-slate-500 mt-1">League participating squads</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
              {showCreate ? 'Cancel' : '+ New Team'}
            </button>
          )}
        </div>

        {showCreate && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 animate-fade-in-up max-w-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Team</h3>
            <form onSubmit={handleCreate} className="flex gap-4">
              <input
                type="text"
                placeholder="Enter team name"
                className="input-field flex-1"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.TeamId}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                  {team.teamName.charAt(0)}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(team.TeamId)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                {team.teamName}
              </h3>
              <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                <span>Captain:</span>
                <span className="text-slate-800">
                  {/* Ideally fetch captain name */}
                  {team.captainId ? `#${team.captainId}` : 'None'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewTeams;
