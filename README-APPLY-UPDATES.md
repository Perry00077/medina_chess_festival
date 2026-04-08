# Medina Chess Festival – apply these updates

## Included changes
- removed the public **Admin** button from the site header/mobile menu
- moved the registration form to a dedicated page: `/registration`
- homepage registration section now points to the dedicated page
- stronger client-side form validation:
  - required fields
  - email validation
  - phone validation
  - Elo and FIDE ID numeric-only validation
  - participant passport always required
  - each companion must have a name and passport
- accommodation updates:
  - removed **Idéal familles / family friendly** wording for Belisaire
  - Solaria now displays **5 stars**
  - added hotel website buttons
- admin dashboard updates:
  - inspect document button
  - download document button
  - delete registration button
- security improvements in Edge Functions:
  - stricter CORS handling
  - stricter server-side input validation
  - new protected admin deletion function

## Files to copy into your project
Copy all files from this patch into the **main folder** of your project and replace existing files when Windows asks.

## Then do this step by step

### 1) Front-end
In your local project folder:
```bash
npm install
npm run build
```
Then push to GitHub and redeploy on Vercel.

### 2) Supabase Edge Functions
Deploy the public registration function **without JWT verification**:
```bash
supabase functions deploy submit-registration --no-verify-jwt
```

Deploy the protected admin delete function normally:
```bash
supabase functions deploy admin-delete-registration
```

If you still use the email function, redeploy it too:
```bash
supabase functions deploy send-registration-email
```

### 3) Supabase secrets
Make sure `ALLOWED_ORIGINS` includes your production domain and localhost:
```bash
supabase secrets set ALLOWED_ORIGINS="https://medinainternationalchessfestival.com,https://www.medinainternationalchessfestival.com,http://localhost:5173"
```

Also keep these secrets present:
- `TURNSTILE_SECRET_KEY`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL`
- `BREVO_SENDER_NAME`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4) Cloudflare Turnstile
In Cloudflare Turnstile hostname settings, add:
- `medinainternationalchessfestival.com`
- `www.medinainternationalchessfestival.com`

### 5) Admin security checks
Keep these rules in place:
- `registration-documents` bucket must stay **private**
- only authenticated admins in `admin_users` should access admin dashboard
- never commit `.env` or service-role keys to GitHub

## Important notes
- Removing the Admin button from the public site only hides the shortcut. The real protection is still:
  - Supabase Auth
  - `admin_users`
  - protected admin Edge Function
- If registration still fails in production, check first:
  - Turnstile hostname
  - `ALLOWED_ORIGINS`
  - `submit-registration --no-verify-jwt`
