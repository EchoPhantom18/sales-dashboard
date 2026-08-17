-- Seed data for Sales Dashboard
-- Run AFTER schema.sql in Supabase SQL Editor

TRUNCATE dashboard_metrics, sales_performance, sales_channels, revenue_overview,
  channel_revenue, weekly_sales, recent_deals, calendar_entries, tasks, sales CASCADE;

INSERT INTO dashboard_metrics (new_orders, leads_converted, deals_closed, revenue, new_orders_change, leads_change, deals_change, revenue_change)
VALUES (845, 221, 150, 35034.00, 8.70, 8.70, -8.70, 8.70);

INSERT INTO sales_performance (day_label, day_order, percentage, change_pct) VALUES
  ('S', 0, 42, 4), ('M', 1, 58, 6), ('T', 2, 46, 6), ('W', 3, 72, 8),
  ('T', 4, 65, 5), ('F', 5, 88, 10), ('S', 6, 54, 3);

INSERT INTO sales_channels (channel, percentage, color) VALUES
  ('Direct Sales', 61, '#A78BFA'),
  ('Website', 13, '#60A5FA'),
  ('Social Media', 6, '#F472B6'),
  ('Referrals', 11, '#34D399'),
  ('Others', 3, '#FBBF24');

INSERT INTO revenue_overview (total_revenue, offline_revenue, platform_revenue)
VALUES (4123457.00, 1850000.00, 2273457.00);

INSERT INTO channel_revenue (channel, percentage, sort_order) VALUES
  ('Website', 76, 1), ('Referrals', 76, 2), ('Social Media', 76, 3),
  ('Direct Sales', 76, 4), ('Others', 76, 5);

INSERT INTO weekly_sales (sale_date, count, is_projected) VALUES
  ('2026-01-10', 45, false), ('2026-01-11', 62, false), ('2026-01-12', 38, false),
  ('2026-01-13', 71, false), ('2026-01-14', 55, true), ('2026-01-15', 48, true),
  ('2026-01-16', 67, true);

INSERT INTO recent_deals (deal_id, customer_name, avatar_url, time_ago, amount) VALUES
  ('#1234', 'Acme Corp', NULL, '10 minutes ago', 12500.00),
  ('#1235', 'TechStart Inc', NULL, '25 minutes ago', 8750.00),
  ('#1236', 'Global Retail', NULL, '1 hour ago', 22000.00),
  ('#1237', 'Nova Solutions', NULL, '2 hours ago', 5400.00),
  ('#1238', 'Blue Ocean Ltd', NULL, '3 hours ago', 15800.00);

INSERT INTO calendar_entries (entry_date, day_label, category, sales_count, is_available, week_number) VALUES
  ('2026-01-20', '20 Mon', 'Enterprise', 12, false, 4),
  ('2026-01-20', '20 Mon', 'SMB', 8, false, 4),
  ('2026-01-20', '20 Mon', 'Startup', NULL, true, 4),
  ('2026-01-21', '21 Tue', 'Enterprise', 15, false, 4),
  ('2026-01-21', '21 Tue', 'SMB', NULL, true, 4),
  ('2026-01-22', '22 Wed', 'Enterprise', 9, false, 4),
  ('2026-01-22', '22 Wed', 'Startup', 6, false, 4),
  ('2026-01-23', '23 Thu', 'SMB', NULL, true, 4),
  ('2026-01-24', '24 Fri', 'Enterprise', 18, false, 4);

INSERT INTO tasks (description, task_date) VALUES
  ('Follow up with Acme Corp on enterprise proposal', '2026-01-20'),
  ('Prepare Q1 sales report for leadership review', '2026-01-21'),
  ('Demo call with TechStart Inc at 10 AM', '2026-01-22'),
  ('Send contract to Global Retail', '2026-01-23'),
  ('Review pipeline for SMB segment', '2026-01-24');

INSERT INTO sales (customer_name, channel, amount, status) VALUES
  ('Acme Corp', 'Direct Sales', 12500.00, 'closed'),
  ('TechStart Inc', 'Website', 8750.00, 'closed'),
  ('Global Retail', 'Referrals', 22000.00, 'closed'),
  ('Nova Solutions', 'Social Media', 5400.00, 'pending'),
  ('Blue Ocean Ltd', 'Direct Sales', 15800.00, 'closed'),
  ('Peak Industries', 'Website', 9200.00, 'pending'),
  ('Summit Group', 'Referrals', 31000.00, 'closed'),
  ('Horizon Tech', 'Direct Sales', 7600.00, 'converted'),
  ('CloudNine SaaS', 'Social Media', 11200.00, 'closed'),
  ('Vertex Labs', 'Website', 4800.00, 'pending');
