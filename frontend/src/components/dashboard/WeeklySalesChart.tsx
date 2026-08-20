import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { WeeklySale } from '../../types';

interface WeeklySalesChartProps {
  data: WeeklySale[];
}

export default function WeeklySalesChart({ data }: WeeklySalesChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: d.count,
    projected: d.is_projected,
  }));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Weekly Sales</h3>
        <select className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '13px' }}
            formatter={(value: number) => [`${value} sales`, 'Count']}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={32}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.projected ? 'transparent' : '#A78BFA'}
                stroke={entry.projected ? '#A78BFA' : 'none'}
                strokeWidth={entry.projected ? 2 : 0}
                strokeDasharray={entry.projected ? '4 4' : '0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
