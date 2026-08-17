import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { SalesChannel } from '../../types';

interface ChannelDonutProps {
  channels: SalesChannel[];
}

export default function ChannelDonut({ channels }: ChannelDonutProps) {
  const data = channels.map((c) => ({
    name: c.channel,
    value: Number(c.percentage),
    color: c.color,
  }));

  const topChannel = channels.reduce((a, b) =>
    Number(a.percentage) > Number(b.percentage) ? a : b,
  channels[0]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Sales by Channel</h3>
        <select className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
          <option>Monthly</option>
          <option>Quarterly</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2.5 flex-1">
          {channels.map((ch) => (
            <div key={ch.id} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
              <span className="text-xs text-gray-500 flex-1 truncate">{ch.channel}</span>
              <span className="text-xs font-semibold text-gray-700">{ch.percentage}%</span>
            </div>
          ))}
        </div>

        <div className="relative w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-800">{topChannel?.percentage}%</span>
            <span className="text-[10px] text-gray-400">Top channel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
