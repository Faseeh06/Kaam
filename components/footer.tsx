import { Shield } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-transparent">
      {/* Dynamic Premium Background */}
      <div className="absolute inset-0 bg-zinc-950 overflow-hidden pointer-events-none">
        {/* Animated glowing orbs */}
        <div className="absolute -top-[50%] -left-[10%] w-[60%] h-[120%] rounded-full bg-amber-500/5 blur-[100px] animate-slow-pulse" />
        <div className="absolute -bottom-[50%] -right-[10%] w-[60%] h-[120%] rounded-full bg-orange-600/5 blur-[120px]" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-amber-500" />
          <span className="text-lg font-medium text-white">Kaam</span>
        </Link>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="LinkedIn"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="X (formerly Twitter)"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Terms Of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
