import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uksandvhgxacieurpuzc.supabase.co';
const supabaseKey = 'sb_publishable_bVvi1ibi5sFySZtT1i4s0Q_clFcbKIA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMonthlyReport() {
  console.log('Testing Monthly Sales Revenue Summary generation...');
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('order_date_time, amount')
      .limit(5000);

    if (error) {
      console.error('Supabase Query Error:', error);
      return;
    }

    console.log(`Fetched ${orders?.length} orders from Supabase.`);

    const monthMap = new Map();
    for (const o of orders || []) {
      if (!o.order_date_time) continue;
      const monthKey = String(o.order_date_time).slice(0, 7); // YYYY-MM
      const amt = Number(o.amount) || 0;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { count: 0, revenue: 0, maxAmt: 0 });
      }
      const cur = monthMap.get(monthKey);
      cur.count += 1;
      cur.revenue += amt;
      if (amt > cur.maxAmt) cur.maxAmt = amt;
    }

    const report = Array.from(monthMap.entries()).map(([month, stat]) => ({
      Month: month,
      TotalOrders: stat.count,
      TotalRevenue: '₹' + stat.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      AverageOrderAmount: '₹' + (stat.count > 0 ? (stat.revenue / stat.count).toFixed(2) : '0.00'),
      HighestOrderAmount: '₹' + stat.maxAmt.toFixed(2),
    }));

    console.log('--- GENERATED REPORT ---');
    console.table(report);
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

testMonthlyReport();
