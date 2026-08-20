export interface DashboardMetrics {
  id: string;
  new_orders: number;
  leads_converted: number;
  deals_closed: number;
  revenue: number;
  new_orders_change: number;
  leads_change: number;
  deals_change: number;
  revenue_change: number;
}

export interface SalesPerformance {
  id: string;
  day_label: string;
  day_order: number;
  percentage: number;
  change_pct: number;
}

export interface SalesChannel {
  id: string;
  channel: string;
  percentage: number;
  color: string;
}

export interface RevenueOverview {
  id: string;
  total_revenue: number;
  offline_revenue: number;
  platform_revenue: number;
}

export interface ChannelRevenue {
  id: string;
  channel: string;
  percentage: number;
  sort_order: number;
}

export interface WeeklySale {
  id: string;
  sale_date: string;
  count: number;
  is_projected: boolean;
}

export interface RecentDeal {
  id: string;
  deal_id: string;
  customer_name: string;
  avatar_url: string | null;
  time_ago: string;
  amount: number;
}

export interface CalendarEntry {
  id: string;
  entry_date: string;
  day_label: string;
  category: string;
  sales_count: number | null;
  is_available: boolean;
  week_number: number;
}

export interface Task {
  id: string;
  description: string;
  task_date: string;
  is_completed: boolean;
}

export interface DashboardData {
  metrics: DashboardMetrics | null;
  performance: SalesPerformance[];
  channels: SalesChannel[];
  revenue: RevenueOverview | null;
  channelRevenue: ChannelRevenue[];
  weeklySales: WeeklySale[];
  recentDeals: RecentDeal[];
  calendar: CalendarEntry[];
  tasks: Task[];
}

export interface Sale {
  id: string;
  customer_name: string;
  channel: string;
  amount: number;
  status: string;
  created_at: string;
}
