# Medina Chess Festival — React + Vite + Supabase

This version includes:
- Tailwind CSS
- shadcn/ui-style component structure
- Framer Motion animations
- multilingual public site
- Supabase registration flow
- Supabase Auth admin area
- optional Edge Function for emails via Resend

## 1) Install everything

```bash
npm install
```

## 2) Configure environment variables

Copy `.env.example` to `.env` and fill in your real values.

```bash
cp .env.example .env
```

Required frontend envs:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional frontend env:
- `VITE_ENABLE_REGISTRATION_EMAILS=false`

Keep email sending disabled until the Edge Function works correctly.

## 3) Run the app

```bash
npm run dev
```

## 4) Build for production

```bash
npm run build
```

## 5) Supabase database setup

Run `supabase_schema.sql` in your Supabase SQL editor.
Then create one admin user in Supabase Auth.
Then insert that same user id into `public.admin_users`.

## 6) Optional email setup with Resend

### A. Create a Resend API key
Do not put it in the React frontend.

### B. Add Supabase Function secrets
In Supabase, add:
- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `FROM_EMAIL`

### C. Deploy the Edge Function

```bash
supabase functions deploy send-registration-email --no-verify-jwt
```

### D. Turn on the frontend flag
In `.env`:

```env
VITE_ENABLE_REGISTRATION_EMAILS=true
```

## 7) Why the form has comments in code
Important comments were added in:
- `src/components/RegistrationForm.jsx`
- `supabase/functions/send-registration-email/index.ts`

Those comments explain:
- the anti-spam honeypot field
- when the optional email function is triggered
- how to configure secrets safely
