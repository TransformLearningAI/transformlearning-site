# Transform Learning: Operations Runbook

Purpose: anyone with account access can keep the platform running, deploy a fix, and respond to an incident without the original developer. Keep this file current when anything changes.

Never paste secret values into this file, a ticket, or a chat. Store them only in the hosting dashboard and the password manager.

## 1. Accounts and owners

| Service | What it does | Owner (primary / second admin) | Notes |
|---|---|---|---|
| GitHub | Source code, pull requests | [TBD] / [TBD] | Repo: TransformLearningAI/transformlearning-site |
| Vercel | Hosting, cron jobs, analytics | [TBD] / [TBD] | Move to a company team account |
| Supabase | Database, login, file storage | [TBD] / [TBD] | Enable daily backups on a paid plan |
| Anthropic | AI model API | [TBD] / [TBD] | Set a monthly spend limit |
| Resend | Transactional email | [TBD] / [TBD] | Sends access links, pilot form, dean summaries |
| Domain registrar | transformlearning.ai, yourclassroom.ai | [TBD] / [TBD] | Auto-renew on |

Rule: every service has at least two admins, and no service is tied to one personal login only.

## 2. Environment variables

Set these in Vercel (Project Settings, Environment Variables). Use the **sensitive** type for anything that is a secret.

| Name | Purpose | Secret? |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | No |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public client key (protected by RLS) | No |
| SUPABASE_SERVICE_ROLE_KEY | Server-only key that bypasses RLS | **Yes** |
| ANTHROPIC_API_KEY | AI model calls | **Yes** |
| RESEND_API_KEY | Email sending | **Yes** |
| NEXT_PUBLIC_APP_URL | Public site URL used in emails | No |
| ACCESS_SECRET | Signs access keys and approval links | **Yes** |
| REVOKED_EMAILS | Comma-separated emails blocked from access | No |
| DIGEST_EMAIL | Where the daily digest goes | No |
| CRON_SECRET | Authenticates the scheduled digest job | **Yes** |
| VERCEL_TOKEN, VERCEL_API_TOKEN, VERCEL_PROJECT_ID, VERCEL_ANALYTICS_TOKEN | Analytics reporting | **Yes** |

Rotation: change `ACCESS_SECRET` only with a plan, since existing access keys stop working. Rotate the others after any suspected leak, then redeploy.

## 3. Deploy

1. Work on a branch. Never commit straight to `main`.
2. Open a pull request. Vercel builds a preview automatically.
3. Test the preview: sign-in, a course page, the access gate, and the pilot form.
4. Merge to `main`. Vercel deploys production.
5. If production breaks, use Vercel's Deployments page to roll back to the last good deployment.

To rebuild locally: `npm ci`, then `npm run build`. The build needs the variables in section 2 set to any value.

## 4. Database migrations

Schema files live in `supabase/`. Run them in the Supabase SQL editor, in this order:

1. `supabase/schema.sql` (base; already applied to production)
2. `supabase/school-model.sql` (school model and access rules; additive and safe to re-run)

Before any production migration:
- Take a backup, or confirm point-in-time recovery is on.
- Run the same file on a second Supabase project first.
- Check the Table Editor shows "RLS enabled" on every table in `public`.

## 5. Scheduled jobs

- `/api/digest`, daily at 13:00 UTC (`vercel.json`). Requires `CRON_SECRET`.
- Planned: nightly upload cleanup, one week after a course ends. Not built yet.

## 6. Data and access

- Student uploads: private Supabase Storage. Signed links only.
- Dean summaries: totals only, no student names (planned).
- Access to production data: service-role key is used only by server routes. Do not use it in a browser or a script that is shared.

## 7. Incident response

1. Confirm the problem: check the Vercel runtime logs and Supabase logs.
2. Stop the bleeding: roll back the last deployment if it's the cause.
3. Suspected data exposure: rotate the affected key first, then investigate. Preserve logs.
4. Notify affected schools within the window in the DPA (see `docs/DPA-DRAFT.md`). [Window TBD by counsel]
5. Write a short note afterward: what happened, what changed, what to watch.

## 8. Backups and recovery

- Database: Supabase daily backups and point-in-time recovery, which need a paid plan. [Confirm plan]
- Code: GitHub is the source of truth. Keep at least one other clone of the repo outside GitHub.
- Restore test: once a quarter, restore a backup to a test project and confirm it loads.

## 9. Contacts

- Primary: [TBD]
- Second: [TBD]
- Hosting support: Vercel and Supabase support channels (see each dashboard)
