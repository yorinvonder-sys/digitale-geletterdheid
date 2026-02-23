<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1r8KIJ3gc2HwWIl6Nm9sMms3W47uYkjp6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
3. Run the app:
   `npm run dev`

## Security Notes

- Teacher authorization uses Supabase `app_metadata` claims (`role=teacher`), not client-side role assignment.
- Teacher-like school emails (3 letters + `@almerecollege.nl`) are blocked for direct email/password registration.
