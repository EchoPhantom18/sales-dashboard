import { Monitor, Globe } from 'lucide-react';
import type { RevenueOverview, ChannelRevenue } from '../../types';
import { formatLargeCurrency } from '../../lib/constants';

interface RevenueCardProps {
  revenue: RevenueOverview | null;
  channelRevenue: ChannelRevenue[];
}

export default function RevenueCard({ revenue, channelRevenue }: RevenueCardProps) {
  if (!revenue) return null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Revenue Overview</h3>
        <select className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
          <option>Monthly</option>
          <option>Quarterly</option>
        </select>
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-4">
        {formatLargeCurrency(Number(revenue.total_revenue))}
      </p>

      <div className="flex gap-6 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Offline revenue</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatLargeCurrency(Number(revenue.offline_revenue))}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Platform revenue</p>
            <p className="text-sm font-semibold text-gray-800">
              {formatLargeCurrency(Number(revenue.platform_revenue))}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {channelRevenue.map((ch) => (
          <div key={ch.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{ch.channel}</span>
              <span className="text-xs font-semibold text-gray-700">{ch.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${ch.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
