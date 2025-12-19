import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Match {
  matchId: number;
  tourneyLocation: string;
  tourneyDate: string;
  oddLaneTeam: string;
  evenLaneTeam: string;
  lanes: string;
}

const MatchList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5292/api/Matchs/matches');
        setMatches(response.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading)
    return <div className="text-center p-10 text-[#00f3ff] animate-pulse">Loading Fixtures...</div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl animate-fade-in-up p-600">
      <div className="flex justify-between items-end mb-8 border-b-2 border-[#00f3ff]/30 pb-4">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] uppercase tracking-tighter filter drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            Match Fixtures
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm">
            Upcoming league games and lane assignments
          </p>
        </div>
      </div>

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
                <div className="text-right min-w-[100px]">
                  <div className="text-gray-400 text-xs font-mono mb-1">LANES</div>
                  <div className="text-[#ff0055] font-bold text-2xl font-mono">{match.lanes}</div>
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
