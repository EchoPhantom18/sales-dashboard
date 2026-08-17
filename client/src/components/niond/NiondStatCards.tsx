import React from 'react';
import { BookOpen, Laptop, Calendar } from 'lucide-react';
import type { DashboardMetrics } from '../../types';

interface NiondStatCardsProps {
  metrics?: DashboardMetrics | null;
  selectedMonth?: string | null;
  selectedDate?: string | null;
}

export const NiondStatCards: React.FC<NiondStatCardsProps> = ({
  metrics,
  selectedMonth = null,
  selectedDate = null
}) => {
  // Monthly Data Map for Filtered View
  const monthlyStats: Record<string, { total: string; avg: string; conv: string; convSub: string; label: string }> = {
    '2026-02': { total: '290.16K', avg: '14.50K', conv: '81.20%', convSub: '+12.4% vs Jan 2026', label: 'February 2026' },
    '2026-01': { total: '215.32K', avg: '11.96K', conv: '72.86%', convSub: '+4.12% vs Dec 2025', label: 'January 2026' },
    '2026-03': { total: '201.46K', avg: '12.59K', conv: '76.40%', convSub: '+2.54% vs Feb 2026', label: 'March 2026' },
    '2026-07': { total: '312.40K', avg: '15.62K', conv: '85.40%', convSub: '+14.8% vs Jun 2026', label: 'July 2026' },
    '2025-12': { total: '195.41K', avg: '10.85K', conv: '68.90%', convSub: '+3.10% vs Nov 2025', label: 'December 2025' },
    '2025-11': { total: '182.30K', avg: '9.60K', conv: '65.40%', convSub: '+1.80% vs Oct 2025', label: 'November 2025' },
  };

  // Determine active filter state
  let activeStat: { total: string; avg: string; conv: string; convSub: string; label: string } | null = null;

  if (selectedDate) {
    // Generate deterministic single-day stats based on selectedDate
    const dateNum = selectedDate.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
    const dayTotal = (12.5 + (dateNum % 15) * 1.2).toFixed(2);
    const dayAvg = (1.2 + (dateNum % 5) * 0.4).toFixed(2);
    const dayConv = (75.0 + (dateNum % 15)).toFixed(1);

    activeStat = {
      total: `${dayTotal}K`,
      avg: `${dayAvg}K`,
      conv: `${dayConv}%`,
      convSub: `Single day volume on ${selectedDate}`,
      label: `Date: ${selectedDate}`,
    };
  } else if (selectedMonth) {
    if (monthlyStats[selectedMonth]) {
      activeStat = monthlyStats[selectedMonth];
    } else {
      activeStat = {
        total: '250.00K',
        avg: '12.50K',
        conv: '78.50%',
        convSub: `Filtered for ${selectedMonth}`,
        label: selectedMonth,
      };
    }
  }

  const isFiltered = !!activeStat;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 select-none">
      {/* Card 1: Total Earning */}
      <div className="bg-[#E2DCFF] rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[155px] relative overflow-hidden">
        {isFiltered && (
          <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-200/80 text-purple-900 flex items-center gap-1 max-w-[140px] truncate">
            <Calendar className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{activeStat?.label}</span>
          </span>
        )}

        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
            <span>Total Earning</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#111827] font-mono tracking-tight mt-3">
            {isFiltered ? activeStat?.total : '242.65K'}
          </h2>
        </div>
        <p className="text-[11px] font-semibold text-gray-500 truncate">
          {isFiltered ? `Filtered for ${activeStat?.label}` : 'From the running month'}
        </p>
      </div>

      {/* Card 2: Average Earning */}
      <div className="bg-[#D6E6FF] rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[155px] relative overflow-hidden">
        {isFiltered && (
          <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-200/80 text-blue-900 flex items-center gap-1 max-w-[140px] truncate">
            <Calendar className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{activeStat?.label}</span>
          </span>
        )}

        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
            <span>Average Earning</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#111827] font-mono tracking-tight mt-3">
            {isFiltered ? activeStat?.avg : '17.347K'}
          </h2>
        </div>
        <p className="text-[11px] font-semibold text-gray-500 truncate">
          {isFiltered ? `Earning on ${activeStat?.label}` : 'Daily Earning of this month'}
        </p>
      </div>

      {/* Card 3: Conversation Rate */}
      <div className="bg-[#C1F4D6] rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[155px] relative overflow-hidden">
        {isFiltered && (
          <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-200/80 text-emerald-900 flex items-center gap-1 max-w-[140px] truncate">
            <Calendar className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{activeStat?.label}</span>
          </span>
        )}

        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
            <span>Conversation Rate</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#111827] font-mono tracking-tight mt-3">
            {isFiltered ? activeStat?.conv : '74.86%'}
          </h2>
        </div>
        <p className="text-[11px] font-semibold text-emerald-800 truncate">
          {isFiltered ? activeStat?.convSub : '+6.04% greater than last month'}
        </p>
      </div>

      {/* Card 4: Upgrade to Pro */}
      <div className="bg-[#0E8585] text-white rounded-3xl p-5 shadow-md flex flex-col justify-between h-[155px] relative overflow-hidden">
        {/* Decorative icons */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-30">
          <BookOpen className="w-6 h-6" />
          <Laptop className="w-6 h-6" />
        </div>

        <div>
          <span className="text-xs font-bold tracking-wide text-white/90">
            Upgrade to Pro
          </span>
          <div className="mt-2">
            <h2 className="text-2xl font-extrabold font-mono tracking-tight text-white">
              $4.20 <span className="text-xs font-medium text-white/70">/ Month</span>
            </h2>
            <p className="text-[11px] text-white/80 font-medium mt-0.5">
              $50 Billed Annually
            </p>
          </div>
        </div>

        <button className="w-max px-5 py-2 rounded-xl bg-[#C6F235] hover:bg-[#b5e024] text-[#111827] font-extrabold text-xs shadow-sm transition-all hover:scale-105">
          Upgrade Now
        </button>
      </div>
    </div>
  );
};
