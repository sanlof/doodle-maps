import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Saknar Supabase-konfiguration. Fyll i VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY i .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
