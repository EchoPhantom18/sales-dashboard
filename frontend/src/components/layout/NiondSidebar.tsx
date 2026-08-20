import React from 'react';
import { 
  LayoutGrid, 
  BarChart2, 
  Receipt, 
  Users, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface NiondSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const NiondSidebar: React.FC<NiondSidebarProps> = ({ 
  activeTab = 'Dashboard', 
  setActiveTab 
}) => {
  const navItems = [
    { label: 'Dashboard', icon: LayoutGrid },
    { label: 'Statistics', icon: BarChart2 },
    { label: 'Transaction', icon: Receipt },
    { label: 'My Team', icon: Users },
    { label: 'Sell Reports', icon: FileText },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[calc(100vh-2.5rem)] sticky top-5 select-none shrink-0">
      <div className="space-y-8">
        {/* Logo - SalesSphere */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white">
            <div className="flex gap-1 items-center">
              <div className="w-1 h-4 bg-white rounded-full -rotate-12" />
              <div className="w-1 h-5 bg-[#C6F235] rounded-full -rotate-12" />
              <div className="w-1 h-4 bg-white rounded-full -rotate-12" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#111827] font-sans">
            SalesSphere
          </span>
        </div>

        {/* Nav Items */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab && setActiveTab(item.label)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C6F235] text-[#111827] shadow-sm font-extrabold scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#111827]' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile & Logout - Tanmay Admin */}
      <div className="space-y-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
            alt="Tanmay"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-xs text-[#111827]">Tanmay</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Admin</span>
          </div>
        </div>

        <button className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
