import { ShoppingBag, UserPlus, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardMetrics } from '../../types';
import { formatCurrency } from '../../lib/constants';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  iconBg: string;
}

function MetricCard({ title, value, change, icon: Icon, iconBg }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card flex-1 min-w-0">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className="w-[18px] h-[18px] text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-gray-400">From last week</span>
      </div>
    </div>
  );
}

interface MetricsRowProps {
  metrics: DashboardMetrics | null;
}

export default function MetricsRow({ metrics }: MetricsRowProps) {
  if (!metrics) return null;

  const cards = [
    {
      title: 'New Orders',
      value: metrics.new_orders.toLocaleString(),
      change: metrics.new_orders_change,
      icon: ShoppingBag,
      iconBg: 'bg-primary-400',
    },
    {
      title: 'Leads Converted',
      value: metrics.leads_converted.toLocaleString(),
      change: metrics.leads_change,
      icon: UserPlus,
      iconBg: 'bg-blue-400',
    },
    {
      title: 'Deals Closed',
      value: metrics.deals_closed.toLocaleString(),
      change: metrics.deals_change,
      icon: CheckCircle,
      iconBg: 'bg-pink-400',
    },
    {
      title: 'Revenue',
      value: formatCurrency(metrics.revenue),
      change: metrics.revenue_change,
      icon: DollarSign,
      iconBg: 'bg-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}
