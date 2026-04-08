-- ─────────────────────────────────────────
-- Transform Learning — Database Schema
-- Run this in Supabase SQL Editor
-- ─────────────────────────────────────────

-- PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         text NOT NULL CHECK (role IN ('faculty', 'student')),
  full_name    text,
  email        text NOT NULL,
  institution  text,
  avatar_url   text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title            text NOT NULL,
  course_code      text,
  institution      text,
  term             text,
  description      text,
  syllabus_text    text,
  syllabus_url     text,
  framework_status text NOT NULL DEFAULT 'pending'
                   CHECK (framework_status IN ('pending','generating','ready','approved')),
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name             text NOT NULL,
  description      text,
  skill_type       text NOT NULL CHECK (skill_type IN ('explicit', 'implicit')),
  category         text,
  sort_order       integer DEFAULT 0,
  is_approved      boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  onboarding_status text NOT NULL DEFAULT 'pending'
                    CHECK (onboarding_status IN ('pending','in_progress','complete')),
  enrolled_at      timestamptz DEFAULT now(),
  UNIQUE (course_id, student_id)
);

-- INVITES
CREATE TABLE IF NOT EXISTS public.invites (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  email            text NOT NULL,
  token            text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  invited_by       uuid NOT NULL REFERENCES public.profiles(id),
  accepted_at      timestamptz,
  expires_at       timestamptz DEFAULT (now() + interval '7 days'),
  created_at       timestamptz DEFAULT now()
);

-- PROFICIENCY SCORES (current snapshot)
CREATE TABLE IF NOT EXISTS public.proficiency_scores (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id    uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  skill_id         uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  score            numeric(4,1) NOT NULL CHECK (score >= 0 AND score <= 100),
  confidence       numeric(4,3),
  source           text NOT NULL CHECK (source IN ('assessment','upload','quiz')),
  evidence_summary text,
  scored_at        timestamptz DEFAULT now(),
  UNIQUE (enrollment_id, skill_id)
);

-- PROFICIENCY HISTORY (for trajectory charts)
CREATE TABLE IF NOT EXISTS public.proficiency_history (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id    uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  skill_id         uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  score            numeric(4,1) NOT NULL,
  confidence       numeric(4,3),
  evidence_summary text,
  source           text NOT NULL,
  scored_at        timestamptz DEFAULT now()
);

-- ASSESSMENT SESSIONS
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id    uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  skill_id         uuid REFERENCES public.skills(id) ON DELETE SET NULL,
  session_type     text NOT NULL CHECK (session_type IN ('onboarding','quiz','upload_review')),
  status           text NOT NULL DEFAULT 'in_progress'
                   CHECK (status IN ('in_progress','submitted','scored')),
  questions_json   jsonb,
  answers_json     jsonb,
  feedback_json    jsonb,
  started_at       timestamptz DEFAULT now(),
  submitted_at     timestamptz,
  scored_at        timestamptz
);

-- WORK UPLOADS
CREATE TABLE IF NOT EXISTS public.work_uploads (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id    uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  file_name        text NOT NULL,
  storage_path     text NOT NULL,
  file_type        text,
  extracted_text   text,
  assessment_json  jsonb,
  status           text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','complete','error')),
  uploaded_at      timestamptz DEFAULT now(),
  assessed_at      timestamptz
);

-- CHAT SESSIONS
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id    uuid NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  skill_id         uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at       timestamptz DEFAULT now()
);

-- CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role             text NOT NULL CHECK (role IN ('user', 'assistant')),
  content          text NOT NULL,
  created_at       timestamptz DEFAULT now()
);

-- STUDY GUIDES
CREATE TABLE IF NOT EXISTS public.study_guides (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id         uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  enrollment_id    uuid REFERENCES public.enrollments(id) ON DELETE CASCADE,
  content_md       text NOT NULL,
  generated_at     timestamptz DEFAULT now()
);

-- PAGE VIEWS (geo analytics from Edge middleware)
CREATE TABLE IF NOT EXISTS public.page_views (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path        text NOT NULL,
  country     text,
  region      text,
  city        text,
  latitude    text,
  longitude   text,
  user_agent  text,
  referer     text,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_city ON public.page_views (city, region, country);

-- WHITEPAPER REQUESTS (gated download with approval)
CREATE TABLE IF NOT EXISTS public.whitepaper_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  institution text,
  role        text,
  message     text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  token       text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at  timestamptz DEFAULT now(),
  approved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_wp_requests_token ON public.whitepaper_requests (token);
CREATE INDEX IF NOT EXISTS idx_wp_requests_email ON public.whitepaper_requests (email);

-- ─────────────────────────────────────────
-- TRIGGER: auto-create profile on signup
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proficiency_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proficiency_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_guides ENABLE ROW LEVEL SECURITY;

-- profiles: users see their own
CREATE POLICY "profiles_own" ON public.profiles FOR ALL USING (auth.uid() = id);

-- courses: faculty see their own; students see enrolled courses (via service role in API)
CREATE POLICY "courses_faculty" ON public.courses FOR ALL USING (auth.uid() = faculty_id);

-- skills: anyone authenticated can read (students need to read skills for their courses)
CREATE POLICY "skills_read" ON public.skills FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "skills_write" ON public.skills FOR ALL USING (
  auth.uid() = (SELECT faculty_id FROM courses WHERE id = course_id)
);

-- enrollments: students see their own; faculty see for their courses
CREATE POLICY "enrollments_student" ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);
CREATE POLICY "enrollments_faculty" ON public.enrollments FOR SELECT
  USING (auth.uid() = (SELECT faculty_id FROM courses WHERE id = course_id));

-- proficiency_scores: students see their own
CREATE POLICY "proficiency_student" ON public.proficiency_scores FOR SELECT
  USING (auth.uid() = (SELECT student_id FROM enrollments WHERE id = enrollment_id));
CREATE POLICY "proficiency_faculty" ON public.proficiency_scores FOR SELECT
  USING (auth.uid() = (SELECT faculty_id FROM courses
    WHERE id = (SELECT course_id FROM enrollments WHERE id = enrollment_id)));

-- proficiency_history: same as scores
CREATE POLICY "history_student" ON public.proficiency_history FOR SELECT
  USING (auth.uid() = (SELECT student_id FROM enrollments WHERE id = enrollment_id));

-- assessment_sessions: students see their own
CREATE POLICY "sessions_student" ON public.assessment_sessions FOR ALL
  USING (auth.uid() = (SELECT student_id FROM enrollments WHERE id = enrollment_id));

-- chat
CREATE POLICY "chat_sessions_own" ON public.chat_sessions FOR ALL
  USING (auth.uid() = (SELECT student_id FROM enrollments WHERE id = enrollment_id));
CREATE POLICY "chat_messages_own" ON public.chat_messages FOR ALL
  USING (auth.uid() = (SELECT student_id FROM enrollments
    WHERE id = (SELECT enrollment_id FROM chat_sessions WHERE id = session_id)));

-- study guides: students see their own
CREATE POLICY "guides_student" ON public.study_guides FOR SELECT
  USING (auth.uid() = (SELECT student_id FROM enrollments WHERE id = enrollment_id));
