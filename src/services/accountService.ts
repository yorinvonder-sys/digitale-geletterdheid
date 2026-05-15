// GDPR account actions (Art. 15, 17, 18, 20)
import { supabase, callEdgeFunction } from './supabase';

export const deleteUserAccount = async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Niet ingelogd');

    try {
        await callEdgeFunction('deleteMyAccount');
    } catch (error: any) {
        console.error('Error deleting account:', error);
        throw new Error(error?.message || 'Account verwijderen mislukt');
    }
};

export const exportUserData = async (): Promise<any> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Niet ingelogd');

    try {
        return await callEdgeFunction('exportMyData');
    } catch (error: any) {
        console.error('Error exporting data:', error);
        throw new Error(error?.message || 'Data export mislukt');
    }
};

export const requestProcessingRestriction = async (): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Niet ingelogd');

    try {
        await callEdgeFunction('restrictProcessing');
    } catch (error: any) {
        console.error('Error restricting processing:', error);
        throw new Error(error?.message || 'Verwerking beperken mislukt');
    }
};
