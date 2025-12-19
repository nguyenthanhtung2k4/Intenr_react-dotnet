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
        setError(ex.message || 'Lỗi tải dữ liệu.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
  }, []);

  const handleAction = (team: any, path: string) => {
    const id = getTeamId(team);
    if (id) navigate(`/${path}/${id}`);
  };

  return (
    // Nền trắng sáng, padding top lớn để tránh đè Header
    <div className="min-h-screen  pt-32 pb-12 px-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header Section với Gradient giống trang chính */}

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="relative">
            <h1 className="text-6xl font-black italic tracking-tighter leading-none uppercase">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 p-5">
                League
              </span>
              <br />
              <span className="text-slate-900">Teams</span>
            </h1>
            <div className="h-2 w-32 bg-gradient-to-r from-pink-500 to-purple-500 mt-4 rounded-full"></div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/create-team')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-wider"
            >
              + Create Team
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-white border-2 border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-full hover:bg-slate-50 transition-all text-sm uppercase tracking-wider"
            >
              Back Home
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-purple-600"></div>
          </div>
        ) : (
          /* Bảng thiết kế lại theo phong cách hiện đại */
          <div className="overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <table className="min-w-full">
              <thead>
                {/* Header bảng dùng màu tối pha gradient nhẹ */}
                <tr className="bg-[#1a1c2e]">
                  <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Team Name
                  </th>
                  <th className="px-8 py-6 text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Roster
                  </th>
                  {isAuthenticated && (
                    <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Management
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dataTeams.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-slate-400 italic">
                      No teams registered yet.
                    </td>
                  </tr>
                ) : (
                  dataTeams.map((team) => (
                    <tr key={team.TeamId} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          {/* Icon Team với Gradient */}
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md transform group-hover:rotate-6 transition-transform">
                            {team.teamName.charAt(0)}
                          </div>
                          <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                            {team.teamName}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => handleAction(team, 'team')}
                          className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-black text-sm uppercase tracking-widest border-b-2 border-purple-200 hover:border-purple-600 transition-all"
                        >
                          View Roster
                        </button>
                      </td>
                      {isAuthenticated && (
                        <td className="px-8 py-6 text-right space-x-6">
                          <button
                            onClick={() => handleAction(team, 'edit-team')}
                            className="font-bold text-sm text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction(team, 'delete-team')}
                            className="font-bold text-sm text-slate-400 hover:text-pink-600 transition-colors uppercase tracking-widest"
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
