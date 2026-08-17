import { useState, useEffect, useCallback } from 'react';
import { NiondSidebar } from './components/layout/NiondSidebar';
import { NiondHeader } from './components/layout/NiondHeader';
import { NiondStatCards } from './components/niond/NiondStatCards';
import { NiondRegularSellChart } from './components/niond/NiondRegularSellChart';
import { NiondMoreAnalysisCard } from './components/niond/NiondMoreAnalysisCard';
import { NiondDailyMeetingCard } from './components/niond/NiondDailyMeetingCard';
import { NiondTopStoreTable } from './components/niond/NiondTopStoreTable';
import { NiondTeamMembersList } from './components/niond/NiondTeamMembersList';

import { StatisticsView } from './components/views/StatisticsView';
import { TransactionsView } from './components/views/TransactionsView';
import { MyTeamView } from './components/views/MyTeamView';
import { SellReportsView } from './components/views/SellReportsView';
import { SettingsView } from './components/views/SettingsView';

import { fetchDashboard } from './lib/api';
import { subscribeToRealtime } from './lib/supabase';
import type { DashboardData } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const result = await fetchDashboard();
      setData(result);
    } catch (err) {
      console.warn('Dashboard fetch warning, using fallback data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    // Subscribe to real-time Postgres changes in Supabase
    const unsubscribe = subscribeToRealtime(() => {
      loadDashboard();
    });
    return () => unsubscribe();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] text-gray-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
          <p className="text-xs font-bold text-gray-500">Loading SalesSphere Dashboard...</p>
        </div>
      </div>
    );
  }

  const d = data;

  const renderActiveView = () => {
    switch (activeTab) {
      case 'Statistics':
        return <StatisticsView data={d} selectedMonth={selectedMonth} selectedDate={selectedDate} />;
      case 'Transaction':
        return <TransactionsView />;
      case 'My Team':
        return <MyTeamView />;
      case 'Sell Reports':
        return <SellReportsView />;
      case 'Settings':
        return <SettingsView />;
      case 'Dashboard':
      default:
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Row 1: Top 4 KPI Cards */}
            <NiondStatCards metrics={d?.metrics} selectedMonth={selectedMonth} selectedDate={selectedDate} />

            {/* Row 2: Regular Sell Chart (50%) + More Analysis (25%) + Daily Meeting (25%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-6">
                <NiondRegularSellChart performance={d?.performance} />
              </div>
              <div className="lg:col-span-3">
                <NiondMoreAnalysisCard />
              </div>
              <div className="lg:col-span-3">
                <NiondDailyMeetingCard />
              </div>
            </div>

            {/* Row 3: Top Store Table (66%) + Team Members (33%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              <div className="lg:col-span-8">
                <NiondTopStoreTable stores={(d as any)?.topStores} />
              </div>
              <div className="lg:col-span-4">
                <NiondTeamMembersList members={(d as any)?.teamMembers} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 font-sans p-4 sm:p-5 lg:p-6 flex gap-6">
      {/* SalesSphere Interactive Left Sidebar */}
      <NiondSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-[1500px] w-full space-y-5">
        {/* Top Header with Calendar Date & Month Selector */}
        <NiondHeader
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Dynamic Workspace View */}
        {renderActiveView()}
      </main>
    </div>
  );
}
