"use client"

import { Shield, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="relative z-50 px-6 py-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Kaam</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
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

                <div className="flex items-center gap-4">
                    <Link
                        href="/signup"
                        className="hidden text-sm font-medium text-white transition-colors hover:text-white/80 lg:block"
                    >
                        Get Started
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-white lg:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute left-0 right-0 top-full bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-700/30 lg:hidden">
                    <div className="flex flex-col px-6 py-6 gap-4">
                        <Link
                            href="/about"
                            className="text-white/70 transition-colors hover:text-white py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/features"
                            className="text-white/70 transition-colors hover:text-white py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="/testimonials"
                            className="text-white/70 transition-colors hover:text-white py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Testimonials
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-white/70 transition-colors hover:text-white py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/faq"
                            className="text-white/70 transition-colors hover:text-white py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/signup"
                            className="mt-2 text-white font-medium py-2 border-t border-zinc-700/30"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
