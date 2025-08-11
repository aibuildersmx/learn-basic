# Setting Up your Database and Authentication (login)

### Step 1: Supabase

Supabase is an open-source backend platform offering a hosted Postgres database, authentication, and APIs.

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a project
3. In your Supabase project, go to **Settings** → **API** and copy:
   - **Project URL**
   - **Anon public key**
   - **Service role key**
4. Add these to your `/apps/web/.env.local` file:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://example.com
   NEXT_PUBLIC_SUPABASE_ANON_KEY=example
   SUPABASE_SERVICE_ROLE_KEY=example
   ```

   Replace the example values with your actual Supabase values.

### Step 2: Set Up Google Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure the authorized origins and redirect URIs for your app
   - add `http://localhost` as an **Authorized Javascript Origin**
7. After creation, copy the **Client ID** and **Client Secret** (you'll use this for Supabase Google login)
8. Add your **Client ID** to the `/apps/web/.env.local` file:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=example
```

### Step 3: Supabase Authenticaion

To enable Google social sign-in in Supabase:

1. In your Supabase project, go to **Authentication** → **Sign In / Providers**.
2. Select **Google** from the list of providers.
3. Paste your Google **Client ID** and **Client Secret** from the previous step.
4. Click **Enable** to activate Google sign-in.
5. Save your changes.

Now users can sign in with Google on your site.

### Step 4: Restart your dev server

`pnpm run dev`

Now Google One-Tap should work!
