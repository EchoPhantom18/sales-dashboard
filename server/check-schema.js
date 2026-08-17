import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatusColumns() {
  const { data } = await supabase.from('orders').select('*').limit(20);
  console.log('Sample 20 orders:');
  data?.forEach(o => {
    console.log(`order_no: ${o.order_no}, amount: ${o.amount}, discount: ${o.discount_amount}, created_by: ${o.created_by}`);
  });
}

checkStatusColumns();
