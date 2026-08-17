-- Sales Dashboard Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Metrics snapshot table
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  new_orders INT NOT NULL DEFAULT 0,
  leads_converted INT NOT NULL DEFAULT 0,
  deals_closed INT NOT NULL DEFAULT 0,
  revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  new_orders_change DECIMAL(5,2) DEFAULT 0,
  leads_change DECIMAL(5,2) DEFAULT 0,
  deals_change DECIMAL(5,2) DEFAULT 0,
  revenue_change DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly sales performance (line chart)
CREATE TABLE IF NOT EXISTS sales_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_label TEXT NOT NULL,
  day_order INT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  change_pct DECIMAL(5,2) DEFAULT 0
);

-- Sales by channel (donut chart)
CREATE TABLE IF NOT EXISTS sales_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL UNIQUE,
  percentage DECIMAL(5,2) NOT NULL,
  color TEXT DEFAULT '#A78BFA'
);

-- Revenue overview
CREATE TABLE IF NOT EXISTS revenue_overview (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_revenue DECIMAL(14,2) NOT NULL,
  offline_revenue DECIMAL(14,2) NOT NULL,
  platform_revenue DECIMAL(14,2) NOT NULL
);

-- Channel revenue progress bars
CREATE TABLE IF NOT EXISTS channel_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  sort_order INT DEFAULT 0
);

-- Weekly sales bar chart
CREATE TABLE IF NOT EXISTS weekly_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_date DATE NOT NULL,
  count INT NOT NULL DEFAULT 0,
  is_projected BOOLEAN DEFAULT FALSE
);

-- Recent deals / sales
CREATE TABLE IF NOT EXISTS recent_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  avatar_url TEXT,
  time_ago TEXT NOT NULL,
  amount DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar entries
CREATE TABLE IF NOT EXISTS calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  day_label TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Enterprise',
  sales_count INT,
  is_available BOOLEAN DEFAULT FALSE,
  week_number INT DEFAULT 4
);

-- Tasks / follow-ups
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  task_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full sales records (for search & CRUD)
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  channel TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_overview ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for demo dashboard
CREATE POLICY "Allow all on dashboard_metrics" ON dashboard_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sales_performance" ON sales_performance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sales_channels" ON sales_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on revenue_overview" ON revenue_overview FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on channel_revenue" ON channel_revenue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on weekly_sales" ON weekly_sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on recent_deals" ON recent_deals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on calendar_entries" ON calendar_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on sales" ON sales FOR ALL USING (true) WITH CHECK (true);
