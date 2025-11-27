import { createClient as createBrowserClient } from "@supabase/supabase-js";
import { createClient as createServerClient, SupabaseClient } from "@supabase/supabase-js";


const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SRV = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function sbClient() {
return createBrowserClient(URL, ANON, { auth: { persistSession: false } });
}

export function sbServer(): SupabaseClient {
if (!SRV) throw new Error("SUPABASE_SERVICE_ROLE_KEY ausente no server environment");
return createServerClient(URL, SRV, { auth: { persistSession: false } });
}