"use client"

import { Shield, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="relative z-50 px-6 py-10 lg:px-16 w-full">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 text-white">
                    <Shield className="h-7 w-7 text-amber-500" />
                    <span className="font-semibold text-2xl tracking-[ -0.02em]">Kaam</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-12 text-[16px] font-medium text-white/70 lg:flex">
                    <Link href="/about" className="transition-colors hover:text-white">
                        About
                    </Link>
                    <Link href="/features" className="transition-colors hover:text-white">
                        Features
                    </Link>
                    <Link href="/testimonials" className="transition-colors hover:text-white">
                        Testimonials
                    </Link>
                    <Link href="/pricing" className="transition-colors hover:text-white">
                        Pricing
                    </Link>
                    <Link href="/faq" className="transition-colors hover:text-white">
                        FAQ
                    </Link>
                </div>

                <div className="flex items-center gap-8">
                    <Link
                        href="/signup"
                        className="hidden text-[16px] font-semibold text-white transition-colors hover:text-white/80 lg:block"
                    >
                        Get Started
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-white lg:hidden p-1.5"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-8 w-8" />
                        ) : (
                            <Menu className="h-8 w-8" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute left-0 right-0 top-full bg-zinc-900/98 backdrop-blur-md border-t border-zinc-800 lg:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col px-8 py-8 gap-6">
                        <Link
                            href="/about"
                            className="text-white/80 transition-colors hover:text-white py-2.5 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/features"
                            className="text-white/80 transition-colors hover:text-white py-2.5 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="/testimonials"
                            className="text-white/80 transition-colors hover:text-white py-2.5 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Testimonials
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-white/80 transition-colors hover:text-white py-2.5 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/faq"
                            className="text-white/80 transition-colors hover:text-white py-2.5 text-lg font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/signup"
                            className="mt-4 text-white font-semibold py-4 border-t border-zinc-800 text-xl flex items-center justify-between"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get Started
                            <Shield className="h-5 w-5 text-amber-500" />
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
