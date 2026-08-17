import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface NiondTeamMembersListProps {
  members?: Member[];
}

export const NiondTeamMembersList: React.FC<NiondTeamMembersListProps> = ({ members: propsMembers }) => {
  const [members, setMembers] = useState<Member[]>(propsMembers || []);
  const [loading, setLoading] = useState<boolean>(!propsMembers || propsMembers.length === 0);

  const fetchLiveMembers = useCallback(async () => {
    try {
      setLoading(true);
      const { data: users, error } = await supabase
        .from('users')
        .select('user_id, name, user_role')
        .limit(6);

      if (error) throw error;

      if (users && users.length > 0) {
        const defaultAvatars = [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
        ];

        const mapped: Member[] = users.map((u, idx) => {
          const cleanName = u.name && typeof u.name === 'string' && u.name.trim() ? u.name.trim() : `User #${u.user_id}`;
          const isTanmay = cleanName.toLowerCase().includes('tanmay');
          const roleTitle = isTanmay || u.user_role === 1 ? 'Admin' : u.user_role === 2 ? 'Project Manager' : 'Sales Co-ordinator';

          return {
            id: String(u.user_id),
            name: cleanName,
            role: roleTitle,
            avatar: defaultAvatars[idx % defaultAvatars.length],
          };
        });

        // Ensure Tanmay (Admin) is always included at top
        const hasTanmay = mapped.some(m => m.name.toLowerCase().includes('tanmay'));
        if (!hasTanmay) {
          mapped.unshift({
            id: 'tanmay-admin',
            name: 'Tanmay',
            role: 'Admin',
            avatar: defaultAvatars[0],
          });
        }

        setMembers(mapped.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching live team members from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMembers();

    // Realtime subscription on users table
    const channel = supabase
      .channel('realtime-users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchLiveMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLiveMembers]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full space-y-4 select-none">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#111827]">Team Members</h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live Supabase</span>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
            <span className="text-xs font-bold text-gray-400">Loading team members...</span>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-gray-50/80 border border-gray-100/80 rounded-2xl p-2.5 flex items-center justify-between hover:bg-gray-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                    />
                    {m.role.toLowerCase().includes('admin') && (
                      <ShieldCheck className="w-3 h-3 text-blue-600 absolute -bottom-0.5 -right-0.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs text-[#111827]">{m.name}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{m.role}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="w-full py-2.5 rounded-2xl bg-[#D6E6FF] hover:bg-[#c2dbff] text-[#2563EB] font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all">
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Add more member</span>
      </button>
    </div>
  );
};
