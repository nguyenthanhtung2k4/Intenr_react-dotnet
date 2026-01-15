import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bowler } from '../../../types/Bowler';
import {
  fetchAllBowlers,
  deleteBowler,
  fetchTeams,
  fetchBowlerStats,
  Team,
  BowlerStatsData,
} from '../../../services/api.services';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

function BowlersTable() {
  const [bowlers, setBowlers] = useState<Bowler[]>([]);
  const [stats, setStats] = useState<Map<number, BowlerStatsData>>(new Map());
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const isAdmin = role === 'Admin';
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    Promise.all([fetchAllBowlers(), fetchTeams(), fetchBowlerStats()])
      .then(([bowlerData, teamData, statsData]) => {
        setBowlers(bowlerData);
        setTeams(teamData);

        // Convert stats array to Map for easy lookup
        const statsMap = new Map<number, BowlerStatsData>();
        statsData.forEach((s) => statsMap.set(s.bowlerId, s));
        setStats(statsMap);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredBowlers = bowlers.filter(
    (b) =>
      b.bowlerFirstName.toLowerCase().includes(search.toLowerCase()) ||
      b.bowlerLastName.toLowerCase().includes(search.toLowerCase()) ||
      b.team?.teamName?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteBowler(id);
      setBowlers(bowlers.filter((b) => b.BowlerId !== id));
      toast.showToast('Bowler deleted', 'success');
    } catch (error) {
      toast.showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="mt-28 min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Player Database
            </h1>
            <p className="text-slate-500 mt-1">Manage league athletes and their stats</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search players..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate('/bowler/new')}
                className="btn btn-primary whitespace-nowrap"
              >
                + Add Player
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                    Team
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Games
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Avg
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    High
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Pins
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBowlers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No players found.
                    </td>
                  </tr>
                ) : (
                  filteredBowlers.map((bowler) => {
                    const stat = stats.get(bowler.BowlerId);
                    return (
                      <tr key={bowler.BowlerId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                              {bowler.bowlerFirstName.charAt(0)}
                              {bowler.bowlerLastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">
                                {bowler.bowlerFirstName} {bowler.bowlerLastName}
                              </div>
                              <div className="text-xs text-slate-400">ID: {bowler.BowlerId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {bowler.team?.teamName || 'Unassigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 font-medium">
                          {stat?.totalGames || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-900 font-bold">
                          {stat?.averageScore?.toFixed(1) || '0.0'}
                        </td>
                        <td className="px-6 py-4 text-center text-green-600 font-medium">
                          {stat?.highScore || 0}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600 font-medium">
                          {stat?.totalPins?.toLocaleString() || 0}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/bowler/${bowler.BowlerId}`)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(bowler.BowlerId)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BowlersTable;
