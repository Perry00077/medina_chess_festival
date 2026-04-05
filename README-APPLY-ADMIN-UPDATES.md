Apply these files to your local clone of `medina_chess_festival`.

Updated files:
- `src/components/RegistrationForm.jsx`
- `src/pages/admin/AdminDashboardPage.jsx`
- `src/pages/public/GalleryPage.jsx`  (new)
- `src/data/translations.js`
- `supabase/functions/submit-registration/index.ts`
- `supabase_schema.sql`
- `supabase/migrations/20260405_admin_documents_update.sql`  (new)

What changed:
1. The registration form now always requires the player's passport.
2. If `has_companion` is checked, each companion must also have a passport uploaded.
3. The admin dashboard now shows:
   - totals per tournament
   - search and filters
   - player passport preview/open link
   - companion passport preview/open link
4. Added the missing `GalleryPage.jsx` file because `src/App.jsx` already imports `/gallery`.
5. Added a storage policy so authenticated admin users can read private files from the `registration-documents` bucket.

Supabase steps:
1. Run `supabase_schema.sql` OR just run the migration file `supabase/migrations/20260405_admin_documents_update.sql` in Supabase SQL Editor.
2. Redeploy the public registration function:

   `supabase functions deploy submit-registration --no-verify-jwt`

3. Make sure your site uses the same Supabase project as:
   - the dashboard database
   - `VITE_SUPABASE_URL`
   - the deployed edge function

Important:
- Old registrations that were created before passport uploads were added may still have empty document fields.
- New registrations after this update should include the player's passport every time, and companions' passports when companions are present.
