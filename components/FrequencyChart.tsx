import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ALPHABET, ENGLISH_FREQUENCIES } from '../constants';

interface FrequencyChartProps {
  text: string;
}

const FrequencyChart: React.FC<FrequencyChartProps> = ({ text }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalLetters = 0;
    
    // Initialize
    ALPHABET.split('').forEach(l => counts[l] = 0);

    // Count
    if (text) {
      text.toUpperCase().split('').forEach(char => {
        if (ALPHABET.includes(char)) {
          counts[char]++;
          totalLetters++;
        }
      });
    }

    // Format
    return ALPHABET.split('').map(letter => {
      const freq = totalLetters > 0 ? (counts[letter] / totalLetters) * 100 : 0;
      return {
        letter,
        current: freq,
        english: ENGLISH_FREQUENCIES[letter] || 0
      };
    });
  }, [text]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-green-900/50 p-2 text-xs text-green-400 font-mono shadow-[0_0_15px_rgba(0,0,0,0.8)] z-50 rounded-sm">
          <p className="font-bold mb-1 border-b border-green-900/30 pb-1 text-white">CHAR: {label}</p>
          <p>FREQ: <span className="text-white">{payload[0].value.toFixed(1)}%</span></p>
          <p className="text-neutral-500">STD: {payload[0].payload.english.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-48 md:h-64 bg-[#0a0a0a] rounded-lg p-3 md:p-4 border border-neutral-800 flex flex-col shadow-inner">
      <div className="text-[10px] md:text-xs text-center text-neutral-500 mb-2 font-mono uppercase tracking-widest flex justify-between px-2 items-center">
        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Frequency Analysis</span>
        <div className="flex gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-500 rounded-sm shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span> SIGNAL</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-neutral-600 rounded-sm"></span> MODEL</span>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0 relative">
        {/* Grid lines background visual */}
        <div className="absolute inset-0 border-t border-neutral-800/50 pointer-events-none top-1/4"></div>
        <div className="absolute inset-0 border-t border-neutral-800/50 pointer-events-none top-2/4"></div>
        <div className="absolute inset-0 border-t border-neutral-800/50 pointer-events-none top-3/4"></div>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -25 }} barGap={0}>
            <XAxis 
              dataKey="letter" 
              tick={{ fill: '#525252', fontSize: 9, fontFamily: 'monospace' }} 
              tickLine={false}
              interval={1}
              minTickGap={2}
              axisLine={{ stroke: '#262626' }}
            />
            <YAxis 
              tick={{ fill: '#525252', fontSize: 9, fontFamily: 'monospace' }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.03)'}} />
            <Bar dataKey="current" fill="#eab308" radius={[2, 2, 0, 0]} animationDuration={800} isAnimationActive={true}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.letter === 'E' || entry.letter === 'T' ? '#fbbf24' : '#eab308'} 
                  className="hover:opacity-80 transition-opacity cursor-crosshair"
                />
              ))}
            </Bar>
            <Bar dataKey="english" fill="#404040" radius={[2, 2, 0, 0]} opacity={0.3} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FrequencyChart;