import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bowler } from '../../../types/Bowler';
import { fetchAllBowlers } from '../../../services/api.services';
import { useAuth } from '../../../context/AuthContext';

function BowlersTable(props: any) {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();
  const [bowlerData, setBowlerData] = useState<Bowler[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = isAuthenticated && role === 'Admin';

  const handleTeam = (ID: number) => navigate(`/team/${ID}`);
  const handleEdit = (ID: number) => navigate(`/bowler/${ID}`);
  const handleDelete = (ID: number) => navigate(`/delete/${ID}`);

  const handleCreate = (type: string) => {
    if (type === 'create') {
      navigate(`/bowler/new`);
    } else {
      navigate(`/view-teams`);
    }
  };

  useEffect(() => {
    const fetchBowlerData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const b = await fetchAllBowlers();
        setBowlerData(b || []);
      } catch (ex: any) {
        setError(ex.message || 'Lỗi: Không thể tải dữ liệu VĐV từ API.');
        setBowlerData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBowlerData();
  }, []);

  // Logic lọc dữ liệu
  let filteredBowlers = bowlerData.filter((e) => !e.isDelete);
  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    filteredBowlers = filteredBowlers.filter(
      (bowler) =>
        bowler.bowlerFirstName.toLowerCase().includes(lowerCaseSearch) ||
        bowler.bowlerLastName.toLowerCase().includes(lowerCaseSearch) ||
        bowler.team.teamName.toLowerCase().includes(lowerCaseSearch) ||
        bowler.bowlerCity.toLowerCase().includes(lowerCaseSearch),
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-12 px-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="mb-10">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Player{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Database
            </span>
          </h1>
          <div className="h-2 w-24 bg-gradient-to-r from-pink-500 to-purple-500 mt-4 rounded-full"></div>
        </div>

        {/* Control Panel: Search & Buttons */}
        <div className="mb-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              placeholder="Search by name, team or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all shadow-sm"
            />
            <span className="absolute left-4 top-3.5 text-slate-400 text-xl">🔍</span>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => handleCreate('create')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 text-sm uppercase tracking-wider"
              >
                + New Bowler
              </button>
              <button
                onClick={() => handleCreate('view-teams')}
                className="bg-white border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm uppercase tracking-wider shadow-sm"
              >
                Manage Teams
              </button>
              <button
                onClick={() => navigate('/view-accounts')}
                className="bg-pink-50 text-pink-600 border border-pink-100 font-bold px-6 py-3 rounded-xl hover:bg-pink-100 transition-all text-sm uppercase tracking-wider"
              >
                Accounts
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-bold">
            {error}
          </div>
        )}

        {isLoading && !error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-purple-600"></div>
            <p className="mt-4 text-slate-400 font-bold tracking-widest uppercase text-xs">
              Synchronizing Data...
            </p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#1a1c2e]">
                    {['Player Name', 'Location', 'Phone', 'Team'].map((head) => (
                      <th
                        key={head}
                        className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-[0.2em]"
                      >
                        {head}
                      </th>
                    ))}
                    {isAdmin && (
                      <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {filteredBowlers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic">
                        {search ? `No results found for "${search}"` : 'No player data available.'}
                      </td>
                    </tr>
                  ) : (
                    filteredBowlers.map((b) => (
                      <tr key={b.bowlerId} className="hover:bg-slate-50/80 transition-all group">
                        {/* Name Column */}
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all">
                              {b.bowlerLastName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800 tracking-tight">
                                {b.bowlerLastName}, {b.bowlerFirstName}
                              </div>
                              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                                ID: #{b.bowlerId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Address Column */}
                        <td className="px-8 py-5 text-sm text-slate-500">
                          <span className="font-medium text-slate-700">{b.bowlerCity}</span>
                          <div className="text-xs opacity-60 truncate max-w-[150px]">
                            {b.bowlerAddress}
                          </div>
                        </td>

                        {/* Phone Column */}
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                            {b.bowlerPhoneNumber}
                          </span>
                        </td>

                        {/* Team Column */}
                        <td className="px-8 py-5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleTeam(b.teamId)}
                            className="text-slate-800 hover:text-purple-600 font-bold text-sm flex items-center gap-2 transition-all"
                          >
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            {b?.team?.teamName || 'N/A'}
                          </button>
                        </td>

                        {/* Action Column */}
                        {isAdmin && (
                          <td className="px-8 py-5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleEdit(b.bowlerId)}
                              className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mr-6"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(b.bowlerId)}
                              className="text-xs font-extrabold uppercase tracking-widest text-slate-400 hover:text-pink-600 transition-colors"
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
          </div>
        )}
      </div>
    </div>
  );
}

export default BowlersTable;
