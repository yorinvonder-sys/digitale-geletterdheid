-- ============================================================================
-- Groep A omzetten: van schoolbrede naar klasgebonden docenttoegang
-- ----------------------------------------------------------------------------
-- Stap 3 uit docs/compliance/ontwerp-docent-klas-koppeling.md.
--
-- 20260826200000 leverde de koppeltabel en de helpers, maar raakte geen enkele
-- bestaande toegangsregel aan. Daardoor gold nog steeds: elke docent van een
-- school ziet elke leerling van die school. Deze migratie zet de regels om die
-- gegevens ontsluiten welke herleidbaar zijn tot één leerling.
--
-- GEDRAG IN DE STANDAARDSTAND IS ONGEWIJZIGD. is_teacher_of_class() begint met
-- is_teacher_in_school() en geeft in modus 'school' onvoorwaardelijk true terug.
-- Zolang een school niet is omgezet, verandert er dus niets aan wat een docent
-- ziet. De klasgrens wordt hier afdwingbaar gemaakt, niet aangezet.
--
-- ÉÉN GEDRAGSVERSCHIL, OOK IN DE STANDAARDSTAND, EN BEWUST
-- is_teacher_of_student() geeft false voor een rij die aan een docent- of
-- beheerdersaccount hangt, en voor een rij waarvan de gebruiker niet meer
-- bestaat. Vandaag ziet een docent de missievoortgang van een collega omdat de
-- schoolbrede toets alleen naar school_id kijkt. Na deze migratie niet meer.
-- Een docent houdt zijn eigen rijen via de eigenaarstak (auth.uid() = user_id),
-- en het docentdashboard bevraagt uitsluitend leerlingen. Dit is een versmalling
-- van personeelsgegevens, geen verlies van functionaliteit.
--
-- WAT HIER NIET IN ZIT
--   * users (4 regels) — niet mechanisch om te zetten; zie het ontwerp.
--   * wellbeing_alerts (2) — wacht op het besluit wie een signaal opvangt als
--     de klasdocent het laat liggen. Zorgplicht weegt zwaarder dan privacywinst.
--   * student_groups (1) en teacher_messages (1) — deze twee dragen wél een
--     leerlingverwijzing, maar niet als typed kolom die aan
--     is_teacher_of_student(uuid) te voeren is: student_groups heeft een array
--     (student_uids uuid[]) en teacher_messages een vrije tekstkolom met een
--     los target_type ('class' | 'student' | ...). Beide vragen een eigen
--     ontwerpkeuze — alle leden of één lid; klas- of leerlinggrens — en horen
--     daarom niet in een mechanische omzetting.
--   * Groep B en C — zie het ontwerp.
--
-- NULLBARE LEERLINGKOLOMMEN
-- teacher_notes.student_uid en highlighted_work.uid mogen NULL zijn. Een rij
-- zonder leerlingverwijzing identificeert geen leerling, dus daar blijft de
-- schoolbrede toets gelden. Zonder die tak zouden bestaande rijen zonder
-- koppeling stil uit het docentbeeld verdwijnen.
-- ============================================================================

-- PRESTATIE: DE TOETS PER LEERLING, NIET PER RIJ
-- mission_progress en student_activities zijn de twee drukste tabellen. Een
-- policy-uitdrukking wordt per RIJ geëvalueerd, dus `is_teacher_of_student(user_id)`
-- zou daar tienduizenden keren draaien terwijl er maar een paar honderd
-- leerlingen zijn. Gemeten op 400 leerlingen × 25 rijen = 10.000 rijen:
--
--   huidige productieregel (schoolbreed)   209 ms
--   toets per rij                          467 ms   (koud gemeten zelfs 1621 ms)
--   toets per leerling (hieronder)          32 ms
--
-- De vorm hieronder evalueert de dure toets één keer per leerling in plaats van
-- één keer per rij, en is daarmee niet alleen goedkoper dan de omzetting maar
-- ook goedkoper dan wat er nu staat. De semantiek is gelijk: een rij is
-- zichtbaar wanneer de leerling erachter zichtbaar is.
--
-- De overige tabellen houden de directe vorm: daar staat hooguit één rij per
-- leerling, dus per rij en per leerling zijn daar hetzelfde.

-- ── mission_progress ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "mission_progress_owner_select" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_select"
  ON public.mission_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IN (
      SELECT u.id FROM public.users u WHERE public.is_teacher_of_student(u.id)
    )
  );

DROP POLICY IF EXISTS "mission_progress_owner_delete" ON public.mission_progress;
CREATE POLICY "mission_progress_owner_delete"
  ON public.mission_progress
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR user_id IN (
      SELECT u.id FROM public.users u WHERE public.is_teacher_of_student(u.id)
    )
  );

-- ── student_activities ──────────────────────────────────────────────────────
DROP POLICY IF EXISTS "student_activities_select_own_or_teacher" ON public.student_activities;
CREATE POLICY "student_activities_select_own_or_teacher"
  ON public.student_activities
  FOR SELECT
  USING (
    auth.uid() = uid
    OR uid IN (
      SELECT u.id FROM public.users u WHERE public.is_teacher_of_student(u.id)
    )
  );

