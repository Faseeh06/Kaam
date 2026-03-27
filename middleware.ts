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
        const managementRoles = ['Admin', 'Office Bearer'];
        const isSocietyAdmin = memberships.some((m: any) => managementRoles.includes(m.role));
        const defaultWorkspace = isSuperAdmin ? '/super' : isSocietyAdmin ? '/admin' : '/dashboard';

        // 1. Join is only for standard users.
        if (isJoinPage && (isSuperAdmin || isSocietyAdmin)) {
            url.pathname = defaultWorkspace;
            return NextResponse.redirect(url);
        }

        // 2. Redirect away from auth pages based on strict role hierarchy.
        if (isAuthPage) {
            url.pathname = defaultWorkspace;
            return NextResponse.redirect(url);
        }

        // 3. Enforce panel access by role.
        if (url.pathname.startsWith('/super') && !isSuperAdmin) {
            url.pathname = defaultWorkspace;
            return NextResponse.redirect(url);
        }

        if (url.pathname.startsWith('/admin') && !(isSuperAdmin || isSocietyAdmin)) {
            url.pathname = defaultWorkspace;
            return NextResponse.redirect(url);
        }
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
