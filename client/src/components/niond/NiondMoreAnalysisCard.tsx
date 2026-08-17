import React, { useState } from 'react';
import { ChevronRight, BarChart3, Heart, X, Download, Loader2, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { downloadCSV } from '../../lib/exportUtils';

interface SellRatioItem {
  name: string;
  destination: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface TopItemDetails {
  name: string;
  destination: string;
  unitsSold: number;
  totalRevenue: number;
  validity: number;
  avgOrderValue: number;
}

export const NiondMoreAnalysisCard: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'ratio' | 'topItem' | null>(null);
  const [loading, setLoading] = useState(false);
  const [ratioData, setRatioData] = useState<SellRatioItem[]>([]);
  const [topItem, setTopItem] = useState<TopItemDetails | null>(null);

  // Fetch store sell ratios from Supabase
  const handleOpenRatioModal = async () => {
    try {
      setActiveModal('ratio');
      setLoading(true);

      const [ordersRes, prodsRes] = await Promise.all([
        supabase.from('orders').select('product_id, amount').limit(3000),
        supabase.from('products').select('prod_id, productName, coverageDestinations')
      ]);

      const orders = ordersRes.data || [];
      const products = prodsRes.data || [];

      const prodMeta = new Map(products.map(p => [p.prod_id, p]));
      const prodMap = new Map<number, { count: number; revenue: number }>();

      let grandTotalRevenue = 0;
      for (const o of orders) {
        const pid = o.product_id || 1001;
        const amt = Number(o.amount) || 0;
        grandTotalRevenue += amt;

        if (!prodMap.has(pid)) {
          prodMap.set(pid, { count: 0, revenue: 0 });
        }
        const cur = prodMap.get(pid)!;
        cur.count += 1;
        cur.revenue += amt;
      }

      const sorted = Array.from(prodMap.entries())
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 5);

      const items: SellRatioItem[] = sorted.map(([pid, stat]) => {
        const p = prodMeta.get(pid);
        const name = p?.productName ? p.productName.trim() : `Product #${pid}`;
        const destination = p?.coverageDestinations ? p.coverageDestinations.trim() : 'Global';
        const pct = grandTotalRevenue > 0 ? (stat.revenue / grandTotalRevenue) * 100 : 0;

        return {
          name,
          destination,
          count: stat.count,
          revenue: stat.revenue,
          percentage: parseFloat(pct.toFixed(1))
        };
      });

      setRatioData(items);
    } catch (err) {
      console.error('Error fetching sell ratio data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch top item sold from Supabase
  const handleOpenTopItemModal = async () => {
    try {
      setActiveModal('topItem');
      setLoading(true);

      const [ordersRes, prodsRes] = await Promise.all([
        supabase.from('orders').select('product_id, amount').limit(3000),
        supabase.from('products').select('prod_id, productName, coverageDestinations, validity')
      ]);

      const orders = ordersRes.data || [];
      const products = prodsRes.data || [];

      const prodMeta = new Map(products.map(p => [p.prod_id, p]));
      const prodMap = new Map<number, { count: number; revenue: number }>();

      for (const o of orders) {
        const pid = o.product_id || 1001;
        const amt = Number(o.amount) || 0;
        if (!prodMap.has(pid)) {
          prodMap.set(pid, { count: 0, revenue: 0 });
        }
        const cur = prodMap.get(pid)!;
        cur.count += 1;
        cur.revenue += amt;
      }

      const topPair = Array.from(prodMap.entries())
        .sort((a, b) => b[1].revenue - a[1].revenue)[0];

      if (topPair) {
        const [pid, stat] = topPair;
        const p = prodMeta.get(pid);
        setTopItem({
          name: p?.productName ? p.productName.trim() : `Product #${pid}`,
          destination: p?.coverageDestinations ? p.coverageDestinations.trim() : 'Global',
          unitsSold: stat.count,
          totalRevenue: stat.revenue,
          validity: p?.validity || 30,
          avgOrderValue: stat.count > 0 ? stat.revenue / stat.count : 0
        });
      }
    } catch (err) {
      console.error('Error fetching top item sold:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportRatioCSV = () => {
    if (ratioData.length === 0) return;
    const exportRows = ratioData.map(r => ({
      ProductName: r.name,
      CoverageDestination: r.destination,
      UnitsSold: r.count,
      TotalRevenueAmount: '₹' + r.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      RevenueSharePercentage: `${r.percentage}%`
    }));
    downloadCSV('store_sell_ratio_analysis.csv', exportRows);
  };

  const exportTopItemCSV = () => {
    if (!topItem) return;
    downloadCSV('top_item_sold_analysis.csv', [{
      ProductName: topItem.name,
      CoverageDestination: topItem.destination,
      UnitsSold: `${topItem.unitsSold} Units`,
      TotalRevenue: '₹' + topItem.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
      AverageOrderValue: '₹' + topItem.avgOrderValue.toFixed(2),
      ValidityDays: `${topItem.validity} Days`
    }]);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full min-h-[260px] select-none">
      <div>
        <h3 className="text-lg font-extrabold text-[#111827]">More Analysis</h3>
        <p className="text-xs font-medium text-gray-400 mt-0.5">There are more to view</p>

        <div className="mt-5 space-y-3">
          {/* Store Sell Ratio Button */}
          <button
            onClick={handleOpenRatioModal}
            className="w-full bg-gray-50/80 hover:bg-blue-50/60 border border-gray-100 hover:border-blue-200 rounded-2xl p-3.5 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-gray-700 shadow-xs group-hover:text-blue-600">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-xs text-[#111827] group-hover:text-blue-600 transition-colors">Store Sell Ratio</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all" />
          </button>

          {/* Top Item Sold Button */}
          <button
            onClick={handleOpenTopItemModal}
            className="w-full bg-gray-50/80 hover:bg-rose-50/60 border border-gray-100 hover:border-rose-200 rounded-2xl p-3.5 flex items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-gray-700 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-extrabold text-xs text-[#111827] group-hover:text-rose-600 transition-colors">Top item sold</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-rose-600 transition-all" />
          </button>
        </div>
      </div>

      <div className="pt-3 text-[10px] font-bold text-gray-400 flex items-center gap-1.5 justify-end">
        <span>Analysis created by</span>
        <div className="w-4 h-4 rounded-full bg-[#C6F235] text-[#111827] flex items-center justify-center font-black text-[9px]">
          N
        </div>
      </div>

      {/* Modal 1: Store Sell Ratio */}
      {activeModal === 'ratio' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-xl font-extrabold text-[#111827]">Store Sell Ratio Analysis</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400">Live sales share breakdown per product computed from Supabase orders</p>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
                <span className="text-xs font-bold text-gray-400">Computing live sell ratios...</span>
              </div>
            ) : (
              <div className="space-y-4 my-2">
                {ratioData.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#111827]">
                      <span className="max-w-[280px] truncate" title={item.name}>{item.name}</span>
                      <span className="font-mono text-blue-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.percentage * 2)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 pt-0.5">
                      <span>Location: {item.destination}</span>
                      <span>{item.count} Orders (₹{(item.revenue / 1000).toFixed(2)}K)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={exportRatioCSV}
                className="px-4 py-2.5 rounded-xl bg-[#C6F235] hover:bg-[#b5e024] text-[#111827] font-extrabold text-xs flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Top Item Sold */}
      {activeModal === 'topItem' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-xl font-extrabold text-[#111827]">Top Item Sold</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                <span className="text-xs font-bold text-gray-400">Finding #1 best seller...</span>
              </div>
            ) : topItem ? (
              <div className="space-y-4">
                {/* Spotlight Card */}
                <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-5 rounded-3xl border border-rose-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-rose-500 text-white flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      #1 Best Seller
                    </span>
                    <span className="text-xs font-mono font-extrabold text-rose-600 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> High Demand
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-extrabold text-[#111827]">{topItem.name}</h4>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">Destination: {topItem.destination}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/80 p-3 rounded-2xl border border-rose-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Revenue</span>
                      <span className="text-base font-extrabold text-[#111827] font-mono">
                        ₹{topItem.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="bg-white/80 p-3 rounded-2xl border border-rose-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Units Sold</span>
                      <span className="text-base font-extrabold text-[#111827] font-mono">
                        {topItem.unitsSold} Orders
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                  <span>Validity Duration: {topItem.validity} Days</span>
                  <span>Avg Order: ₹{topItem.avgOrderValue.toFixed(2)}</span>
                </div>
              </div>
            ) : null}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={exportTopItemCSV}
                className="px-4 py-2.5 rounded-xl bg-[#C6F235] hover:bg-[#b5e024] text-[#111827] font-extrabold text-xs flex items-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