-- ── assessment_results ──────────────────────────────────────────────────────
-- De oude vorm leidde de school af uit de rij of anders uit users. Die omweg
-- vervalt: is_teacher_of_student() leest de school en de klas van de leerling
-- zelf, wat per definitie actueler is dan een meegeschreven school_id.
DROP POLICY IF EXISTS "Docenten lezen assessment resultaten" ON public.assessment_results;
CREATE POLICY "Docenten lezen assessment resultaten"
  ON public.assessment_results
  FOR SELECT
  USING (public.is_teacher_of_student(user_id));

-- ── nulmeting_results ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Docenten lezen nulmeting resultaten" ON public.nulmeting_results;
CREATE POLICY "Docenten lezen nulmeting resultaten"
  ON public.nulmeting_results
  FOR SELECT
  USING (public.is_teacher_of_student(user_id));

-- ── growth_recommendations ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "Docenten lezen aanbevelingen" ON public.growth_recommendations;
CREATE POLICY "Docenten lezen aanbevelingen"
  ON public.growth_recommendations
  FOR SELECT
  USING (public.is_teacher_of_student(user_id));

DROP POLICY IF EXISTS "Docenten keuren aanbevelingen goed" ON public.growth_recommendations;
CREATE POLICY "Docenten keuren aanbevelingen goed"
  ON public.growth_recommendations
  FOR UPDATE
  USING (public.is_teacher_of_student(user_id))
  WITH CHECK (
    public.is_teacher_of_student(user_id)
    AND (teacher_approved_by IS NULL OR teacher_approved_by = auth.uid())
  );

-- ── teacher_step_overrides (docent-override, AI Act Art. 14) ────────────────
DROP POLICY IF EXISTS "teacher_override_select" ON public.teacher_step_overrides;
CREATE POLICY "teacher_override_select"
  ON public.teacher_step_overrides
  FOR SELECT
  USING (
    (SELECT auth.uid()) = student_id
    OR public.is_teacher_of_student(student_id)
  );

DROP POLICY IF EXISTS "teacher_override_insert" ON public.teacher_step_overrides;
CREATE POLICY "teacher_override_insert"
  ON public.teacher_step_overrides
  FOR INSERT
  WITH CHECK (public.is_teacher_of_student(student_id));

-- ── teacher_notes ───────────────────────────────────────────────────────────
-- De auteurstak blijft staan: wie een notitie schreef houdt er zicht op.
-- student_uid IS NULL = geen leerling aangewezen, dus schoolbreed.
DROP POLICY IF EXISTS "Privileged users manage teacher notes" ON public.teacher_notes;
CREATE POLICY "Privileged users manage teacher notes"
  ON public.teacher_notes
  FOR ALL
  USING (
    public.get_caller_app_role() = 'developer'
    OR (student_uid IS NOT NULL AND public.is_teacher_of_student(student_uid))
    OR (student_uid IS NULL AND public.is_teacher_in_school(school_id))
    OR (
      teacher_uid = auth.uid()
      AND school_id IS NOT NULL
      AND school_id = public.get_caller_school_id()
    )
  )
  WITH CHECK (
    public.get_caller_app_role() = 'developer'
    OR (
      teacher_uid = auth.uid()
      AND (
        (student_uid IS NOT NULL AND public.is_teacher_of_student(student_uid))
        OR (student_uid IS NULL AND public.is_teacher_in_school(school_id))
      )
    )
  );

-- ── highlighted_work ────────────────────────────────────────────────────────
-- Let op: lezen blijft schoolbreed via de aparte policy
-- "School users read highlighted work". Uitgelicht werk is bedoeld om binnen de
-- school getoond te worden; die keuze staat hier niet ter discussie. Wat deze
-- regel versmalt is het BEHEER ervan: uitlichten en weghalen.
DROP POLICY IF EXISTS "Privileged users manage highlighted work" ON public.highlighted_work;
CREATE POLICY "Privileged users manage highlighted work"
  ON public.highlighted_work
  FOR ALL
  USING (
    public.get_caller_app_role() = 'developer'
    OR (uid IS NOT NULL AND public.is_teacher_of_student(uid))
    OR (uid IS NULL AND public.is_teacher_in_school(school_id))
  )
  WITH CHECK (
    public.get_caller_app_role() = 'developer'
    OR (uid IS NOT NULL AND public.is_teacher_of_student(uid))
    OR (uid IS NULL AND public.is_teacher_in_school(school_id))
  );

-- ── peer_feedback ───────────────────────────────────────────────────────────
-- De rij noemt twee leerlingen. Een docent die één van beiden lesgeeft mag de
-- rij zien: de gever heeft die feedback geschreven en de ontvanger heeft hem
-- gekregen — beide zijn een legitiem docentbelang. Dit blijft in elke stand
-- smaller dan de huidige schoolbrede toegang.
DROP POLICY IF EXISTS "Teachers can read all feedback in their school" ON public.peer_feedback;
CREATE POLICY "Teachers can read all feedback in their school"
  ON public.peer_feedback
  FOR SELECT
  USING (
    public.is_teacher_of_student(to_student_id)
    OR public.is_teacher_of_student(from_student_id)
  );

COMMENT ON FUNCTION public.is_teacher_of_student(uuid) IS
  'Mag de aanroepende docent deze leerling zien? Sinds 20260903130000 de toets onder groep A van de toegangsregels; zie docs/compliance/ontwerp-docent-klas-koppeling.md.';
