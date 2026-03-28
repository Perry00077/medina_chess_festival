# Security notes

## Frontend
- Keep only public `VITE_` variables in Vercel.
- Do not commit or share a real `.env` file.
- The registration form now validates email format, trims inputs, limits lengths, and restores the honeypot field correctly.

## Supabase Edge Function
Set these secrets before deploying `send-registration-email`:
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `ALLOWED_ORIGINS` → comma-separated list such as `https://your-domain.vercel.app,https://yourdomain.com,http://localhost:5173`

## Important limitation
This version is safer than before, but a public registration form should still use CAPTCHA or server-side rate limiting for stronger anti-spam protection.
