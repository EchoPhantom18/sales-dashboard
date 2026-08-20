import { MoreHorizontal } from 'lucide-react';
import type { RecentDeal } from '../../types';
import { getInitials, avatarColors } from '../../lib/constants';

interface RecentDealsTableProps {
  deals: RecentDeal[];
}

export default function RecentDealsTable({ deals }: RecentDealsTableProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Recent Deals</h3>
        <button className="text-xs text-primary-500 font-medium hover:text-primary-600">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="pb-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="pb-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">Time</th>
              <th className="pb-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider w-8"></th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal, i) => (
              <tr key={deal.id} className="border-t border-gray-50">
                <td className="py-3 text-sm font-medium text-gray-600">{deal.deal_id}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColors[i % avatarColors.length]}`}>
                      {getInitials(deal.customer_name)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{deal.customer_name}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-400">{deal.time_ago}</td>
                <td className="py-3">
                  <button className="p-1 rounded hover:bg-gray-100">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
