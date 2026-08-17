import React, { useState } from 'react';
import { MessageSquare, Bell, X, CheckCircle2, Send, Database, User, Settings, LogOut, CheckCheck, Calendar, ChevronDown, Sparkles, RefreshCw } from 'lucide-react';

interface NiondHeaderProps {
  selectedMonth?: string | null;
  onMonthChange?: (month: string | null) => void;
  selectedDate?: string | null;
  onDateChange?: (date: string | null) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isMe?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'sale' | 'meeting' | 'system';
  unread: boolean;
}

export const NiondHeader: React.FC<NiondHeaderProps> = ({
  selectedMonth = null,
  onMonthChange,
  selectedDate = null,
  onDateChange
}) => {
  const [activeModal, setActiveModal] = useState<'chat' | 'notifications' | 'profile' | 'calendar' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Calendar Picker state
  const [pickerYear, setPickerYear] = useState<number>(2026);
  const [filterType, setFilterType] = useState<'month' | 'day'>('month');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Shivani', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', text: 'Hey Tanmay! SalesSphere Thailand sales jumped by 18% today.', time: '10:15 AM' },
    { id: '2', sender: 'Sanika', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', text: 'Daily Sales Sync is set for 8:30 PM IST.', time: '10:22 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [unreadChatCount, setUnreadChatCount] = useState(2);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'n1', title: 'New order #8493 recorded (₹1,250.00)', time: '2 mins ago', type: 'sale', unread: true },
    { id: 'n2', title: 'SalesSphere Strategy Sync scheduled for 8:30 PM', time: '15 mins ago', type: 'meeting', unread: true },
    { id: 'n3', title: 'Supabase Realtime WebSocket Active', time: 'Just now', type: 'system', unread: true },
  ]);
  const unreadNotifCount = notifications.filter(n => n.unread).length;

  const monthsList = [
    { num: '01', short: 'Jan', full: 'January' },
    { num: '02', short: 'Feb', full: 'February' },
    { num: '03', short: 'Mar', full: 'March' },
    { num: '04', short: 'Apr', full: 'April' },
    { num: '05', short: 'May', full: 'May' },
    { num: '06', short: 'Jun', full: 'June' },
    { num: '07', short: 'Jul', full: 'July' },
    { num: '08', short: 'Aug', full: 'August' },
    { num: '09', short: 'Sep', full: 'September' },
    { num: '10', short: 'Oct', full: 'October' },
    { num: '11', short: 'Nov', full: 'November' },
    { num: '12', short: 'Dec', full: 'December' },
  ];

  const handleSelectMonthGrid = (mNum: string, mFull: string) => {
    const monthKey = `${pickerYear}-${mNum}`;
    if (onMonthChange) onMonthChange(monthKey);
    if (onDateChange) onDateChange(null);
    setActiveModal(null);
    setToast(`Filtered dashboard for ${mFull} ${pickerYear}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectSpecificDate = (dateVal: string) => {
    if (!dateVal) return;
    if (onDateChange) onDateChange(dateVal);
    if (onMonthChange) onMonthChange(dateVal.slice(0, 7));
    setActiveModal(null);
    setToast(`Filtered dashboard for ${dateVal}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleClearFilter = () => {
    if (onMonthChange) onMonthChange(null);
    if (onDateChange) onDateChange(null);
    setActiveModal(null);
    setToast('Reset to All Time Average Data');
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectThisMonth = () => {
    const today = new Date();
    const mNum = String(today.getMonth() + 1).padStart(2, '0');
    const yNum = today.getFullYear();
    const monthKey = `${yNum}-${mNum}`;
    if (onMonthChange) onMonthChange(monthKey);
    if (onDateChange) onDateChange(null);
    setActiveModal(null);
    setToast(`Filtered for Running Month (${monthKey})`);
    setTimeout(() => setToast(null), 3000);
  };

  const getDisplayLabel = () => {
    if (selectedDate) {
      return `Date: ${selectedDate}`;
    }
    if (selectedMonth) {
      const [y, m] = selectedMonth.split('-');
      const found = monthsList.find(item => item.num === m);
      return found ? `${found.full} ${y}` : selectedMonth;
    }
    return '14th Aug 2023 • All Time Avg';
  };

  // Send Message Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Tanmay (Admin)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Mark all notifications as read
  const handleMarkAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setToast('Marked all notifications as read');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-2 select-none relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Left Title & Interactive Calendar Date Filter */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight font-sans">
          SalesSphere
        </h1>

        {/* Calendar Month & Date Selector Button */}
        <div className="relative mt-1">
          <button
            onClick={() => setActiveModal(activeModal === 'calendar' ? null : 'calendar')}
            className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedMonth || selectedDate
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs font-extrabold'
                : 'bg-gray-100/80 hover:bg-gray-200/80 border-transparent text-gray-600'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${selectedMonth || selectedDate ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>{getDisplayLabel()}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Calendar Date & Month Selector Popover Modal */}
          {activeModal === 'calendar' && (
            <div className="absolute left-0 mt-2 w-80 bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 z-50 space-y-4 animate-in zoom-in-95">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  <h4 className="font-extrabold text-sm text-[#111827]">Calendar Date & Month Filter</h4>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-900">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle Tabs: Month Grid vs Specific Day */}
              <div className="flex bg-gray-100 p-1 rounded-xl gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFilterType('month')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${filterType === 'month' ? 'bg-white text-[#111827] shadow-xs' : 'text-gray-500'}`}
                >
                  Month View
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('day')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${filterType === 'day' ? 'bg-white text-[#111827] shadow-xs' : 'text-gray-500'}`}
                >
                  Specific Date
                </button>
              </div>

              {filterType === 'month' ? (
                <>
                  {/* Year Header Control */}
                  <div className="bg-gray-50 p-2 rounded-xl flex items-center justify-between border border-gray-100">
                    <span className="text-xs font-mono font-extrabold text-gray-800 px-2">{pickerYear}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setPickerYear(prev => prev - 1)}
                        className="px-2 py-0.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickerYear(prev => prev + 1)}
                        className="px-2 py-0.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* 12-Month Grid Picker */}
                  <div className="grid grid-cols-4 gap-2">
                    {monthsList.map((m) => {
                      const monthKey = `${pickerYear}-${m.num}`;
                      const isSelected = selectedMonth === monthKey && !selectedDate;
                      return (
                        <button
                          key={m.num}
                          type="button"
                          onClick={() => handleSelectMonthGrid(m.num, m.full)}
                          className={`py-3 rounded-xl text-xs font-bold text-center transition-all border ${
                            isSelected
                              ? 'bg-[#2563EB] text-white border-blue-600 shadow-md font-extrabold scale-105'
                              : 'bg-white hover:bg-blue-50/80 border-gray-200 text-gray-800'
                          }`}
                        >
                          {m.short}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Specific Single Day Picker */
                <div className="space-y-3 py-2">
                  <label className="text-xs font-bold text-gray-700 block">Select Exact Date</label>
                  <input
                    type="date"
                    value={selectedDate || ''}
                    onChange={(e) => handleSelectSpecificDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Bottom Quick Action Controls: Clear & This Month */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold">
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSelectThisMonth}
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  This month
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        {/* Chat / Message Button */}
        <div className="relative">
          <button
            onClick={() => {
              setActiveModal(activeModal === 'chat' ? null : 'chat');
              setUnreadChatCount(0);
            }}
            className="w-10 h-10 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center text-gray-700 transition-colors cursor-pointer relative"
            title="Team Messages"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Chat Popover Modal */}
          {activeModal === 'chat' && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl p-4 shadow-2xl border border-gray-100 z-50 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                  <h4 className="font-extrabold text-sm text-[#111827]">SalesSphere Chat & Discussion</h4>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-900">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2.5 items-start ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.avatar} alt={msg.sender} className="w-7 h-7 rounded-full object-cover shrink-0 border border-white" />
                    <div className={`p-2.5 rounded-2xl text-xs space-y-1 ${msg.isMe ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-[10px] opacity-90">{msg.sender}</span>
                        <span className="text-[9px] opacity-70">{msg.time}</span>
                      </div>
                      <p className="font-medium text-xs leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-gray-100">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                />
                <button type="submit" className="w-9 h-9 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Notification Bell Button */}
        <div className="relative">
          <button
            onClick={() => setActiveModal(activeModal === 'notifications' ? null : 'notifications')}
            className="w-10 h-10 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center text-gray-700 transition-colors cursor-pointer relative"
            title="Realtime Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {activeModal === 'notifications' && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl p-4 shadow-2xl border border-gray-100 z-50 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-rose-500" />
                  <h4 className="font-extrabold text-sm text-[#111827]">Live System Notifications</h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMarkAllNotifsRead}
                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 mr-2"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Read All
                  </button>
                  <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                      n.unread ? 'bg-blue-50/60 border-blue-100' : 'bg-gray-50/50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#111827] text-[11px] flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${n.type === 'sale' ? 'bg-emerald-500' : n.type === 'meeting' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                        {n.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400 block text-right">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info - Tanmay Admin */}
        <div className="relative">
          <div
            onClick={() => setActiveModal(activeModal === 'profile' ? null : 'profile')}
            className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-95 transition-opacity"
            title="Profile Menu"
          >
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

          {/* Profile Dropdown Menu */}
          {activeModal === 'profile' && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl p-4 shadow-2xl border border-gray-100 z-50 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Tanmay" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <div>
                  <h4 className="font-extrabold text-sm text-[#111827]">Tanmay</h4>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">System Administrator</p>
                  <p className="text-[10px] font-medium text-gray-400">tanmay@salessphere.com</p>
                </div>
              </div>

              <div className="space-y-1 text-xs font-bold text-gray-700">
                <div className="p-2 rounded-xl hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Admin Profile</span>
                </div>
                <div className="p-2 rounded-xl hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Supabase Live Status</span>
                </div>
                <div className="p-2 rounded-xl hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4 text-purple-600" />
                  <span>Account Settings</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <div className="p-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-extrabold text-xs cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
