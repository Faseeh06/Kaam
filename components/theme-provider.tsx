"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();

  // Dashboard, admin, and super regions should allow normal light/dark mode toggling.
  // Everything else (public pages, auth) is forced to dark mode.
  const isAppRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/super");
  const forcedTheme = isAppRoute ? undefined : "dark";

  return (
    <NextThemesProvider forcedTheme={forcedTheme} {...props}>
      {children}
    </NextThemesProvider>
  );
}
