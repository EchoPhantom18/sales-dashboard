import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { CalendarEntry } from '../../types';
import { calendarCategories } from '../../lib/constants';

interface CalendarWidgetProps {
  entries: CalendarEntry[];
}

export default function CalendarWidget({ entries }: CalendarWidgetProps) {
  const [activeCategory, setActiveCategory] = useState(calendarCategories[0]);

  const grouped = entries.reduce<Record<string, CalendarEntry[]>>((acc, entry) => {
    const key = entry.day_label;
    if (!acc[key]) acc[key] = [];
    if (entry.category === activeCategory) acc[key].push(entry);
    return acc;
  }, {});

  const days = Object.entries(grouped);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Sales Calendar</h3>
        <select className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
          <option>Week 4</option>
          <option>Week 3</option>
        </select>
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto">
        {calendarCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary-50 text-primary-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {days.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No entries for this category</p>
        )}
        {days.map(([dayLabel, dayEntries]) => (
          <div key={dayLabel}>
            {dayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm font-medium text-gray-700 w-16">{entry.day_label}</span>
                {entry.is_available ? (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>Available slot</span>
                    <button className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center hover:border-primary-400 hover:text-primary-400 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2.5 py-1 rounded-lg">
                    {entry.sales_count} sales
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
