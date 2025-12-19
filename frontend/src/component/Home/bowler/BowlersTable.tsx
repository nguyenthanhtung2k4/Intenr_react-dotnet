import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bowler } from '../../../types/Bowler';
import { fetchAllBowlers } from '../../../services/api.services';

function BowlersTable(props: any) {
  const navigate = useNavigate();
  const [bowlerData, setBowlerData] = useState<Bowler[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('props : ', props);
  var handleTeam = (ID: number) => {
    navigate(`team/${ID}`);
  };
  var handleEdit = (ID: number) => {
    navigate(`bowler/${ID}`);
  };
  var handleDelete = (ID: number) => {
    navigate(`delete/${ID}`);
  };
  var handleCreate = (type: string) => {
    if (type === 'create') {
      navigate(`bowler/new`);
    } else {
      navigate(`view-teams`);
    }
  };

  useEffect(() => {
    const fetchBowlerData = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // Gọi API Service
        const b = await fetchAllBowlers();
        setBowlerData(b || []);
      } catch (ex: any) {
        console.error('Error fetching data:', ex);
        // Hiển thị thông báo lỗi từ hàm service (hoặc lỗi chung)
        setError(ex.message || 'Lỗi: Không thể tải dữ liệu VĐV từ API.');
        setBowlerData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBowlerData();
  }, []);

  // --- LOGIC LỌC VÀ TÌM KIẾM HOÀN CHỈNH ---
  let filteredBowlers = bowlerData.filter((e) => !e.isDelete); // Lọc VĐV chưa bị xóa

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
    <div
      className="p-4 sm:p-8 min-h-screen font-inter pt-24"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Control Panel */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search Name or Team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 bg-[#1a1c29] text-white border border-[#2a2c39] rounded-xl focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] outline-none transition-all placeholder-gray-500"
            />
            <div className="absolute right-4 top-4 text-[#00f3ff]">🔍</div>
          </div>

          {props.isAuth && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCreate('create')}
                className="btn-primary text-sm py-3 px-6"
              >
                + New Bowler
              </button>
              <button
                onClick={() => handleCreate('view-teams')}
                className="glass-panel text-white font-bold py-3 px-6 rounded-full hover:bg-[#00f3ff] hover:text-black transition duration-300 border border-[#00f3ff]"
              >
                Manage Teams
              </button>
              <button
                onClick={() => navigate('view-accounts')}
                className="glass-panel text-white font-bold py-3 px-6 rounded-full hover:bg-red-500 hover:border-red-500 transition duration-300 border border-red-500/50"
              >
                Accounts
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 mb-8 bg-red-900/20 border border-red-500 text-red-400 rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        {/* Hiển thị Loading */}
        {isLoading && !error ? (
          <div className="text-center p-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00f3ff] mx-auto"></div>
            <p className="mt-4 text-[#00f3ff] font-bold text-lg animate-pulse">
              LOADING DATA...
            </p>
          </div>
        ) : (
          // Datat
          <div className="overflow-x-auto glass-panel rounded-2xl neon-border">
            <table className="min-w-full divide-y divide-[#2a2c39]">
              <thead className="bg-[#1a1c29]">
                <tr>
                  {['Last Name', 'First Name', 'Address', 'Phone', 'Team'].map(
                    (head) => (
                      <th
                        key={head}
                        className="px-6 py-4 text-xs font-bold text-[#00f3ff] uppercase tracking-wider text-left"
                      >
                        {head}
                      </th>
                    ),
                  )}
                  {props.isAuth && (
                    <th className="px-6 py-4 text-center text-xs font-bold text-[#ff0055] uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2c39] bg-transparent">
                {filteredBowlers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-lg text-gray-400"
                    >
                      {search
                        ? `No bowlers found for "${search}".`
                        : 'No bowler data available.'}
                    </td>
                  </tr>
                ) : (
                  filteredBowlers.map((b) => (
                    <tr
                      key={b.bowlerId}
                      className="hover:bg-[#ff0055]/10 transition duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                        {b.bowlerLastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {b.bowlerFirstName}{' '}
                        {b.bowlerMiddleInit ? b.bowlerMiddleInit + '.' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                        {b.bowlerAddress}, {b.bowlerCity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00f3ff]">
                        {b.bowlerPhoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          type="button"
                          onClick={() => handleTeam(b.teamId)}
                          className="text-white hover:text-[#00f3ff] hover:underline font-bold transition"
                        >
                          {b?.team?.teamName || 'N/A'}
                        </button>
                      </td>
                      {props.isAuth && (
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleEdit(b.bowlerId)}
                            className="text-[#00f3ff] hover:text-white mr-4 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(b.bowlerId)}
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

export default BowlersTable;
