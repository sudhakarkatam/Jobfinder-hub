import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '../config/supabase.js'

// Use environment variables if available, otherwise use config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_CONFIG.url
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 