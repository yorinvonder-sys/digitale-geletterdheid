# Independent review prompt — J3 improvement batch 1

Review the safely shareable local diff from base
`7a929bd2a63351e40d13312e373d6d575b93a6e2` through current `HEAD`.
This is a read-only review. Do not edit files, run production actions, inspect
credentials, or access learner data.

## Goal

Improve year-3 missions for 14-year-old havo/vwo learners without changing
auth, database, XP, production, or learner records:

- anonymize and explicitly mark synthetic wellbeing/forensics data;
- expose truthful provenance for J3 DataViewer datasets;
- require meaningful, privacy-safe evidence in selected BuilderCanvas steps;
- migrate old local Builder saves without silently bypassing new evidence;
- repair J3 role registration and move reviews after regular missions only for
  year 3;
- make InspectorTask require all distinct correct hotspots and align J3 prompt
  counts;
- remove P4 requests for minors' names, contact details, photos, voice/video,
  public links, and identifiable tester feedback.

## Review focus

Return findings ordered `BLOCKER`, `HIGH`, `MEDIUM`, `LOW`, `OPTIONAL`, with
exact file/line evidence, impact, and bounded remediation. Attempt to disprove:

1. Privacy/data minimization for minors, including active configs and matching
   AI-coach roles.
2. Data integrity of the Builder evidence gate and legacy-save migration.
3. InspectorTask all-hotspot completion, duplicate clicks, accessibility,
   timer/race behavior, and whether J3 `SPECIAL:*` inspector canvases are
   actually rendered and usable.
4. J3-only review ordering and preservation of J1/J2 behavior.
5. Truthfulness of synthetic/source claims and absence of invented official
   provenance.
6. Type/runtime regressions in shared DataViewer/BuilderCanvas engines.
7. Whether the added tests meaningfully verify behavior rather than only copy.

## Collected local evidence

- 16 targeted Node contract tests: PASS.
- `npx tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 5.0`: PASS.
- `npm run build:prod`: PASS locally, with an explicit warning that Supabase
  environment variables are absent; this is not auth, persistence, or
  production proof.
- `npm run doctor` and normal `npm run typecheck`: fail before source checking
  because the repository sets unsupported `ignoreDeprecations=6.0` under the
  installed TypeScript 5.8.3.
- Repo-wide mission registration preflight: one pre-existing unrelated hard
  failure for `mail-detective` / `helpdesk-shift`; targeted J3 registration is
  26/26 PASS.
- Browser evidence is being collected separately via the internal browser and
  is not available to this source-only review.

End with exactly one verdict: `PASS`, `FAIL`, or `CANNOT VERIFY`, and list all
remaining gates. A build must not be promoted to production, physical-iPad,
real-learner, or privacy-complete proof.
