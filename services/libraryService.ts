// Student library — persists games, books, chatbots, drawings.
// Stored in the `library_items` table, scoped by user_id.

import { supabase } from './supabase';

export type LibraryItemType = 'game' | 'book' | 'chatbot' | 'drawing';

export interface LibraryItem {
    id?: string;
    type: LibraryItemType;
    name: string;
    school_id?: string;
    description?: string;
    thumbnail?: string;
    data: any;
    mission_id: string;
    mission_name?: string;
    created_at?: string;
    updated_at?: string;
}

export async function saveToLibrary(
    userId: string,
    item: Omit<LibraryItem, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
    if (!userId) throw new Error('User ID required');

    const { data, error } = await supabase
        .from('library_items')
        .insert({
            user_id: userId,
            type: item.type,
            name: item.name,
            school_id: item.school_id,
            description: item.description,
            thumbnail: item.thumbnail,
            data: item.data,
            mission_id: item.mission_id,
            mission_name: item.mission_name,
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}

export async function getLibraryItems(userId: string): Promise<LibraryItem[]> {
    if (!userId) return [];

    const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as LibraryItem[];
}

export async function getLibraryItem(userId: string, itemId: string): Promise<LibraryItem | null> {
    if (!userId || !itemId) return null;

    const { data, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('id', itemId)
        .eq('user_id', userId)
        .maybeSingle();

    if (error) throw error;
    return data as LibraryItem | null;
}

export async function deleteLibraryItem(userId: string, itemId: string): Promise<boolean> {
    if (!userId || !itemId) return false;

    const { error } = await supabase
        .from('library_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

    if (error) throw error;
    return true;
}

export async function updateLibraryItem(
    userId: string,
    itemId: string,
    updates: Partial<Pick<LibraryItem, 'name' | 'description'>>
): Promise<boolean> {
    if (!userId || !itemId) return false;

    const { error } = await supabase
        .from('library_items')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .eq('user_id', userId);

    if (error) throw error;
    return true;
}

export async function getLibraryCount(userId: string): Promise<number> {
    if (!userId) return 0;

    const { count, error } = await supabase
        .from('library_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
}
