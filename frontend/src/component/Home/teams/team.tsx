import { useEffect, useState } from 'react';
import { Bowler } from '../../../types/Bowler';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTeamBowlers } from '../../../services/api.services';
import { useAuth } from '../../../context/AuthContext';

function Team() {
  const [bowlerData, setBowlerData] = useState<Bowler[]>([]);
  const [nameTeam, setNameTeam] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) {
      setError('Lỗi: Không tìm thấy ID đội.');
      setIsLoading(false);
      return;
    }

    const fetchBowler = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await fetchTeamBowlers(id);

        if (data && data.length > 0) {
          setNameTeam(data[0].team.teamName);
        } else {
          setNameTeam('Empty Team');
        }
        setBowlerData(data || []);
      } catch (ex: any) {
        setError(ex.message || 'Lỗi khi tải dữ liệu đội.');
        setNameTeam('Error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBowler();
  }, [id]);

  const handleEdit = (ID: number) => navigate(`/bowler/${ID}`);
  const handleDelete = (ID: number) => navigate(`/delete/${ID}`);

  return (
    <div className="min-h-screen bg-white pt-32 pb-12 px-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header Section: Đồng bộ với trang chính */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="relative">
            <div className="flex items-center gap-3 mb-2 text-blue-600 font-bold uppercase tracking-[0.3em] text-xs">
              <span className="w-8 h-px bg-blue-600"></span> Team Roster
              <span className="w-8 h-px bg-blue-600"></span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter leading-none uppercase">
              <span className="p-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                {nameTeam}
              </span>
            </h1>
            {/* <div className="h-2 w-32 bg-gradient-to-r from-pink-500 to-purple-500 mt-4 rounded-full"></div> */}
          </div>

          <button
            onClick={() => navigate('/view-teams')}
            className="group flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full hover:bg-slate-50 transition-all text-sm uppercase tracking-wider shadow-sm"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Teams
          </button>
        </div>

        {error && (
          <div className="p-5 mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl font-bold shadow-sm">
            {error}
          </div>
        )}

        {isLoading && !error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600"></div>
            <p className="mt-4 text-slate-400 font-bold tracking-widest uppercase text-xs">
              Fetching athletes...
            </p>
          </div>
        ) : (
          /* Bảng thiết kế lại: Trắng, sạch, bóng đổ mềm */
          <div className="overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  {/* Header bảng màu tối sâu cực sang trọng */}
                  <tr className="bg-[#1a1c2e]">
                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Athlete
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Contact
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Location
                    </th>
                    {isAuthenticated && (
                      <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 bg-white">
                  {bowlerData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-8 py-20 text-center text-slate-400 italic font-medium"
                      >
                        This team doesn't have any registered players yet.
                      </td>
                    </tr>
                  ) : (
                    bowlerData.map((b) => (
                      <tr key={b.bowlerId} className="hover:bg-blue-50/40 transition-all group">
                        {/* Cột Tên + Avatar Placeholder */}
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-110 transition-transform">
                              {b.bowlerLastName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-lg font-bold text-slate-800 tracking-tight">
                                {b.bowlerLastName}, {b.bowlerFirstName}
                              </div>
                              <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                                Active Player
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Cột Số điện thoại */}
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-700">
                            {b.bowlerPhoneNumber}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            Mobile
                          </div>
                        </td>

                        {/* Cột Địa chỉ */}
                        <td className="px-8 py-6">
                          <div className="text-sm text-slate-600 font-medium">
                            {b.bowlerCity}, {b.bowlerState}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[200px]">
                            {b.bowlerAddress}
                          </div>
                        </td>

                        {/* Cột Actions (Chỉ cho Admin) */}
                        {isAuthenticated && (
                          <td className="px-8 py-6 text-right whitespace-nowrap space-x-6">
                            <button
                              onClick={() => handleEdit(b.bowlerId)}
                              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(b.bowlerId)}
                              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-pink-600 transition-colors"
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

        {/* Footer info thêm cho đẹp */}
        <div className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          Bowling League Management System • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default Team;
