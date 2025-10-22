# Database Connection Setup

## 🔧 Fix: No Jobs Displaying Issue

Your job board is not showing jobs because the Supabase connection is not configured with your actual database credentials.

## 📋 Steps to Fix:

### 1. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon public key**

### 2. Create Environment File

Create a `.env` file in the root directory (`jobboard_pro/`) with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 3. Update Configuration

Update `src/config/supabase.js`:

```javascript
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'your_supabase_project_url',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key'
}
```

### 4. Restart the Server

After updating the credentials, restart your development server:

```bash
npm run start
```

## 🔍 Verify Connection

1. Open browser console (F12)
2. Check for any Supabase connection errors
3. Look for successful database queries

## 📊 Test Database

If you have jobs in your database, they should now appear on the job board.

## 🆘 Still No Jobs?

1. Check if your jobs table has data
2. Verify RLS (Row Level Security) policies
3. Check browser console for errors
4. Ensure your Supabase project is active

## 📞 Need Help?

- Check Supabase dashboard for connection status
- Verify your project is not paused
- Ensure you have the correct permissions 