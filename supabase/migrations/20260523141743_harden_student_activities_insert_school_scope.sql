-- Harden student activity logging so students cannot spoof another school's
-- activity feed. Teacher visibility depends on student_activities.school_id,
-- so INSERT must bind that value to the caller's app_metadata schoolId.

DROP POLICY IF EXISTS student_activities_insert ON public.student_activities;

CREATE POLICY student_activities_insert
ON public.student_activities
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND uid = auth.uid()::text
  AND (
    school_id IS NULL
    OR school_id = public.get_caller_school_id()
  )
);
