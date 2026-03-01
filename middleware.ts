import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protective Routing
    const url = request.nextUrl.clone();
    const isAuthPage = url.pathname === '/login' || url.pathname === '/signup';
    const isJoinPage = url.pathname === '/join';
    const isProtectedPage = url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/admin') ||
        url.pathname.startsWith('/super');

    if (!user && (isProtectedPage || isJoinPage)) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (user) {
        // Fetch profile to check role
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_global_admin, user_societies(role)')
            .eq('id', user.id)
            .single();

        const isSuperAdmin = profile?.is_global_admin;
        const memberships = profile?.user_societies || [];

        // Define management roles
        const managementRoles = ['Admin', 'Director', 'Deputy Director', 'HR'];
        const isSocietyAdmin = memberships.some((m: any) => managementRoles.includes(m.role));

        // 1. If hitting /join and already a Super Admin, push to /super
        if (isSuperAdmin && isJoinPage) {
            url.pathname = '/super';
            return NextResponse.redirect(url);
        }

        // 2. Redirect away from auth pages
        if (isAuthPage) {
            if (isSuperAdmin) {
                url.pathname = '/super';
            } else if (isSocietyAdmin) {
                url.pathname = '/admin';
            } else {
                url.pathname = '/dashboard';
            }
            return NextResponse.redirect(url);
        }

        // 3. If a Society Admin tries to go to standard dashboard, let them (or you can force /admin)
        // 4. If a standard user has no society, they go to /dashboard (no more forced /join)
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
