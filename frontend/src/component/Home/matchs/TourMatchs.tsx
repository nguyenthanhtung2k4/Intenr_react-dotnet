import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Bowler {
  bowlerId: number;
  bowlerFirstName: string;
  bowlerLastName: string;
  team: {
    teamName: string;
  };
}

interface Match {
  matchId: number;
  tourneyDate: string;
  tourneyLocation: string;
  oddLaneTeam: string;
  evenLaneTeam: string;
  lanes: string;
}

const TourMatch = () => {
  const [topBowlers, setTopBowlers] = useState<Bowler[]>([]);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top bowlers
        const bowlersResponse = await axios.get('http://localhost:5292/api/Bowlers');
        const allBowlers = bowlersResponse.data;
        setTopBowlers(allBowlers.slice(0, 10));

        // Fetch recent matches
        const matchesResponse = await axios.get('http://localhost:5292/api/Matchs/matches');
        setRecentMatches(matchesResponse.data.slice(0, 3));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-pink-600"></div>
          <p className="mt-4 text-lg font-bold text-slate-800 tracking-wider uppercase">
            Loading Season Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section - La Liga Style (Bold, Diagonal) */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-900">
        {/* Background Gradients/Shapes */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533560641175-9943c5cd6773?q=80&w=2070')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-600 rounded-full blur-[128px] opacity-40"></div>

        <div className="container-custom relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600/20 border border-pink-500/30 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse text-red-500"></span>
              <span className="text-white font-bold text-sm tracking-widest uppercase">
                Season 2025 Live
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter italic">
              LEAGUE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 p-2">
                Bowling
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-lg leading-relaxed font-light">
              Trải nghiệm cảm giác hồi hộp của cuộc đình công. Tham gia cộng đồng bowling ưu tú và
              theo dõi con đường dẫn đến vinh quang của bạn
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/fixtures" className="btn-sports btn-gradient shadow-lg shadow-pink-500/30">
                View Matches
              </Link>
              <Link
                to="/standings"
                className="bg-red-600 btn-sports btn-outline border-slate-600 text-white hover:border-white"
              >
                Standings
              </Link>
            </div>
          </div>

          {/* Hero Stats/Visual */}
          <div className="hidden md:block relative">
            <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-slate-400 text-sm uppercase font-bold tracking-wider">
                    Top Scorer
                  </p>
                  <h3 className="text-4xl font-black text-white italic">
                    {topBowlers[0]?.bowlerFirstName || 'TB'}
                  </h3>
                </div>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-t from-pink-600 to-purple-400">
                  #1
                </div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-pink-500 to-purple-600"></div>
              </div>
              <div className="mt-4 flex justify-between text-sm font-medium text-slate-300">
                <span>Performance</span>
                <span>92% Win Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Players Section */}
      <section className="py-24 bg-white relative">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="section-title">Top Athletes</h2>
              <div className="h-2 w-24 bg-pink-600 mt-2"></div>
            </div>
            <Link
              to="/stats"
              className="hidden md:flex items-center gap-2 font-bold text-slate-900 hover:text-pink-600 transition-colors uppercase tracking-wider"
            >
              Full Rankings
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {topBowlers.map((bowler, index) => (
              <div
                key={bowler.bowlerId}
                className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-pink-200 transition-all hover:shadow-xl hover:-translate-y-2 cursor-pointer"
              >
                <div className="absolute top-4 right-4 font-black text-4xl text-slate-200 group-hover:text-pink-100 transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-slate-200 mx-auto overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-pink-100 transition-all">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 text-slate-600 font-bold text-2xl">
                      {bowler.bowlerFirstName[0]}
                      {bowler.bowlerLastName[0]}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold uppercase rounded-full shadow-sm">
                      Elite
                    </div>
                  )}
                </div>

                <div className="text-center relative z-10">
                  <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-pink-600 transition-colors">
                    {bowler.bowlerFirstName} {bowler.bowlerLastName}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">
                    {bowler.team.teamName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="text-center p-8">
              <div className="text-5xl md:text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                {topBowlers.length}+
              </div>
              <p className="text-pink-500 font-bold uppercase tracking-widest text-sm">
                Professional Athletes
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl md:text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                {recentMatches.length}
              </div>
              <p className="text-blue-500 font-bold uppercase tracking-widest text-sm">
                Matches This Season
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-5xl md:text-7xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                12
              </div>
              <p className="text-purple-500 font-bold uppercase tracking-widest text-sm">
                Official Teams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Matches */}
      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <h2 className="section-title text-slate-900">Match Centre</h2>
            <Link
              to="/fixtures"
              className="text-slate-600 hover:text-slate-900 font-bold uppercase text-sm tracking-wider underline decoration-2 decoration-pink-500 underline-offset-4"
            >
              View All Matches
            </Link>
          </div>

          <div className="grid gap-6">
            {recentMatches.map((match) => (
              <div
                key={match.matchId}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border-l-4 border-pink-500 flex flex-col md:flex-row items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <span className="text-sm font-bold text-slate-400 uppercase">
                      {new Date(match.tourneyDate).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-3xl font-black text-slate-900">
                      {new Date(match.tourneyDate).getDate()}
                    </span>
                  </div>

                  <div className="flex-1 md:text-left">
                    <div className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">
                      League Match
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                      {match.tourneyLocation}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Lanes {match.lanes}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between bg-slate-50 p-4 rounded-lg md:bg-transparent md:p-0">
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{match.oddLaneTeam}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Odd Lane</div>
                  </div>
                  <div className="font-black text-2xl text-slate-300">VS</div>
                  <div className="text-left">
                    <div className="font-bold text-slate-900">{match.evenLaneTeam}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Even Lane</div>
                  </div>
                </div>

                <div>
                  <button className="btn-sports btn-outline px-6 py-2 text-xs w-full md:w-auto hover:bg-slate-900 hover:text-white">
                    Match Details
                  </button>
                </div>
              </div>
            ))}

            {recentMatches.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-medium italic">
                No recent scheduled matches found.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourMatch;
