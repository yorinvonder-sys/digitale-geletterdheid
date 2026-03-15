-- Teacher override voor AI-beoordelingen (EU AI Act Art. 14 — menselijk toezicht)

-- Tabel voor teacher overrides
CREATE TABLE IF NOT EXISTS public.teacher_step_overrides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id uuid NOT NULL REFERENCES auth.users(id),
    student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mission_id text NOT NULL,
    step_number integer NOT NULL,
    override_type text NOT NULL CHECK (override_type IN ('approve', 'reject')),
    reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(student_id, mission_id, step_number)
);

ALTER TABLE public.teacher_step_overrides ENABLE ROW LEVEL SECURITY;

-- Docent in dezelfde school kan overrides bekijken; leerling ziet eigen overrides
CREATE POLICY teacher_override_select ON public.teacher_step_overrides
    FOR SELECT TO authenticated
    USING (
        (SELECT auth.uid()) = student_id
        OR public.is_teacher_in_school(
            (SELECT school_id FROM public.users WHERE id = student_id)
        )
    );

-- Alleen docenten in dezelfde school kunnen overrides aanmaken
CREATE POLICY teacher_override_insert ON public.teacher_step_overrides
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_teacher_in_school(
            (SELECT school_id FROM public.users WHERE id = student_id)
        )
    );

-- RPC functie voor teacher override
CREATE OR REPLACE FUNCTION public.override_student_step(
    p_student_id uuid,
    p_mission_id text,
    p_step_number integer,
    p_override_type text,
    p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_id uuid;
    v_student_school_id text;
BEGIN
    v_caller_id := auth.uid();

    -- Moet een docent zijn (is_teacher() vereist al MFA/AAL2)
    IF NOT public.is_teacher() THEN
        RAISE EXCEPTION 'Alleen docenten kunnen beoordelingen overrulen';
    END IF;

    -- School-scope check
    SELECT school_id INTO v_student_school_id FROM public.users WHERE id = p_student_id;
    IF NOT public.is_teacher_in_school(v_student_school_id) THEN
        RAISE EXCEPTION 'Leerling zit niet in uw school';
    END IF;

    -- Validatie
    IF p_override_type NOT IN ('approve', 'reject') THEN
        RAISE EXCEPTION 'Ongeldig override type';
    END IF;

    -- Upsert override
    INSERT INTO public.teacher_step_overrides (teacher_id, student_id, mission_id, step_number, override_type, reason)
    VALUES (v_caller_id, p_student_id, p_mission_id, p_step_number, p_override_type, p_reason)
    ON CONFLICT (student_id, mission_id, step_number)
    DO UPDATE SET
        teacher_id = v_caller_id,
        override_type = p_override_type,
        reason = p_reason,
        created_at = now();

    RETURN jsonb_build_object('success', true, 'override_type', p_override_type);
END;
$$;

GRANT EXECUTE ON FUNCTION public.override_student_step TO authenticated;
