-- ===========================================================================
-- AVG Art. 17 FIX: ON DELETE CASCADE for Account Deletion Compliance
-- ===========================================================================
-- When a user account is deleted (via delete_student RPC or auth.users
-- removal), ALL linked data must be automatically purged to comply with
-- AVG Art. 17 (Right to Erasure) and Art. 5(1)(e) (Storage Limitation).
--
-- This migration adds ON DELETE CASCADE to every foreign key that
-- references public.users(id). Tables already handled:
--   - xp_transactions (20260222_server_side_xp.sql) — already has CASCADE
--
-- Strategy: DROP existing FK (if any) then re-ADD with CASCADE.
-- Uses DO blocks for idempotency — safe to re-run.
-- ===========================================================================

-- Helper: drop-and-recreate FK with CASCADE
-- We use a DO block per table for clear error isolation.

-- ── 1. audit_logs ──────────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.audit_logs
        DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
    ALTER TABLE IF EXISTS public.audit_logs
        ADD CONSTRAINT audit_logs_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 2. student_activities ──────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.student_activities
        DROP CONSTRAINT IF EXISTS student_activities_user_id_fkey;
    ALTER TABLE IF EXISTS public.student_activities
        ADD CONSTRAINT student_activities_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 3. teacher_notes (teacher_id + student_id) ────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.teacher_notes
        DROP CONSTRAINT IF EXISTS teacher_notes_teacher_id_fkey;
    ALTER TABLE IF EXISTS public.teacher_notes
        ADD CONSTRAINT teacher_notes_teacher_id_fkey
        FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE IF EXISTS public.teacher_notes
        DROP CONSTRAINT IF EXISTS teacher_notes_student_id_fkey;
    ALTER TABLE IF EXISTS public.teacher_notes
        ADD CONSTRAINT teacher_notes_student_id_fkey
        FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 4. teacher_messages ────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.teacher_messages
        DROP CONSTRAINT IF EXISTS teacher_messages_sender_id_fkey;
    ALTER TABLE IF EXISTS public.teacher_messages
        ADD CONSTRAINT teacher_messages_sender_id_fkey
        FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE IF EXISTS public.teacher_messages
        DROP CONSTRAINT IF EXISTS teacher_messages_receiver_id_fkey;
    ALTER TABLE IF EXISTS public.teacher_messages
        ADD CONSTRAINT teacher_messages_receiver_id_fkey
        FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 5. xp_abuse_logs ──────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.xp_abuse_logs
        DROP CONSTRAINT IF EXISTS xp_abuse_logs_user_id_fkey;
    ALTER TABLE IF EXISTS public.xp_abuse_logs
        ADD CONSTRAINT xp_abuse_logs_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 6. ai_beleid_surveys ──────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.ai_beleid_surveys
        DROP CONSTRAINT IF EXISTS ai_beleid_surveys_user_id_fkey;
    ALTER TABLE IF EXISTS public.ai_beleid_surveys
        ADD CONSTRAINT ai_beleid_surveys_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 7. ai_beleid_feedback ─────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.ai_beleid_feedback
        DROP CONSTRAINT IF EXISTS ai_beleid_feedback_user_id_fkey;
    ALTER TABLE IF EXISTS public.ai_beleid_feedback
        ADD CONSTRAINT ai_beleid_feedback_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 8. user_blocks (blocker_id + blocked_id) ──────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.user_blocks
        DROP CONSTRAINT IF EXISTS user_blocks_blocker_id_fkey;
    ALTER TABLE IF EXISTS public.user_blocks
        ADD CONSTRAINT user_blocks_blocker_id_fkey
        FOREIGN KEY (blocker_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE IF EXISTS public.user_blocks
        DROP CONSTRAINT IF EXISTS user_blocks_blocked_id_fkey;
    ALTER TABLE IF EXISTS public.user_blocks
        ADD CONSTRAINT user_blocks_blocked_id_fkey
        FOREIGN KEY (blocked_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 9. hybrid_assessments ─────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.hybrid_assessments
        DROP CONSTRAINT IF EXISTS hybrid_assessments_student_id_fkey;
    ALTER TABLE IF EXISTS public.hybrid_assessments
        ADD CONSTRAINT hybrid_assessments_student_id_fkey
        FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE IF EXISTS public.hybrid_assessments
        DROP CONSTRAINT IF EXISTS hybrid_assessments_teacher_id_fkey;
    ALTER TABLE IF EXISTS public.hybrid_assessments
        ADD CONSTRAINT hybrid_assessments_teacher_id_fkey
        FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 10. highlighted_work ──────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.highlighted_work
        DROP CONSTRAINT IF EXISTS highlighted_work_student_id_fkey;
    ALTER TABLE IF EXISTS public.highlighted_work
        ADD CONSTRAINT highlighted_work_student_id_fkey
        FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 11. mission_progress ──────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.mission_progress
        DROP CONSTRAINT IF EXISTS mission_progress_user_id_fkey;
    ALTER TABLE IF EXISTS public.mission_progress
        ADD CONSTRAINT mission_progress_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 12. shared_projects ───────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.shared_projects
        DROP CONSTRAINT IF EXISTS shared_projects_user_id_fkey;
    ALTER TABLE IF EXISTS public.shared_projects
        ADD CONSTRAINT shared_projects_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 13. feedback ──────────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.feedback
        DROP CONSTRAINT IF EXISTS feedback_user_id_fkey;
    ALTER TABLE IF EXISTS public.feedback
        ADD CONSTRAINT feedback_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 14. shared_games ──────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.shared_games
        DROP CONSTRAINT IF EXISTS shared_games_user_id_fkey;
    ALTER TABLE IF EXISTS public.shared_games
        ADD CONSTRAINT shared_games_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 15. duel_presence ─────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.duel_presence
        DROP CONSTRAINT IF EXISTS duel_presence_user_id_fkey;
    ALTER TABLE IF EXISTS public.duel_presence
        ADD CONSTRAINT duel_presence_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 16. duel_challenges (challenger_id + challenged_id) ───────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.duel_challenges
        DROP CONSTRAINT IF EXISTS duel_challenges_challenger_id_fkey;
    ALTER TABLE IF EXISTS public.duel_challenges
        ADD CONSTRAINT duel_challenges_challenger_id_fkey
        FOREIGN KEY (challenger_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE IF EXISTS public.duel_challenges
        DROP CONSTRAINT IF EXISTS duel_challenges_challenged_id_fkey;
    ALTER TABLE IF EXISTS public.duel_challenges
        ADD CONSTRAINT duel_challenges_challenged_id_fkey
        FOREIGN KEY (challenged_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 17. active_duels ──────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.active_duels
        DROP CONSTRAINT IF EXISTS active_duels_player1_id_fkey;
    ALTER TABLE IF EXISTS public.active_duels
        ADD CONSTRAINT active_duels_player1_id_fkey
        FOREIGN KEY (player1_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE IF EXISTS public.active_duels
        DROP CONSTRAINT IF EXISTS active_duels_player2_id_fkey;
    ALTER TABLE IF EXISTS public.active_duels
        ADD CONSTRAINT active_duels_player2_id_fkey
        FOREIGN KEY (player2_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 18. gamification_events ───────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.gamification_events
        DROP CONSTRAINT IF EXISTS gamification_events_user_id_fkey;
    ALTER TABLE IF EXISTS public.gamification_events
        ADD CONSTRAINT gamification_events_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 19. library_items ─────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.library_items
        DROP CONSTRAINT IF EXISTS library_items_user_id_fkey;
    ALTER TABLE IF EXISTS public.library_items
        ADD CONSTRAINT library_items_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 20. game_permissions ──────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.game_permissions
        DROP CONSTRAINT IF EXISTS game_permissions_user_id_fkey;
    ALTER TABLE IF EXISTS public.game_permissions
        ADD CONSTRAINT game_permissions_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 21. class_settings ────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.class_settings
        DROP CONSTRAINT IF EXISTS class_settings_teacher_id_fkey;
    ALTER TABLE IF EXISTS public.class_settings
        ADD CONSTRAINT class_settings_teacher_id_fkey
        FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 22. classroom_configs ─────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.classroom_configs
        DROP CONSTRAINT IF EXISTS classroom_configs_teacher_id_fkey;
    ALTER TABLE IF EXISTS public.classroom_configs
        ADD CONSTRAINT classroom_configs_teacher_id_fkey
        FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 23. student_groups ────────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.student_groups
        DROP CONSTRAINT IF EXISTS student_groups_teacher_id_fkey;
    ALTER TABLE IF EXISTS public.student_groups
        ADD CONSTRAINT student_groups_teacher_id_fkey
        FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 24. developer_tasks ───────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.developer_tasks
        DROP CONSTRAINT IF EXISTS developer_tasks_user_id_fkey;
    ALTER TABLE IF EXISTS public.developer_tasks
        ADD CONSTRAINT developer_tasks_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 25. developer_milestones ──────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.developer_milestones
        DROP CONSTRAINT IF EXISTS developer_milestones_user_id_fkey;
    ALTER TABLE IF EXISTS public.developer_milestones
        ADD CONSTRAINT developer_milestones_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 26. developer_plans ───────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.developer_plans
        DROP CONSTRAINT IF EXISTS developer_plans_user_id_fkey;
    ALTER TABLE IF EXISTS public.developer_plans
        ADD CONSTRAINT developer_plans_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 27. developer_settings ────────────────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.developer_settings
        DROP CONSTRAINT IF EXISTS developer_settings_user_id_fkey;
    ALTER TABLE IF EXISTS public.developer_settings
        ADD CONSTRAINT developer_settings_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ── 28. bomberman_lobbies (host_id) ───────────────────────────────────────
DO $$ BEGIN
    ALTER TABLE IF EXISTS public.bomberman_lobbies
        DROP CONSTRAINT IF EXISTS bomberman_lobbies_host_id_fkey;
    ALTER TABLE IF EXISTS public.bomberman_lobbies
        ADD CONSTRAINT bomberman_lobbies_host_id_fkey
        FOREIGN KEY (host_id) REFERENCES public.users(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ===========================================================================
-- VERIFICATION QUERY (run manually to confirm all FKs have CASCADE)
-- ===========================================================================
-- SELECT
--     tc.table_name,
--     kcu.column_name,
--     rc.delete_rule
-- FROM information_schema.table_constraints tc
-- JOIN information_schema.key_column_usage kcu
--     ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.referential_constraints rc
--     ON tc.constraint_name = rc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY'
--   AND tc.table_schema = 'public'
-- ORDER BY tc.table_name;
-- ===========================================================================
