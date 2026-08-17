import { Search, MoreHorizontal, Bell } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-surface-muted">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers, deals..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-72 pl-10 pr-16 py-2 bg-white border border-surface-border rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘ K
          </kbd>
        </div>

        <button className="p-2 rounded-lg hover:bg-white transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>

        <button className="relative p-2 rounded-lg hover:bg-white transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
          TV
        </div>
      </div>
    </header>
  );
}
