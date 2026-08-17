import React, { useState, useEffect } from 'react';
import { Video, Copy, ExternalLink, X, CheckCircle2, Users, CalendarPlus, Plus, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Attendee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export const NiondDailyMeetingCard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Meeting state
  const [meetingTitle, setMeetingTitle] = useState('Daily Meeting');
  const [meetingTime, setMeetingTime] = useState('8:30 PM');
  const [meetingDate, setMeetingDate] = useState('Today');
  const [participantCount, setParticipantCount] = useState('12+ Person');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/niond-sales-sync');

  // Schedule Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('20:30');
  const [newLink, setNewLink] = useState('https://meet.google.com/niond-custom-sync');

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    async function loadAttendees() {
      try {
        const { data: users } = await supabase.from('users').select('user_id, name, user_role').limit(5);
        const defaultAvatars = [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
        ];

        if (users && users.length > 0) {
          const list: Attendee[] = users.slice(0, 3).map((u, idx) => ({
            id: String(u.user_id),
            name: u.name && u.name.trim() ? u.name.trim() : `User #${u.user_id}`,
            role: u.user_role === 1 ? 'Admin' : 'Sales Executive',
            avatar: defaultAvatars[idx % defaultAvatars.length],
          }));

          // Ensure Tanmay Admin is at top
          if (!list.some(a => a.name.toLowerCase().includes('tanmay'))) {
            list.unshift({
              id: 'tanmay-host',
              name: 'Tanmay',
              role: 'Admin (Host)',
              avatar: defaultAvatars[0]
            });
          }
          setAttendees(list.slice(0, 3));
        } else {
          setAttendees([
            { id: '1', name: 'Tanmay', role: 'Admin (Host)', avatar: defaultAvatars[0] },
            { id: '2', name: 'Shivani', role: 'Sales Manager', avatar: defaultAvatars[1] },
            { id: '3', name: 'Sanika', role: 'Sales Co-ordinator', avatar: defaultAvatars[2] },
          ]);
        }
      } catch (err) {
        console.error('Error fetching meeting attendees:', err);
      }
    }
    loadAttendees();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setToast('Meeting link copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setToast(null);
    }, 3000);
  };

  const handleJoinMeeting = () => {
    window.open(meetingUrl, '_blank');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    // Convert 24h time to 12h formatted time
    const [h, m] = newTime.split(':');
    const hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedTimeStr = `${formattedHours}:${m} ${ampm}`;

    setMeetingTitle(newTitle);
    setMeetingTime(formattedTimeStr);
    setMeetingDate(newDate);
    if (newLink) setMeetingUrl(newLink);

    setScheduleModalOpen(false);
    setNewTitle('');
    setToast(`Meeting "${newTitle}" scheduled for ${newDate} at ${formattedTimeStr}!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full min-h-[260px] select-none relative overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-white/20 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Video className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-[#111827] truncate" title={meetingTitle}>
                {meetingTitle}
              </h3>
              <span className="text-[10px] font-bold text-gray-400 block truncate">{participantCount} • {meetingTime}</span>
            </div>
          </div>

          <button
            onClick={() => setScheduleModalOpen(true)}
            className="w-8 h-8 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            title="Schedule New Meeting"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        </div>

        {/* Attendees Stack */}
        <div className="mt-5 flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden shrink-0">
            {attendees.map((a, i) => (
              <img
                key={a.id || i}
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                src={a.avatar}
                alt={a.name}
                title={`${a.name} (${a.role})`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400">They will conduct the meeting</span>
        </div>
      </div>

      {/* Main Full-Width Meeting Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full py-3 rounded-xl bg-[#111827] hover:bg-black text-white font-extrabold text-xs shadow-sm transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 mt-4"
      >
        <Video className="w-4 h-4 text-[#C6F235] shrink-0" />
        <span className="whitespace-nowrap">Click for meeting link</span>
      </button>

      {/* Modal 1: Meeting Details & Join Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#111827]">{meetingTitle}</h3>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Scheduled {meetingDate} • {meetingTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Video Call URL</span>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 gap-2">
                <span className="text-xs font-mono font-bold text-gray-800 truncate">{meetingUrl}</span>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
                  title="Copy URL"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[#111827] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>Host & Key Attendees</span>
              </span>
              <div className="grid grid-cols-1 gap-2">
                {attendees.map((att) => (
                  <div key={att.id} className="flex items-center justify-between bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <img src={att.avatar} alt={att.name} className="w-7 h-7 rounded-full object-cover border border-white" />
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-[#111827]">{att.name}</span>
                        <span className="text-[10px] font-bold text-blue-600">{att.role}</span>
                      </div>
                    </div>
                    {att.role.toLowerCase().includes('admin') && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-600 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        Host
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleJoinMeeting}
                className="flex-1 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Join Meeting Now</span>
              </button>

              <button
                onClick={() => {
                  setModalOpen(false);
                  setScheduleModalOpen(true);
                }}
                className="py-3 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center gap-1.5 transition-all"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Reschedule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Schedule Meeting Form */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-extrabold text-[#111827]">Schedule New Meeting</h3>
              </div>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Meeting Topic / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Sales & Quota Strategy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Meeting Call URL</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/niond-custom-sync"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-xs font-medium focus:outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Confirm Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
