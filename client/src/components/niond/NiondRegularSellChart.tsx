import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { downloadCSV } from '../../lib/exportUtils';

interface NiondRegularSellChartProps {
  performance?: any[];
}

export const NiondRegularSellChart: React.FC<NiondRegularSellChartProps> = ({ performance }) => {
  const defaultData = [
    { day: 'Sun', purple: 22, green: 18 },
    { day: 'Mon', purple: 38, green: 28 },
    { day: 'Tue', purple: 48, green: 32 },
    { day: 'Wed', purple: 30, green: 22 },
    { day: 'Thu', purple: 36, green: 26 },
    { day: 'Fri', purple: 22, green: 15 },
    { day: 'Sat', purple: 42, green: 36 },
  ];

  const chartData = (performance && performance.length > 0)
    ? performance.map(p => ({
        day: p.day_label,
        purple: p.purple_bar || p.percentage || 30,
        green: p.green_bar || Math.round((p.percentage || 30) * 0.7),
      }))
    : defaultData;

  const handleExport = () => {
    downloadCSV('regular_sell_report.csv', chartData);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full min-h-[260px] select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-[#111827]">Regular Sell</h3>
        <button
          onClick={handleExport}
          className="px-4 py-1.5 rounded-xl bg-[#C6F235] hover:bg-[#b5e024] text-[#111827] font-extrabold text-xs transition-all shadow-xs"
        >
          Export
        </button>
      </div>

      <div className="w-full h-44 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Bar dataKey="purple" fill="#C4B5FD" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="green" fill="#86EFAC" radius={[4, 4, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
