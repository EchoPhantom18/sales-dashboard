import React, { useState, useEffect, useCallback } from 'react';
import { downloadCSV } from '../../lib/exportUtils';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  location: string;
  sell: string;
  amount: string;
}

interface NiondTopStoreTableProps {
  stores?: Store[];
}

export const NiondTopStoreTable: React.FC<NiondTopStoreTableProps> = ({ stores: propsStores }) => {
  const [stores, setStores] = useState<Store[]>(propsStores || []);
  const [loading, setLoading] = useState<boolean>(!propsStores || propsStores.length === 0);

  const fetchLiveTopStores = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch live orders and products from Supabase
      const [ordersRes, prodsRes] = await Promise.all([
        supabase.from('orders').select('product_id, amount').limit(2000),
        supabase.from('products').select('prod_id, productName, coverageDestinations')
      ]);

      const orders = ordersRes.data || [];
      const products = prodsRes.data || [];

      if (orders.length > 0) {
        const prodMap = new Map<number, { count: number; totalAmount: number }>();
        for (const o of orders) {
          const pid = o.product_id;
          if (!pid) continue;
          const amt = Number(o.amount) || 0;
          if (!prodMap.has(pid)) {
            prodMap.set(pid, { count: 0, totalAmount: 0 });
          }
          const cur = prodMap.get(pid)!;
          cur.count += 1;
          cur.totalAmount += amt;
        }

        const prodMeta = new Map(products.map(p => [p.prod_id, p]));

        const sortedPids = Array.from(prodMap.entries())
          .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
          .slice(0, 5);

        const mappedStores: Store[] = sortedPids.map(([pid, stat], idx) => {
          const p = prodMeta.get(pid);
          const name = p?.productName ? p.productName.trim() : `Product #${pid}`;
          const location = p?.coverageDestinations ? p.coverageDestinations.trim() : 'Global';
          const kAmount = '₹' + (stat.totalAmount / 1000).toFixed(2) + 'K';

          return {
            id: String(idx + 1),
            name: name,
            location: location,
            sell: `${stat.count} Quantity`,
            amount: kAmount
          };
        });

        setStores(mappedStores);
      }
    } catch (err) {
      console.error('Error fetching live top stores from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveTopStores();

    // Subscribe to realtime orders changes
    const channel = supabase
      .channel('realtime-top-stores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchLiveTopStores();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLiveTopStores]);

  const handleShare = () => {
    downloadCSV('top_stores_sales.csv', stores);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full select-none">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#111827]">Top Store & Products</h3>
            <p className="text-[11px] font-medium text-gray-400">Live sales aggregated from Supabase orders</p>
          </div>
          <button
            onClick={handleShare}
            className="px-4 py-1.5 rounded-xl bg-[#C6F235] hover:bg-[#b5e024] text-[#111827] font-extrabold text-xs transition-all shadow-xs"
          >
            Export
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
              <span className="text-xs font-bold text-gray-400">Loading live top stores from Supabase...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-bold">Store / Product Name</th>
                  <th className="pb-3 font-bold">Location</th>
                  <th className="pb-3 font-bold">Sell</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 font-extrabold text-[#111827] max-w-xs truncate" title={s.name}>{s.name}</td>
                    <td className="py-3.5 font-bold text-gray-500 max-w-[140px] truncate" title={s.location}>{s.location}</td>
                    <td className="py-3.5 font-bold text-gray-500">{s.sell}</td>
                    <td className="py-3.5 font-mono font-extrabold text-[#111827] text-right">{s.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
