import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Standing {
  teamId: number;
  teamName: string;
  played: number;
  won: number;
  points: number;
}

const StandingsTable = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await axios.get('http://localhost:5292/api/Matchs/standings');
        setStandings(response.data);
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading)
    return (
      <div className="text-center p-10 text-[#00f3ff] animate-pulse">Loading Standings...</div>
    );

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-fade-in-up">
      <div className="flex justify-between items-end mb-8 border-b-2 border-[#ff0055]/30 pb-4">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff0055] to-[#ff00ff] uppercase tracking-tighter filter drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]">
            League Standings
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm">Current season team rankings</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden ring-1 ring-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1b26]/80 text-[#00f3ff] uppercase text-xs font-bold tracking-widest border-b border-white/5">
              <th className="p-5 w-20 text-center">Rank</th>
              <th className="p-5">Team</th>
              <th className="p-5 w-32 text-center">Played</th>
              <th className="p-5 w-32 text-center">Won</th>
              <th className="p-5 w-32 text-center text-[#ff0055]">Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr
                key={team.teamId}
                className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
              >
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold font-mono ${index < 3 ? 'bg-[#00f3ff]/20 text-[#00f3ff] ring-1 ring-[#00f3ff]' : 'text-gray-500'}`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-white font-bold text-lg group-hover:text-shadow-neon transition-all">
                    {team.teamName}
                  </span>
                </td>
                <td className="p-4 text-center text-gray-400 font-mono">{team.played}</td>
                <td className="p-4 text-center text-gray-400 font-mono">{team.won}</td>
                <td className="p-4 text-center">
                  <span className="text-[#ff0055] font-black text-xl font-mono">{team.points}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {standings.length === 0 && (
          <div className="text-center p-12 text-gray-500 font-mono">No standings available.</div>
        )}
      </div>
    </div>
  );
};

export default StandingsTable;
