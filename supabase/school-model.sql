-- ─────────────────────────────────────────
-- Transform Learning — School model migration
-- Additive and safe to re-run. Existing courses, enrollments and profiles keep working.
-- Run in Supabase SQL Editor AFTER schema.sql.
--
-- Model:
--   * Schools own courses. Deans are school 'admin' members. Students are 'student' members.
--   * Faculty have no accounts. The team builds courses from syllabi and posts a join link.
--   * Students enroll by opening a course join link and signing in with a school email domain.
--   * Client (anon/authenticated) writes to the new tables are denied. The server uses the
--     service role, which bypasses RLS, after checking platform_admins or school membership.
-- ─────────────────────────────────────────

-- 1. Platform admins (Transform Learning team)
CREATE TABLE IF NOT EXISTS public.platform_admins (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- 2. Schools
CREATE TABLE IF NOT EXISTS public.schools (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  size_band       text,                                   -- [pricing TBD] placeholder
  status          text NOT NULL DEFAULT 'pilot'
                  CHECK (status IN ('pilot','active','paused')),
  invoice_status  text NOT NULL DEFAULT 'not_invoiced'
                  CHECK (invoice_status IN ('not_invoiced','invoiced','paid')),
  summary_cadence text NOT NULL DEFAULT 'monthly'
                  CHECK (summary_cadence IN ('weekly','monthly','off')),
  created_at      timestamptz DEFAULT now()
);

-- 3. Email domains a school's students may join with (lowercase, e.g. 'school.edu')
CREATE TABLE IF NOT EXISTS public.school_domains (
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  domain    text NOT NULL CHECK (domain = lower(domain)),
  PRIMARY KEY (school_id, domain)
);

-- 4. School membership: dean/admin or student. No faculty role.
CREATE TABLE IF NOT EXISTS public.school_members (
  school_id  uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text NOT NULL CHECK (role IN ('admin','student')),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (school_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_school_members_user ON public.school_members (user_id);

-- 5. Courses belong to a school. faculty_id is optional, since faculty do not log in.
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE;
ALTER TABLE public.courses ALTER COLUMN faculty_id DROP NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_school ON public.courses (school_id);

-- 6. Course join links. Only a hash of the token is stored. Rotating a link revokes the old row.
CREATE TABLE IF NOT EXISTS public.course_join_links (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  token_hash  text NOT NULL UNIQUE,
  created_at  timestamptz DEFAULT now(),
  revoked_at  timestamptz
);
CREATE INDEX IF NOT EXISTS idx_join_links_active
  ON public.course_join_links (course_id) WHERE revoked_at IS NULL;

-- 7. Record how each enrollment happened
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS joined_via text NOT NULL DEFAULT 'manual'
  CHECK (joined_via IN ('link','roster','manual'));

-- 8. Audit log for school-facing changes (links rotated, roster changed, etc.)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  school_id  uuid REFERENCES public.schools(id) ON DELETE CASCADE,
  action     text NOT NULL,
  target     text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_school ON public.audit_log (school_id, created_at DESC);

-- ─────────────────────────────────────────
-- Helper functions (SECURITY DEFINER so policies do not recurse into RLS)
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.platform_admins WHERE user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.is_school_member(p_school uuid, p_roles text[] DEFAULT NULL)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.school_members
    WHERE school_id = p_school
      AND user_id = auth.uid()
      AND (p_roles IS NULL OR role = ANY (p_roles))
  );
$$;

CREATE OR REPLACE FUNCTION public.is_school_admin(p_school uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_school_member(p_school, ARRAY['admin']);
$$;

-- Cross-table lookups for policies. Each reads its table as the definer, so policies on
-- courses and enrollments do not call each other and recurse.
CREATE OR REPLACE FUNCTION public.course_school(p_course uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT school_id FROM public.courses WHERE id = p_course;
$$;

CREATE OR REPLACE FUNCTION public.is_enrolled_in(p_course uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE course_id = p_course AND student_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_enrollment(p_enrollment uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE id = p_enrollment AND student_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────
-- Row-level security on new tables
-- No INSERT/UPDATE/DELETE policies for clients: writes go through the server.
-- ─────────────────────────────────────────
ALTER TABLE public.platform_admins   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_domains    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_join_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log         ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_admins_self" ON public.platform_admins;
CREATE POLICY "platform_admins_self" ON public.platform_admins FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "schools_members_read" ON public.schools;
CREATE POLICY "schools_members_read" ON public.schools FOR SELECT
  USING (public.is_platform_admin() OR public.is_school_member(id));

DROP POLICY IF EXISTS "school_domains_admin_read" ON public.school_domains;
CREATE POLICY "school_domains_admin_read" ON public.school_domains FOR SELECT
  USING (public.is_platform_admin() OR public.is_school_admin(school_id));

DROP POLICY IF EXISTS "school_members_read" ON public.school_members;
CREATE POLICY "school_members_read" ON public.school_members FOR SELECT
  USING (user_id = auth.uid() OR public.is_platform_admin() OR public.is_school_admin(school_id));

DROP POLICY IF EXISTS "join_links_admin_read" ON public.course_join_links;
CREATE POLICY "join_links_admin_read" ON public.course_join_links FOR SELECT
  USING (
    public.is_platform_admin()
    OR public.is_school_admin(public.course_school(course_join_links.course_id))
  );

DROP POLICY IF EXISTS "audit_admin_read" ON public.audit_log;
CREATE POLICY "audit_admin_read" ON public.audit_log FOR SELECT
  USING (public.is_platform_admin() OR public.is_school_admin(school_id));

-- ─────────────────────────────────────────
-- Extra read access on existing tables for school members
-- ─────────────────────────────────────────

-- Students can read the courses they are enrolled in (the existing policy only covers faculty).
DROP POLICY IF EXISTS "courses_enrolled_student" ON public.courses;
CREATE POLICY "courses_enrolled_student" ON public.courses FOR SELECT
  USING (public.is_enrolled_in(courses.id));

-- School admins (deans) can read courses in their school.
DROP POLICY IF EXISTS "courses_school_admin" ON public.courses;
CREATE POLICY "courses_school_admin" ON public.courses FOR SELECT
  USING (public.is_school_admin(school_id) OR public.is_platform_admin());

-- School admins can read enrollments in their school (for the dean summary view and counts).
DROP POLICY IF EXISTS "enrollments_school_admin" ON public.enrollments;
CREATE POLICY "enrollments_school_admin" ON public.enrollments FOR SELECT
  USING (public.is_school_admin(public.course_school(enrollments.course_id))
         OR public.is_platform_admin());

-- ─────────────────────────────────────────
-- Tables that were readable by anyone with the public anon key.
-- The app reaches these only through the service role, which bypasses RLS,
-- so enabling RLS with no client policies changes nothing for the app.
-- ─────────────────────────────────────────
ALTER TABLE IF EXISTS public.whitepaper_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.page_views          ENABLE ROW LEVEL SECURITY;

-- work_uploads: no code references it yet. Students may see and delete their own rows.
ALTER TABLE IF EXISTS public.work_uploads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "work_uploads_student_own" ON public.work_uploads;
CREATE POLICY "work_uploads_student_own" ON public.work_uploads FOR SELECT
  USING (public.owns_enrollment(work_uploads.enrollment_id));
DROP POLICY IF EXISTS "work_uploads_student_delete" ON public.work_uploads;
CREATE POLICY "work_uploads_student_delete" ON public.work_uploads FOR DELETE
  USING (public.owns_enrollment(work_uploads.enrollment_id));
