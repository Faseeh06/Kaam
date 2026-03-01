import { createClient as createServerClient } from '@supabase/supabase-js';

// Admin client — bypasses RLS. Server-side ONLY.
// Used for: super-admin operations, background jobs, migrations.
export function createAdminClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}
