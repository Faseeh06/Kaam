"use client"

import { Shield, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function SiteHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isStandalone, setIsStandalone] = useState(false)
    const [isIOS, setIsIOS] = useState(false)
    const [isAndroid, setIsAndroid] = useState(false)
    const [installHelp, setInstallHelp] = useState("")
    const [notificationHelp, setNotificationHelp] = useState("")

    useEffect(() => {
        if (typeof window === "undefined") return

        setIsStandalone(
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true
        )
        setIsIOS(/iPad|iPhone|iPod/.test(window.navigator.userAgent))
        setIsAndroid(/Android/i.test(window.navigator.userAgent))

        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
        }

        const onAppInstalled = () => {
            setDeferredPrompt(null)
            setIsStandalone(true)
        }

        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)
        window.addEventListener("appinstalled", onAppInstalled)

        return () => {
            window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)
            window.removeEventListener("appinstalled", onAppInstalled)
        }
    }, [])

    const handleInstall = async () => {
        setInstallHelp("")

        if (deferredPrompt) {
            await deferredPrompt.prompt()
            const choice = await deferredPrompt.userChoice
            setDeferredPrompt(null)
            if (choice.outcome === "accepted") {
                setMobileMenuOpen(false)
            }
            return
        }

        if (isIOS) {
            setInstallHelp("On iPhone/iPad Safari: tap Share, then tap 'Add to Home Screen'.")
            return
        }

        if (isAndroid) {
            setInstallHelp("Install prompt is unavailable in this in-app browser. Open this page in Chrome, then use Chrome menu > 'Install app' or 'Add to Home screen'.")
            return
        }

        setInstallHelp("Install is currently unavailable in this browser. Please open the site in Chrome, Edge, or Safari and try again.")
    }

    const handleTestNotification = async () => {
        setNotificationHelp("")
        console.log("[Kaam][NotifTest] Triggered test notification click.")

        if (typeof window === "undefined") return
        if (!("Notification" in window)) {
            console.warn("[Kaam][NotifTest] Notification API not available in this browser.")
            setNotificationHelp("This browser does not support notifications.")
            return
        }

        console.log("[Kaam][NotifTest] Current permission:", Notification.permission)
        let permission = Notification.permission
        if (permission === "default") {
            console.log("[Kaam][NotifTest] Requesting permission...")
            permission = await Notification.requestPermission()
            console.log("[Kaam][NotifTest] Permission result:", permission)
        }

        if (permission !== "granted") {
            console.warn("[Kaam][NotifTest] Permission not granted:", permission)
            setNotificationHelp("Notification permission is blocked. Please allow notifications in browser settings.")
            return
        }

        let swSuccess = false

        try {
            if ("serviceWorker" in navigator) {
                console.log("[Kaam][NotifTest] Service Worker supported. Checking registration...")
                const existing = await navigator.serviceWorker.getRegistration()
                console.log("[Kaam][NotifTest] Existing SW registration:", existing)
                const registration = existing || (await navigator.serviceWorker.register("/sw.js"))
                if (!existing) {
                    console.log("[Kaam][NotifTest] Registered /sw.js successfully.")
                }
                await navigator.serviceWorker.ready
                console.log("[Kaam][NotifTest] Service Worker ready. Sending SW notification...")
                await registration.showNotification("Kaam Test Notification", {
                    body: "Service worker notification test.",
                    icon: "/apple-icon.png",
                    badge: "/icon-dark-32x32.png",
                    tag: `kaam-test-sw-${Date.now()}`,
                    requireInteraction: true,
                })
                console.log("[Kaam][NotifTest] SW notification sent.")
                swSuccess = true
            } else {
                console.warn("[Kaam][NotifTest] Service Worker API not supported.")
            }
        } catch (error) {
            console.error("[Kaam][NotifTest] SW notification failed:", error)
            swSuccess = false
        }

        // Only use direct notification as fallback to avoid duplicate popups.
        if (!swSuccess) {
            try {
                console.log("[Kaam][NotifTest] Sending direct Notification API notification...")
                const n = new Notification("Kaam Test Notification", {
                    body: "Browser notification test.",
                    icon: "/apple-icon.png",
                    requireInteraction: true,
                })
                n.onclick = () => {
                    window.focus()
                    n.close()
                }
                console.log("[Kaam][NotifTest] Direct notification sent.")
            } catch (error) {
                console.error("[Kaam][NotifTest] Direct notification failed:", error)
            }
        }

        console.log("[Kaam][NotifTest] Result:", { swSuccess })
        if (swSuccess) {
            setNotificationHelp("Test notification sent. If no popup appears, check Windows Focus Assist and browser site notification settings.")
            return
        }

        if (Notification.permission === "granted") {
            setNotificationHelp("Fallback notification attempted. If no popup appears, check Windows Focus Assist and browser site notification settings.")
            return
        }

        console.error("[Kaam][NotifTest] Both notification methods failed.")
        setNotificationHelp("Failed to send notification. Open this site in Chrome/Edge, allow notifications, and ensure Windows notifications are enabled.")
    }

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
                    <Button
                        type="button"
                        onClick={handleTestNotification}
                        className="hidden lg:inline-flex bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-700"
                    >
                        Test Notification
                    </Button>
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
                        {!isStandalone && (
                            <div className="mt-1 space-y-2">
                                <Button
                                    type="button"
                                    onClick={handleInstall}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                                >
                                    Install App
                                </Button>
                                {installHelp && (
                                    <p className="text-xs leading-relaxed text-zinc-300">
                                        {installHelp}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Button
                                type="button"
                                onClick={handleTestNotification}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                            >
                                Test Notification
                            </Button>
                            {notificationHelp && (
                                <p className="text-xs leading-relaxed text-zinc-300">
                                    {notificationHelp}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
