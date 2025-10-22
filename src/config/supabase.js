// Supabase Configuration
// Environment variables are preferred, fallback to config for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your_supabase_project_url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey
}

// Check if credentials are properly configured
if (supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('⚠️ Supabase credentials not configured! Please set up your .env file with:');
  console.warn('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.warn('VITE_SUPABASE_ANON_KEY=your-actual-anon-key');
  console.warn('📖 See DATABASE_SETUP.md for detailed instructions');
}

// You can also use environment variables:
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your_supabase_project_url'
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key' 