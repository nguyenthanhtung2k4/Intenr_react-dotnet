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

  useEffect(() => {
    const fetchBowlerData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const b = await fetchAllBowlers();
        setBowlerData(b || []);
      } catch (ex: any) {
        setError(ex.message || 'Lỗi: Không thể tải dữ liệu.');
        setBowlerData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBowlerData();
  }, []);

  let filteredBowlers = bowlerData.filter((e) => !e.isDelete);
  if (search) {
    const kw = search.toLowerCase();
    filteredBowlers = filteredBowlers.filter(
      (b) =>
        `${b.bowlerFirstName} ${b.bowlerLastName}`.toLowerCase().includes(kw) ||
        b.team?.teamName.toLowerCase().includes(kw),
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Chơi Typography kiểu Tạp chí Thể thao */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="border-l-8 border-slate-900 pl-6">
            <h2 className="text-slate-400 text-sm font-black uppercase tracking-[0.3em] mb-1">
              League Members
            </h2>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              The{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                Bowlers
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            {props.isAuth && (
              <button
                onClick={() => navigate('bowler/new')}
                className="bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-500/20 text-xs uppercase tracking-widest"
              >
                + Register Athlete
              </button>
            )}
            <button
              onClick={() => navigate('view-teams')}
              className="bg-white border-2 border-slate-200 text-slate-900 font-bold px-8 py-4 rounded-full hover:border-slate-900 transition-all text-xs uppercase tracking-widest"
            >
              Teams View
            </button>
          </div>
        </div>

        {/* Search Bar - Hiện đại & Tối giản */}
        <div className="relative mb-10 group">
          <input
            type="text"
            placeholder="Filter by name or team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-b-4 border-slate-200 py-6 px-4 text-2xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-600 transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors text-3xl italic font-black">
            SEARCH
          </span>
        </div>

        {/* Athletes List */}
        {isLoading ? (
          <div className="py-20 text-center font-black italic text-slate-200 text-7xl uppercase animate-pulse">
            Loading...
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Table Header - Chỉ hiện trên màn hình lớn */}
            <div className="hidden lg:grid grid-cols-12 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <div className="col-span-4">Athlete Identity</div>
              <div className="col-span-3">Assigned Team</div>
              <div className="col-span-3">Contact info</div>
              <div className="col-span-2 text-right">Operations</div>
            </div>

            {filteredBowlers.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase italic">
                No Players Found In This League
              </div>
            ) : (
              filteredBowlers.map((b) => (
                <div
                  key={b.bowlerId}
                  className="group bg-white border border-slate-100 p-6 lg:px-8 rounded-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4"
                >
                  {/* Identity */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white font-black italic group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-purple-600 transition-all shadow-lg">
                      {b.bowlerLastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none group-hover:text-blue-600 transition-colors">
                        {b.bowlerLastName}, {b.bowlerFirstName}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                        Athlete ID: #{b.bowlerId}
                      </p>
                    </div>
                  </div>

                  {/* Team Badge */}
                  <div className="col-span-3">
                    <button
                      onClick={() => navigate(`team/${b.teamId}`)}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      {b.team?.teamName || 'Independent'}
                    </button>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3">
                    <div className="text-sm font-bold text-slate-800">{b.bowlerPhoneNumber}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate">
                      {b.bowlerCity}, {b.bowlerState}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    {props.isAuth ? (
                      <>
                        <button
                          onClick={() => navigate(`bowler/${b.bowlerId}`)}
                          className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 tracking-widest border-b-2 border-transparent hover:border-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`delete/${b.bowlerId}`)}
                          className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 tracking-widest border-b-2 border-transparent hover:border-red-500"
                        >
                          Revoke
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`bowler/${b.bowlerId}`)}
                        className="text-[10px] font-black uppercase text-slate-900 tracking-widest"
                      >
                        Profile
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BowlersTable;
