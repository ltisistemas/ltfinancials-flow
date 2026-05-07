import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tggztqgbyxqogkppqqop.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZ3p0cWdieXhxb2drcHBxcW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjI4ODIsImV4cCI6MjA5MzY5ODg4Mn0.Ou2Ib_5cZZ31OGC9q4oTncP7Z8j8SAf12CW52U102u4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
