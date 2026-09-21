import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgbpqjdqrjgjdnjpisot.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_GyQuYyU5R9E_pHp7AG6MgQ_xubyPole';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
