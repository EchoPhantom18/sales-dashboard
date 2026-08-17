import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { SalesPerformance } from '../../types';

interface PerformanceChartProps {
  data: SalesPerformance[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map((d) => ({
    day: d.day_label,
    value: Number(d.percentage),
    change: d.change_pct,
  }));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Sales Performance</h3>
        <select className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '13px' }}
            formatter={(value: number, _name: string, props: { payload?: { change?: number } }) => [
              `${value}% +${props.payload?.change ?? 0}%`,
              'Performance',
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#A78BFA"
            strokeWidth={2.5}
            fill="url(#purpleGradient)"
            dot={{ r: 4, fill: '#A78BFA', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
