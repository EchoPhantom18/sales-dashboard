import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, CheckCircle2, Clock, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TransactionRecord {
  id: string | number;
  order_no: number;
  customer_name: string;
  channel: string;
  status: 'closed' | 'pending';
  date: string;
  amount: number;
}

export const TransactionsView: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'closed' | 'pending'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Modal & Notifications
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [channel, setChannel] = useState('Direct Sales');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Base query on orders table
      let q = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('order_date_time', { ascending: false });

      // Apply status filter
      if (statusFilter === 'closed') {
        q = q.gt('amount', 0);
      } else if (statusFilter === 'pending') {
        q = q.eq('amount', 0);
      }

      // Apply search filter
      if (search.trim()) {
        const searchTerm = search.trim();
        // If search is numeric, search order_no
        if (!isNaN(Number(searchTerm))) {
          q = q.eq('order_no', Number(searchTerm));
        } else {
          // Search user_ids matching name in users table first
          const { data: matchedUsers } = await supabase
            .from('users')
            .select('user_id')
            .ilike('name', `%${searchTerm}%`)
            .limit(100);

          const userIds = matchedUsers ? matchedUsers.map((u) => u.user_id) : [];
          if (userIds.length > 0) {
            q = q.in('user_id', userIds);
          } else {
            // No matching user name found
            setTransactions([]);
            setTotalCount(0);
            setLoading(false);
            return;
          }
        }
      }

      // Execute paginated query
      const { data: orders, count, error: ordersErr } = await q.range(from, to);

      if (ordersErr) {
        throw new Error(ordersErr.message);
      }

      if (!orders || orders.length === 0) {
        setTransactions([]);
        setTotalCount(count || 0);
        setLoading(false);
        return;
      }

      setTotalCount(count || 0);

      // Collect user_ids and product_ids for lookup
      const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))];
      const productIds = [...new Set(orders.map((o) => o.product_id).filter(Boolean))];

      // Fetch user names & product names concurrently
      const [usersRes, prodsRes] = await Promise.all([
        userIds.length > 0
          ? supabase.from('users').select('user_id, name').in('user_id', userIds)
          : Promise.resolve({ data: [] }),
        productIds.length > 0
          ? supabase.from('products').select('prod_id, productName, coverageDestinations').in('prod_id', productIds)
          : Promise.resolve({ data: [] }),
      ]);

      const userMap = new Map((usersRes.data || []).map((u: any) => [u.user_id, u.name]));
      const prodMap = new Map(
        (prodsRes.data || []).map((p: any) => [
          p.prod_id,
          p.productName || p.coverageDestinations || 'Direct',
        ])
      );

      const mapped: TransactionRecord[] = orders.map((o: any) => {
        const rawName = userMap.get(o.user_id);
        const cleanName = rawName && typeof rawName === 'string' && rawName.trim() ? rawName.trim() : `User #${o.user_id || o.order_no}`;
        const prodName = prodMap.get(o.product_id) || 'Direct Sales';
        const numAmount = typeof o.amount === 'number' ? o.amount : parseFloat(o.amount) || 0;
        const statusVal: 'closed' | 'pending' = numAmount > 0 ? 'closed' : 'pending';

        return {
          id: o.order_no,
          order_no: o.order_no,
          customer_name: cleanName,
          channel: prodName,
          status: statusVal,
          date: o.order_date_time || 'Today',
          amount: numAmount,
        };
      });

      setTransactions(mapped);
    } catch (err: any) {
      console.error('Error fetching transactions from orders:', err);
      setError(err?.message || 'Failed to connect to Supabase orders table');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Realtime Subscription on orders table
  useEffect(() => {
    const channel = supabase
      .channel('realtime-orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTransactions]);

  // Reset page when filter or search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (st: 'all' | 'closed' | 'pending') => {
    setStatusFilter(st);
    setPage(1);
  };

  // Date Formatter
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Today';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) return 'Today';
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return String(dateStr);
    }
  };

  // Currency Formatter
  const formatCurrency = (val: number | null | undefined): string => {
    if (val == null || isNaN(val)) return '₹0.00';
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Create New Transaction Handler
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amount) return;
    try {
      setSubmitting(true);
      const numAmount = parseFloat(amount) || 1000;
      const newOrderNo = Math.floor(100000 + Math.random() * 900000);

      // Insert into orders
      const { error: insertErr } = await supabase.from('orders').insert({
        order_no: newOrderNo,
        order_date_time: new Date().toISOString().split('T')[0],
        user_id: 1001,
        product_id: 1001,
        amount: numAmount,
        discount_amount: 0,
        created_by: 1001,
      });

      if (insertErr) throw insertErr;

      setModalOpen(false);
      setCustomerName('');
      setAmount('');
      setToast(`Transaction #${newOrderNo} created successfully!`);
      setTimeout(() => setToast(null), 3500);
      loadTransactions();
    } catch (err: any) {
      console.error('Transaction creation error:', err);
      setToast(`Error creating order: ${err?.message || 'Check database permissions'}`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#111827]">Transactions & Sales History</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Real-time ledger connected live to Supabase <code className="bg-gray-200 text-gray-700 px-1 rounded">orders</code> table
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="h-10 px-5 rounded-2xl bg-[#C6F235] hover:bg-[#b5e024] text-[#111827] font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative min-w-[280px]">
          <input
            type="text"
            placeholder="Search customer name or order #..."
            value={search}
            onChange={handleSearchChange}
            className="w-full h-10 pl-10 pr-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2563EB]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl">
          {(['all', 'closed', 'pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Transactions Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm min-h-[420px] flex flex-col justify-between">
        {/* State 1: ERROR STATE */}
        {error ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111827]">Unable to load transactions</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm">{error}</p>
            </div>
            <button
              onClick={() => loadTransactions()}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-extrabold text-xs shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : loading ? (
          /* State 2: SKELETON LOADING STATE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-bold">Order #</th>
                  <th className="pb-3 font-bold">Customer / User</th>
                  <th className="pb-3 font-bold">Channel / Destination</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4"><div className="h-4 w-12 bg-gray-200 rounded" /></td>
                    <td className="py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                    <td className="py-4"><div className="h-4 w-48 bg-gray-200 rounded" /></td>
                    <td className="py-4"><div className="h-4 w-16 bg-gray-200 rounded-full" /></td>
                    <td className="py-4"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                    <td className="py-4 text-right"><div className="h-4 w-16 bg-gray-200 rounded ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : transactions.length === 0 ? (
          /* State 3: EMPTY STATE */
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#111827]">
              {search.trim() || statusFilter !== 'all' ? 'No matching transactions' : 'No transactions found'}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm">
              {search.trim()
                ? `No orders matching "${search}" were found in Supabase.`
                : 'There are currently no transaction records in the orders table.'}
            </p>
          </div>
        ) : (
          /* State 4: REAL DATA TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-bold">Order #</th>
                  <th className="pb-3 font-bold">Customer / User</th>
                  <th className="pb-3 font-bold">Channel / Destination</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold">Date</th>
                  <th className="pb-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-mono font-bold text-gray-400">#{t.order_no}</td>
                    <td className="py-4 font-extrabold text-[#111827]">{t.customer_name}</td>
                    <td className="py-4 font-bold text-gray-500 max-w-xs truncate" title={t.channel}>
                      {t.channel}
                    </td>
                    <td className="py-4 font-bold">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                          t.status === 'closed'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {t.status === 'closed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {t.status === 'closed' ? 'Closed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 font-medium">{formatDate(t.date)}</td>
                    <td className="py-4 font-mono font-extrabold text-[#111827] text-right text-sm">
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        {!loading && !error && totalCount > 0 && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs select-none">
            <span className="font-bold text-gray-400">
              Showing <span className="text-[#111827]">{(page - 1) * pageSize + 1}</span>–
              <span className="text-[#111827]">{Math.min(page * pageSize, totalCount)}</span> of{' '}
              <span className="text-[#111827]">{totalCount.toLocaleString()}</span> transactions
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-2">
                <span className="font-extrabold text-xs text-[#111827]">Page {page}</span>
                <span className="text-gray-400">of {totalPages}</span>
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-[#111827]">Create New Sale Transaction</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shakuntala"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Sales Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="Direct Sales">Direct Sales</option>
                  <option value="Plastic SIM - Thailand">Plastic SIM - Thailand</option>
                  <option value="eSIM - Singapore, Malaysia">eSIM - Singapore, Malaysia</option>
                  <option value="Plastic SIM - Sri Lanka">Plastic SIM - Sri Lanka</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="761.86"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium font-mono focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-extrabold shadow-md"
                >
                  {submitting ? 'Creating...' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
