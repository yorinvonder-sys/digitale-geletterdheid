
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '../services/supabase';
import { validatePassword } from '../utils/passwordValidator';

interface ChangePasswordProps {
    onComplete: () => void;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onComplete }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = validatePassword(password);
        if (!result.isValid) {
            setError(result.errors[0]);
            return;
        }

        if (password !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return;
        }

        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) throw new Error('Niet ingelogd.');

            // 1. Update Auth Password
            const { error: authError } = await supabase.auth.updateUser({ password });
            if (authError) throw authError;

            // 2. Update user record to clear flag
            const { error: dbError } = await supabase
                .from('users')
                .update({ must_change_password: false })
                .eq('id', session.user.id);
            if (dbError) throw dbError;

            // 3. Complete
            onComplete();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Wachtwoord wijzigen mislukt.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Lock size={32} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Nieuw Wachtwoord Nodig</h2>
                    <p className="text-center text-slate-500 mb-8 text-sm">
                        Je logt in met een tijdelijk wachtwoord. Stel nu een eigen, veilig wachtwoord in om verder te gaan.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nieuw wachtwoord"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-slate-700"
                                    required
                                    minLength={12}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Bevestig wachtwoord"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-slate-700"
                                    required
                                    minLength={12}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-in shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password || !confirmPassword}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200/50 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Opslaan en Doorgaan</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
