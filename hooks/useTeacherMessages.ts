import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { TeacherMessage, markMessageRead } from '../services/teacherService';

interface UseTeacherMessagesOptions {
    userId: string;
    classId?: string;
    enabled?: boolean;
}

export const useTeacherMessages = ({ userId, classId, enabled = true }: UseTeacherMessagesOptions) => {
    const [unreadMessages, setUnreadMessages] = useState<TeacherMessage[]>([]);
    const [latestMessage, setLatestMessage] = useState<TeacherMessage | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!enabled || !userId) return;

        // Initial fetch of unread messages
        const fetchMessages = async () => {
            const orFilter = [`target_type.eq.all`, `and(target_type.eq.student,target_id.eq.${userId})`];

            // P2-5 FIX: Sanitize classId before interpolation to prevent PostgREST filter injection.
            // Only allow UUIDs / alphanumeric class identifiers — reject metacharacters.
            if (classId && /^[a-zA-Z0-9_-]+$/.test(classId)) {
                orFilter.push(`and(target_type.eq.class,target_id.eq.${classId})`);
            }

            const { data, error } = await supabase
                .from('teacher_messages')
                .select('*')
                .eq('read', false)
                .or(orFilter.join(','))
                .order('timestamp', { ascending: false })
                .limit(15);

            if (!error && data) {
                const msgs = data as TeacherMessage[];
                checkForNewMessages(msgs);
            }
        };

        fetchMessages();

        // Subscribe to real-time changes
        const channel = supabase
            .channel(`teacher-messages-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'teacher_messages',
                },
                (payload) => {
                    const msg = payload.new as TeacherMessage;
                    // Filter client-side for this user's messages
                    if (
                        msg.target_type === 'all' ||
                        (msg.target_type === 'student' && msg.target_id === userId) ||
                        (msg.target_type === 'class' && msg.target_id === classId)
                    ) {
                        if (!msg.read) {
                            checkForNewMessages([msg]);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, classId, enabled]);

    const checkForNewMessages = (newMessages: TeacherMessage[]) => {
        if (newMessages.length > 0) {
            // Find the newest message
            const newest = newMessages.sort((a, b) =>
                new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
            )[0];

            // If this is a new message we haven't shown yet, trigger popup
            if (!latestMessage || newest.id !== latestMessage.id) {
                setLatestMessage(newest);
                setShowPopup(true);
                setUnreadMessages(prev => {
                    // Merge without duplicates
                    const ids = new Set(prev.map(m => m.id));
                    const unique = [...prev];
                    newMessages.forEach(m => {
                        if (!ids.has(m.id)) {
                            unique.push(m);
                            ids.add(m.id);
                        }
                    });
                    return unique.sort((a, b) =>
                        new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
                    );
                });
            }
        }
    };

    const dismissMessage = async (messageId: string) => {
        await markMessageRead(messageId);
        setUnreadMessages(prev => prev.filter(m => m.id !== messageId));
        if (latestMessage?.id === messageId) {
            setShowPopup(false);
            setLatestMessage(null);
        }
    };

    const dismissPopup = () => {
        setShowPopup(false);
    };

    return {
        unreadMessages,
        latestMessage,
        showPopup,
        dismissMessage,
        dismissPopup,
        unreadCount: unreadMessages.length
    };
};
