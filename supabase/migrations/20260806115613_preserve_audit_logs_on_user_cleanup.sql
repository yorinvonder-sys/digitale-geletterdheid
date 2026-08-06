CREATE OR REPLACE FUNCTION public.cleanup_user_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_uid TEXT := OLD.id::TEXT;
BEGIN
    DELETE FROM public.student_activities WHERE uid = v_uid;
    DELETE FROM public.ai_beleid_surveys WHERE uid = v_uid;
    DELETE FROM public.ai_beleid_feedback WHERE uid = v_uid;
    DELETE FROM public.hybrid_assessments WHERE uid = v_uid;
    DELETE FROM public.xp_suspicious_logs WHERE user_id = v_uid;
    DELETE FROM public.student_feedback WHERE user_id = v_uid;
    DELETE FROM public.developer_tasks WHERE user_id = v_uid;
    DELETE FROM public.developer_timeline WHERE user_id = v_uid;
    DELETE FROM public.developer_plans WHERE user_id = v_uid;
    DELETE FROM public.teacher_messages WHERE sender_id = v_uid;
    DELETE FROM public.user_blocks WHERE blocker_id = v_uid OR blocked_id = v_uid;
    DELETE FROM public.shared_games WHERE creator_uid = v_uid;
    DELETE FROM public.bomberman_rooms WHERE created_by = v_uid;
    DELETE FROM public.drawing_challenges WHERE challenger_id = v_uid OR challenged_id = v_uid;
    UPDATE public.ai_beleid_feedback
    SET gestemde_uids = array_remove(gestemde_uids, v_uid)
    WHERE v_uid = ANY(gestemde_uids);
    RAISE NOTICE 'AVG Art. 17: All data for user % has been cleaned up', v_uid;
    RETURN OLD;
END;
$function$;

COMMENT ON FUNCTION public.cleanup_user_data() IS
  'Cleans removable user data on deletion; immutable audit logs remain under retention procedures.';
