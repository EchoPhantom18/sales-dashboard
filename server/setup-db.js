import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const seedData = {
  dashboard_metrics: [{
    new_orders: 845, leads_converted: 221, deals_closed: 150, revenue: 35034.00,
    new_orders_change: 8.70, leads_change: 8.70, deals_change: -8.70, revenue_change: 8.70,
  }],
  sales_performance: [
    { day_label: 'S', day_order: 0, percentage: 42, change_pct: 4 },
    { day_label: 'M', day_order: 1, percentage: 58, change_pct: 6 },
    { day_label: 'T', day_order: 2, percentage: 46, change_pct: 6 },
    { day_label: 'W', day_order: 3, percentage: 72, change_pct: 8 },
    { day_label: 'T', day_order: 4, percentage: 65, change_pct: 5 },
    { day_label: 'F', day_order: 5, percentage: 88, change_pct: 10 },
    { day_label: 'S', day_order: 6, percentage: 54, change_pct: 3 },
  ],
  sales_channels: [
    { channel: 'Direct Sales', percentage: 61, color: '#A78BFA' },
    { channel: 'Website', percentage: 13, color: '#60A5FA' },
    { channel: 'Social Media', percentage: 6, color: '#F472B6' },
    { channel: 'Referrals', percentage: 11, color: '#34D399' },
    { channel: 'Others', percentage: 3, color: '#FBBF24' },
  ],
  revenue_overview: [{
    total_revenue: 4123457.00, offline_revenue: 1850000.00, platform_revenue: 2273457.00,
  }],
  channel_revenue: [
    { channel: 'Website', percentage: 76, sort_order: 1 },
    { channel: 'Referrals', percentage: 76, sort_order: 2 },
    { channel: 'Social Media', percentage: 76, sort_order: 3 },
    { channel: 'Direct Sales', percentage: 76, sort_order: 4 },
    { channel: 'Others', percentage: 76, sort_order: 5 },
  ],
  weekly_sales: [
    { sale_date: '2026-01-10', count: 45, is_projected: false },
    { sale_date: '2026-01-11', count: 62, is_projected: false },
    { sale_date: '2026-01-12', count: 38, is_projected: false },
    { sale_date: '2026-01-13', count: 71, is_projected: false },
    { sale_date: '2026-01-14', count: 55, is_projected: true },
    { sale_date: '2026-01-15', count: 48, is_projected: true },
    { sale_date: '2026-01-16', count: 67, is_projected: true },
  ],
  recent_deals: [
    { deal_id: '#1234', customer_name: 'Acme Corp', time_ago: '10 minutes ago', amount: 12500.00 },
    { deal_id: '#1235', customer_name: 'TechStart Inc', time_ago: '25 minutes ago', amount: 8750.00 },
    { deal_id: '#1236', customer_name: 'Global Retail', time_ago: '1 hour ago', amount: 22000.00 },
    { deal_id: '#1237', customer_name: 'Nova Solutions', time_ago: '2 hours ago', amount: 5400.00 },
    { deal_id: '#1238', customer_name: 'Blue Ocean Ltd', time_ago: '3 hours ago', amount: 15800.00 },
  ],
  calendar_entries: [
    { entry_date: '2026-01-20', day_label: '20 Mon', category: 'Enterprise', sales_count: 12, is_available: false, week_number: 4 },
    { entry_date: '2026-01-20', day_label: '20 Mon', category: 'SMB', sales_count: 8, is_available: false, week_number: 4 },
    { entry_date: '2026-01-20', day_label: '20 Mon', category: 'Startup', sales_count: null, is_available: true, week_number: 4 },
    { entry_date: '2026-01-21', day_label: '21 Tue', category: 'Enterprise', sales_count: 15, is_available: false, week_number: 4 },
    { entry_date: '2026-01-21', day_label: '21 Tue', category: 'SMB', sales_count: null, is_available: true, week_number: 4 },
    { entry_date: '2026-01-22', day_label: '22 Wed', category: 'Enterprise', sales_count: 9, is_available: false, week_number: 4 },
    { entry_date: '2026-01-22', day_label: '22 Wed', category: 'Startup', sales_count: 6, is_available: false, week_number: 4 },
    { entry_date: '2026-01-23', day_label: '23 Thu', category: 'SMB', sales_count: null, is_available: true, week_number: 4 },
    { entry_date: '2026-01-24', day_label: '24 Fri', category: 'Enterprise', sales_count: 18, is_available: false, week_number: 4 },
  ],
  tasks: [
    { description: 'Follow up with Acme Corp on enterprise proposal', task_date: '2026-01-20' },
    { description: 'Prepare Q1 sales report for leadership review', task_date: '2026-01-21' },
    { description: 'Demo call with TechStart Inc at 10 AM', task_date: '2026-01-22' },
    { description: 'Send contract to Global Retail', task_date: '2026-01-23' },
    { description: 'Review pipeline for SMB segment', task_date: '2026-01-24' },
  ],
  sales: [
    { customer_name: 'Acme Corp', channel: 'Direct Sales', amount: 12500.00, status: 'closed' },
    { customer_name: 'TechStart Inc', channel: 'Website', amount: 8750.00, status: 'closed' },
    { customer_name: 'Global Retail', channel: 'Referrals', amount: 22000.00, status: 'closed' },
    { customer_name: 'Nova Solutions', channel: 'Social Media', amount: 5400.00, status: 'pending' },
    { customer_name: 'Blue Ocean Ltd', channel: 'Direct Sales', amount: 15800.00, status: 'closed' },
  ],
};

async function setup() {
  console.log('Setting up Supabase database...\n');
  console.log('NOTE: Tables must be created first. Run supabase/schema.sql in Supabase SQL Editor.\n');

  for (const [table, rows] of Object.entries(seedData)) {
    const { count, error: countError } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error(`❌ ${table}: ${countError.message}`);
      console.error('   → Run supabase/schema.sql in Supabase SQL Editor first.\n');
      continue;
    }

    if (count > 0) {
      console.log(`⏭  ${table}: already has ${count} rows, skipping`);
      continue;
    }

    const { error } = await supabase.from(table).insert(rows);
    if (error) {
      console.error(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table}: seeded ${rows.length} rows`);
    }
  }

  console.log('\nDone!');
}

setup();
