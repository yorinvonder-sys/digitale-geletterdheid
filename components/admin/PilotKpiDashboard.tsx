/**
 * PilotKpiDashboard — Admin-only KPI dashboard voor de pilot
 *
 * Toont:
 * - 4 stat-blokken (pilot-aanvragen, actieve scholen, gem. NPS, open items)
 * - Recente feedback (laatste 10)
 * - Recente pilot-aanvragen (laatste 10)
 * - Wekelijkse activiteitsgrafiek (afgelopen 7 dagen, Tailwind-based bar chart)
 *
 * Admin-check: gebruiker moet role === 'developer' hebben.
 * Queries zijn client-side via Supabase; RLS laat developers alles zien.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  School,
  Star,
  MessageSquare,
  RefreshCw,
  Loader2,
  AlertCircle,
  BarChart2,
  Clock,
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import type { ParentUser } from '../../types';

// pilot_feedback is a new table not yet in the generated database.types.ts.
// After running the migration and regenerating types, this cast can be removed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface PilotKpiDashboardProps {
  user: ParentUser;
}

interface KpiStats {
  totalPilotRequests: number;
  activeSchools: number;
  averageNps: number | null;
  openFeedbackItems: number;
}

interface FeedbackRow {
  id: string;
  created_at: string;
  role: string | null;
  nps_score: number | null;
  category: string;
  feedback_text: string | null;
  status: string;
}

interface PilotRequestRow {
  id: string;
  created_at: string;
  school_naam: string;
  contact_persoon: string;
  rol: string | null;
  status: string;
}

interface DayCount {
  date: string; // 'YYYY-MM-DD'
  count: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

function last7Days(): DayCount[] {
  const days: DayCount[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().slice(0, 10),
      count: 0,
    });
  }
  return days;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nieuw',
  reviewed: 'Bekeken',
  addressed: 'Opgepakt',
  archived: 'Gearchiveerd',
};

const CATEGORY_LABELS: Record<string, string> = {
  ui: 'Interface',
  content: 'Inhoud',
  compliance: 'Compliance',
  performance: 'Prestaties',
  onboarding: 'Onboarding',
  other: 'Overig',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const PilotKpiDashboard: React.FC<PilotKpiDashboardProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<KpiStats>({
    totalPilotRequests: 0,
    activeSchools: 0,
    averageNps: null,
    openFeedbackItems: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState<FeedbackRow[]>([]);
  const [recentRequests, setRecentRequests] = useState<PilotRequestRow[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DayCount[]>(last7Days());

  // ------------------------------------------------------------------
  // Admin guard — developer role only
  // ------------------------------------------------------------------
  if (user.role !== 'developer') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium text-amber-800">Alleen voor developers</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Dit dashboard is uitsluitend beschikbaar voor platform-developers.
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Data fetching
  // ------------------------------------------------------------------
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [
        pilotCountResult,
        activeSchoolsResult,
        npsResult,
        openItemsResult,
        recentFeedbackResult,
        recentRequestsResult,
        weeklyFeedbackResult,
      ] = await Promise.all([
        // Total pilot requests
        supabase
          .from('pilot_requests')
          .select('id', { count: 'exact', head: true }),

        // Active schools: unique school_id in users where role = 'teacher'
        supabase
          .from('users')
          .select('school_id')
          .eq('role', 'teacher')
          .not('school_id', 'is', null),

        // Average NPS from feedback
        db
          .from('pilot_feedback')
          .select('nps_score')
          .not('nps_score', 'is', null),

        // Open feedback items (status = 'new')
        db
          .from('pilot_feedback')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),

        // Recent feedback (last 10)
        db
          .from('pilot_feedback')
          .select('id, created_at, role, nps_score, category, feedback_text, status')
          .order('created_at', { ascending: false })
          .limit(10),

        // Recent pilot requests (last 10)
        supabase
          .from('pilot_requests')
          .select('id, created_at, school_naam, contact_persoon, rol, status')
          .order('created_at', { ascending: false })
          .limit(10),

        // Weekly feedback for bar chart
        db
          .from('pilot_feedback')
          .select('created_at')
          .gte('created_at', sevenDaysAgo.toISOString()),
      ]);

      // Aggregate stats
      const totalPilotRequests = pilotCountResult.count ?? 0;

      // Unique school IDs
      const schoolIds = new Set(
        (activeSchoolsResult.data ?? []).map((r: { school_id: string | null }) => r.school_id),
      );
      const activeSchools = schoolIds.size;

      // Average NPS — npsResult.data is `any` because we used `db`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const npsRows = (npsResult.data as any[] | null) ?? [];
      const npsScores = npsRows
        .map((r: { nps_score: number | null }) => r.nps_score)
        .filter((s: number | null): s is number => s !== null);
      const averageNps =
        npsScores.length > 0
          ? Math.round((npsScores.reduce((a: number, b: number) => a + b, 0) / npsScores.length) * 10) / 10
          : null;

      const openFeedbackItems = openItemsResult.count ?? 0;

      // Weekly bar chart
      const days = last7Days();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((weeklyFeedbackResult.data as any[] | null) ?? []).forEach((row: { created_at: string }) => {
        const day = row.created_at.slice(0, 10);
        const slot = days.find((d) => d.date === day);
        if (slot) slot.count++;
      });

      setStats({ totalPilotRequests, activeSchools, averageNps, openFeedbackItems });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setRecentFeedback(((recentFeedbackResult.data as any) as FeedbackRow[]) ?? []);
      setRecentRequests((recentRequestsResult.data as PilotRequestRow[]) ?? []);
      setWeeklyActivity(days);
    } catch (err) {
      console.error('[PilotKpiDashboard] Load error:', err);
      setError('Kon data niet laden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ------------------------------------------------------------------
  // Bar chart helpers
  // ------------------------------------------------------------------
  const maxBarCount = Math.max(...weeklyActivity.map((d) => d.count), 1);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pilot KPI Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overzicht van de pilot-operatie</p>
        </div>
        <button
          type="button"
          onClick={loadData}
          aria-label="Vernieuwen"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Vernieuwen
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex gap-3 items-start rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stat blokken */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<School className="w-5 h-5 text-indigo-500" />}
          label="Pilot-aanvragen"
          value={String(stats.totalPilotRequests)}
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-emerald-500" />}
          label="Actieve scholen"
          value={String(stats.activeSchools)}
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          label="Gem. NPS"
          value={stats.averageNps !== null ? String(stats.averageNps) : '—'}
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5 text-orange-500" />}
          label="Open feedback"
          value={String(stats.openFeedbackItems)}
        />
      </div>

      {/* Wekelijkse activiteitsgrafiek */}
      <section aria-label="Wekelijkse feedbackactiviteit">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-700">
            Feedback afgelopen 7 dagen
          </h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-end gap-2 h-24">
            {weeklyActivity.map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full relative flex items-end justify-center h-16">
                  <div
                    className="w-full rounded-t-sm bg-indigo-400 transition-all"
                    style={{
                      height: day.count > 0
                        ? `${Math.round((day.count / maxBarCount) * 100)}%`
                        : '2px',
                      minHeight: day.count > 0 ? '4px' : '2px',
                      backgroundColor: day.count > 0 ? undefined : '#e5e7eb',
                    }}
                    aria-label={`${day.date}: ${day.count} items`}
                  />
                </div>
                <span className="text-xs text-gray-400 truncate w-full text-center">
                  {formatDateShort(day.date + 'T00:00:00')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recente feedback */}
      <section aria-label="Recente feedback">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-700">Recente feedback</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {recentFeedback.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-4">Nog geen feedback ontvangen.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentFeedback.map((fb) => (
                <li key={fb.id} className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-2">
                  <div className="flex items-center gap-2 shrink-0 sm:w-40">
                    {fb.nps_score !== null && (
                      <span
                        className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                          fb.nps_score >= 9
                            ? 'bg-green-100 text-green-700'
                            : fb.nps_score >= 7
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        NPS {fb.nps_score}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {CATEGORY_LABELS[fb.category] ?? fb.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 flex-1 line-clamp-2">
                    {fb.feedback_text ?? <em className="text-gray-400">Geen toelichting</em>}
                  </p>
                  <div className="flex items-center gap-2 shrink-0 sm:flex-col sm:items-end">
                    <span className="text-xs text-gray-400">
                      {formatDate(fb.created_at)}
                    </span>
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 ${
                        fb.status === 'new'
                          ? 'bg-orange-100 text-orange-700'
                          : fb.status === 'addressed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {STATUS_LABELS[fb.status] ?? fb.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Recente pilot-aanvragen */}
      <section aria-label="Recente pilot-aanvragen">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-700">Recente pilot-aanvragen</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {recentRequests.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-4">Nog geen pilot-aanvragen.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentRequests.map((req) => (
                <li key={req.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {req.school_naam}
                    </p>
                    <p className="text-xs text-gray-400">
                      {req.contact_persoon}
                      {req.rol ? ` · ${req.rol}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{formatDate(req.created_at)}</p>
                    <p className="text-xs text-indigo-600 mt-0.5">{req.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// StatCard — kleine subcomponent
// ---------------------------------------------------------------------------
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps): React.ReactElement {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
