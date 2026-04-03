import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

export interface Notification {
    id: string;
    type: 'teacher_message' | 'xp_earned' | 'mission_completed' | 'streak';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    icon: 'message' | 'zap' | 'target' | 'flame';
}

export function useNotifications(userId: string | undefined) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        // Fetch recent XP transactions (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const [xpResult, messagesResult] = await Promise.all([
            supabase
                .from('xp_transactions')
                .select('id, amount, source, created_at')
                .eq('user_id', userId)
                .gte('created_at', weekAgo.toISOString())
                .order('created_at', { ascending: false })
                .limit(20),
            // teacher_messages uses target_type/target_id pattern, not student_id.
            // Fetch messages addressed to this student or broadcast to all.
            supabase
                .from('teacher_messages')
                .select('id, text, timestamp, read, sender_name, target_type')
                .or(`and(target_type.eq.student,target_id.eq.${userId}),target_type.eq.all`)
                .order('timestamp', { ascending: false })
                .limit(10),
        ]);

        const items: Notification[] = [];

        // XP transactions → notification items
        for (const tx of (xpResult.data || [])) {
            items.push({
                id: `xp-${tx.id}`,
                type: 'xp_earned',
                title: `+${tx.amount} XP`,
                message: tx.source || 'XP verdiend',
                timestamp: tx.created_at,
                read: true, // XP notifications are always "seen"
                icon: 'zap',
            });
        }

        // Teacher messages → notification items
        for (const msg of (messagesResult.data || [])) {
            const senderLabel = msg.sender_name ? `Bericht van ${msg.sender_name}` : 'Bericht van docent';
            items.push({
                id: `msg-${msg.id}`,
                type: 'teacher_message',
                title: senderLabel,
                message: msg.text || '',
                timestamp: msg.timestamp || new Date().toISOString(),
                read: msg.read ?? false,
                icon: 'message',
            });
        }

        // Sort by timestamp descending
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setNotifications(items);
        setUnreadCount(items.filter(n => !n.read).length);
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return { notifications, loading, unreadCount, refresh: fetchNotifications };
}
