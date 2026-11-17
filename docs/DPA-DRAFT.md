# Data Processing Agreement (DRAFT for counsel review)

**Not for signature.** This draft has not been reviewed by a lawyer. Bracketed items are placeholders to complete.

Between: [School legal name] ("Institution")
And: [Transform Learning legal entity] ("Provider")
Effective: [Date]

## 1. Purpose and roles

1.1 Provider processes personal data on behalf of Institution to provide the Transform Learning platform to Institution's students and faculty. Institution is the controller of education records. Provider is a processor.

1.2 Where applicable, Provider acts as a "school official" with a legitimate educational interest under FERPA (34 CFR 99.31(a)(1)), under Institution's direct control and only for the purposes in this agreement.

## 2. Data covered

2.1 Account data: name, school email address, role (student or administrator), school membership.

2.2 Course data: course titles, codes, sections, terms, and syllabi supplied by Institution.

2.3 Learning data: enrollments, skill proficiency estimates, assignment uploads and their extracted text, coaching chat content, and onboarding status.

2.4 Technical data: access logs and anonymous site analytics. Analytics do not identify individuals.

## 3. Purpose limits

Provider processes this data only to provide and secure the platform, to produce the summaries Institution has requested, and to comply with law. Provider does not sell data, does not use it for advertising, and does not use Institution's student data to train AI models.

[Confirm the AI provider's current data-use terms before stating the no-training commitment.]

## 4. Sub-processors

Provider uses the following sub-processors. Provider will give Institution at least [30] days' notice before adding one.

| Sub-processor | Purpose | Location |
|---|---|---|
| Supabase | Database, login, file storage | [Region] |
| Vercel | Application hosting, scheduled jobs, anonymous analytics | [Region] |
| Anthropic | AI model processing of coaching and assessment requests | [Region] |
| Resend | Transactional email | [Region] |

## 5. Security

Provider will maintain administrative, technical, and physical safeguards appropriate to the data, including:

- Encryption in transit (HTTPS) and at rest, provided by the hosting services.
- Row-level access controls so students see only their own records.
- Server-only handling of privileged credentials.
- Private storage for uploaded files, accessed through short-lived links.
- Access limited to personnel who need it, with at least two administrators per service.
- Logging of school-facing administrative changes.

## 6. Breach notification

Provider will notify Institution without undue delay and in any case within [72] hours after confirming a breach affecting Institution's data. Notice will describe the nature of the breach, the data involved, the likely effects, and the steps taken.

## 7. Requests and cooperation

7.1 Provider will forward to Institution any request from a student or parent about their records and will not respond to it directly, except to direct the person to Institution.

7.2 Provider will help Institution respond to access and amendment requests within [10] business days.

## 8. Return and deletion

8.1 On request, Provider will export Institution's data in a standard format within [30] days.

8.2 Uploaded student files are deleted [one week] after the course end date. Learning records are deleted [90] days after the end of the agreement, unless Institution asks for earlier deletion or the law requires retention.

8.3 Provider will confirm deletion in writing.

## 9. Audit

Institution may request, once a year, written answers to a security questionnaire. Provider will share its current security practices on request. [Independent audit: not yet in place. Do not state otherwise.]

## 10. Liability and term

[Liability cap, indemnity, governing law, and term: for counsel.]

## Signatures

Institution: ______________________ Name / Title / Date

Provider: ______________________ Name / Title / Date
