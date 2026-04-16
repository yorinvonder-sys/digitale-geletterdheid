import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface DeveloperNote {
    id: string;
    userId: string;
    label: 'gedachte' | 'werklog' | 'handoff';
    body: string;
    createdAt: string;
    updatedAt: string;
}

export type DeveloperNoteLabel = 'gedachte' | 'werklog' | 'handoff';

// --- Private helper ---

function mapRow(row: Record<string, unknown>): DeveloperNote {
    return {
        id:        row.id as string,
        userId:    row.user_id as string,
        label:     row.label as DeveloperNoteLabel,
        body:      row.body as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
    };
}

// --- CRUD ---

export const fetchNotes = async (limit = 200): Promise<DeveloperNote[]> => {
    const { data, error } = await db
        .from('developer_notes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return ((data as Record<string, unknown>[]) || []).map(mapRow);
};

export const createNote = async (input: { label: DeveloperNoteLabel; body: string }): Promise<DeveloperNote> => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('Niet ingelogd — kan notitie niet aanmaken.');

    const { data, error } = await db
        .from('developer_notes')
        .insert({
            user_id: userData.user.id,
            label:   input.label,
            body:    input.body,
        })
        .select('*')
        .single();

    if (error) throw error;
    return mapRow(data as Record<string, unknown>);
};

export const updateNote = async (id: string, changes: { label?: DeveloperNoteLabel; body?: string }): Promise<void> => {
    const { error } = await db
        .from('developer_notes')
        .update(changes)
        .eq('id', id);

    if (error) throw error;
};

export const deleteNote = async (id: string): Promise<void> => {
    const { error } = await db
        .from('developer_notes')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// --- Realtime ---

export const subscribeToNotes = (
    onUpdate: (notes: DeveloperNote[]) => void
): (() => void) => {
    let channel: RealtimeChannel;

    (async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            console.error('[DeveloperNotes] Niet ingelogd — realtime niet gestart.');
            return;
        }
        const userId = userData.user.id;

        // Initial fetch
        fetchNotes().then(onUpdate).catch(console.error);

        channel = supabase
            .channel(`developer-notes-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'developer_notes',
                    filter: `user_id=eq.${userId}`,
                },
                () => {
                    fetchNotes().then(onUpdate).catch(console.error);
                }
            )
            .subscribe();
    })();

    return () => {
        if (channel) supabase.removeChannel(channel);
    };
};
