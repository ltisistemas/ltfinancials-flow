import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
	process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL ||
	process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseAnonKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	process.env.STORAGE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
	throw new Error('Missing Supabase URL env var: NEXT_PUBLIC_STORAGE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
	throw new Error('Missing Supabase anon key env var: NEXT_PUBLIC_SUPABASE_ANON_KEY or STORAGE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
