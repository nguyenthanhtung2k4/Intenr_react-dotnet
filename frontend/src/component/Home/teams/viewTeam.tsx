import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeams } from '../../../services/api.services';
import { Team } from '../../../types/Team';
import { useAuth } from '../../../context/AuthContext';

function getTeamId(t: any): number | null {
  const raw = t?.TeamId ?? t?.teamId ?? t?.id;
  if (raw === undefined || raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
function ViewTeams() {
  const navigate = useNavigate();
  const [dataTeams, setDataTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const teams = await fetchTeams();
        setDataTeams(teams || []);
      } catch (ex: any) {
        console.error('Lỗi khi tải danh sách đội:', ex);
        setError(ex.message || 'Lỗi: Không thể tải danh sách đội từ API.');
        setDataTeams([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
  }, []);

  const handleViewBowlers = (teamId: any) => {
    const idTeam = getTeamId(teamId);
    console.log('idTeam : ', idTeam);
    navigate(`/team/${idTeam}`);
  };
  const handleTeamBowlers = (teamId: any, type: String) => {
    const idTeam = getTeamId(teamId);
    if (type === 'edit') {
      navigate(`/edit-team/${idTeam}`);
    }
    if (type === 'delete') {
      navigate(`/delete-team/${idTeam}`);
    }
  };

  return (
    <div
      className="p-4 sm:p-8 min-h-screen font-inter pt-24"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1
            className="text-4xl font-black text-white italic tracking-tighter"
            style={{ textShadow: '0 0 10px #00f3ff' }}
          >
            LEAGUE TEAMS
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/create-team')}
              className="btn-primary"
            >
              + Create Team
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition"
            >
              Back Home
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-400 p-4 mb-4 bg-red-900/20 border border-red-500 rounded-lg text-center font-bold">
            {error}
          </div>
        )}

        {isLoading && !error ? (
          <div className="text-center p-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00f3ff] mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto glass-panel rounded-2xl neon-border">
            <table className="min-w-full divide-y divide-[#2a2c39]">
              <thead className="bg-[#1a1c29]">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#00f3ff] uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-[#00f3ff] uppercase tracking-wider">
                    Details
                  </th>
                  {isAuthenticated && (
                    <th className="px-6 py-4 text-center text-xs font-bold text-[#ff0055] uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2c39] bg-transparent">
                {dataTeams.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-lg text-gray-400"
                    >
                      No teams found.
                    </td>
                  </tr>
                ) : (
                  dataTeams.map((team) => (
                    <tr
                      key={team.TeamId}
                      className="hover:bg-[#00f3ff]/10 transition duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-white text-center">
                        {team.teamName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <button
                          type="button"
                          id={`${team.TeamId}`}
                          onClick={() => handleViewBowlers(team)}
                          className="text-[#00f3ff] hover:text-white font-bold underline transition"
                        >
                          View Roster
                        </button>
                      </td>
                      {isAuthenticated && (
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            type="button"
                            id={`${team.TeamId}`}
                            onClick={() => handleTeamBowlers(team, 'edit')}
                            className="text-white hover:text-[#00f3ff] transition mr-4"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            id={`${team.TeamId}`}
                            onClick={() => handleTeamBowlers(team, 'delete')}
                            className="text-[#ff0055] hover:text-white transition"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTeams;
