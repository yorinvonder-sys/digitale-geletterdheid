# DGSkills GDPR Rights Coverage Register

Last updated: 2026-06-25

This register defines the minimum tables that must be considered for export, deletion and processing-restriction claims. It does not prove that every backup or provider copy is deleted; public wording must keep DPA/back-up/audit-log caveats.

| Table | Identifier used | Export coverage | Delete coverage | Restrict-processing coverage | Notes |
|---|---|---|---|---|---|
| users | id/uid | included | public user delete/cascade | flag on users | Account/profile hoofdgegevens. |
| mission_progress | user_id | included | cascade/manual policy expected | RLS blocks new own insert/update | Learning progress. |
| xp_transactions | user_id | included | cascade/manual policy expected | not fully enforced | XP history. |
| shared_projects | user_id | included | cascade/manual policy expected | RLS blocks new own insert | Published or shared work. |
| shared_games | user_id | included | cascade/manual policy expected | RLS blocks new own insert/update; retention cron | Shared game artifacts. |
| feedback | user_id | included | cascade/manual policy expected | RLS blocks new own insert; retention cron | Student feedback. |
| student_activities | user_id | included | cascade/manual policy expected | retention cron | Operational activity. |
| audit_logs | user_id/uid | included | retained per compliance policy | retained per compliance policy | Up to 3 years. |
| ai_beleid_surveys | user_id | included | cascade/manual policy expected | not fully enforced | AI policy survey. |
| ai_beleid_feedback | user_id | included | cascade/manual policy expected | not fully enforced | AI policy feedback. |
| teacher_messages | sender_id/receiver_id | included | shared-controller review needed | not fully enforced | May involve multiple users. |
| library_items | user_id | included | cascade/manual policy expected | RLS blocks new own insert/update | Saved items. |
| duel_challenges | challenger_id/challenged_id | included | retention/cascade expected | RLS blocks new own insert/update; retention cron | Duel history/challenges. |
| developer_tasks | user_id | included | cascade/manual policy expected | not fully enforced | Developer mode tasks. |
| developer_milestones | user_id | included | cascade/manual policy expected | not fully enforced | Developer mode milestones. |
| developer_plans | user_id | included | cascade/manual policy expected | not fully enforced | Developer mode plans. |
| developer_settings | user_id | included | cascade/manual policy expected | not fully enforced | Developer mode settings. |
| student_consents | student_id | included | retained per consent/audit policy | consent controls | Consent record. |
| parental_consent_requests | student_id | included | retained per consent/audit policy | consent controls | Parent approval trail. |
| peer_feedback | from_student_id/to_student_id | included | shared-controller review needed | not fully enforced | Multi-student data. |
| wellbeing_alerts | student_id | limited export | school/DPO review needed | not fully enforced | Sensitive safeguarding signal; export minimizes fields. |
| nulmeting_results | user_id | included | cascade/manual policy expected | RLS blocks new own insert/update | Baseline assessment. |
| teacher_step_overrides | student_id | included | retained per school record policy | human oversight record | AI Act human oversight evidence. |

Implementation rule: new tables with `user_id`, `student_id`, `uid`, `sender_id`, `receiver_id`, `from_student_id` or `to_student_id` must be added here and reviewed in `exportMyData`, `deleteMyAccount`, `restrictProcessing` and `current_user_processing_restricted()` policy coverage before public rights wording is strengthened.
