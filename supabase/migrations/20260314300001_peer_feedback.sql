-- Peer feedback table for collaborative learning
-- Allows students to give structured feedback on classmates' mission work

CREATE TABLE peer_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id TEXT NOT NULL,
    from_student_id UUID NOT NULL REFERENCES auth.users(id),
    to_student_id UUID NOT NULL REFERENCES auth.users(id),
    school_id TEXT NOT NULL,
    class_id TEXT NOT NULL,
    feedback_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    criteria JSONB DEFAULT '{}',
    helpful_vote BOOLEAN DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_peer_feedback_to_student ON peer_feedback(to_student_id, mission_id);
CREATE INDEX idx_peer_feedback_from_student ON peer_feedback(from_student_id);
CREATE INDEX idx_peer_feedback_class ON peer_feedback(class_id, mission_id);

-- RLS: leerlingen zien alleen feedback in hun eigen klas
ALTER TABLE peer_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read feedback they received"
    ON peer_feedback FOR SELECT
    USING (to_student_id = auth.uid());

CREATE POLICY "Students can read feedback they gave"
    ON peer_feedback FOR SELECT
    USING (from_student_id = auth.uid());

CREATE POLICY "Students can create feedback for classmates"
    ON peer_feedback FOR INSERT
    WITH CHECK (from_student_id = auth.uid() AND from_student_id != to_student_id);

CREATE POLICY "Students can update helpful_vote on received feedback"
    ON peer_feedback FOR UPDATE
    USING (to_student_id = auth.uid())
    WITH CHECK (to_student_id = auth.uid());

CREATE POLICY "Teachers can read all feedback in their school"
    ON peer_feedback FOR SELECT
    USING (public.is_teacher_in_school(school_id));
