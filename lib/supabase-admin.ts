import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('Service role key prefix:', serviceRoleKey?.slice(0, 15))

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)