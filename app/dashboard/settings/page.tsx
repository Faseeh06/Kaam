"use client";

import { Bell, Lock, User, Palette, ShieldCheck, Mail, Globe, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const supabase = createClient();

    useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, email, phone")
                    .eq("id", authUser.id)
                    .single();

                if (profile) {
                    setFullName(profile.full_name || "");
                    setEmail(profile.email || "");
                    setPhone(profile.phone || "");
                }
            }
            setLoading(false);
        }
        fetchSettings();
    }, [supabase]);

    const handleSave = async () => {
        setSaving(true);
        setSaveSuccess(false);
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            await supabase.from("profiles").update({
                full_name: fullName,
                phone: phone
                // we omit email updating here to prevent breaking auth before verification
            }).eq("id", authUser.id);

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-background dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-white mb-2">Settings</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                            Manage your account preferences and notification settings.
                        </p>
                    </div>
                    {saveSuccess && (
                        <div className="hidden md:flex items-center text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-4">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Success
                        </div>
                    )}
                </div>
            </header>

            <div className="w-full grid md:grid-cols-4 gap-6 md:gap-8">

                {/* Left Column - Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-amber-600 dark:text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-400 font-medium">
                        <User className="h-4 w-4 mr-3" /> Account
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800">
                        <Bell className="h-4 w-4 mr-3" /> Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800">
                        <Lock className="h-4 w-4 mr-3" /> Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800">
                        <Palette className="h-4 w-4 mr-3" /> Appearance
                    </Button>
                </div>

                {/* Right Column - Content */}
                <div className="md:col-span-3 space-y-6">

                    {/* General Settings */}
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 shadow-xl overflow-hidden rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                                <User className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                General Information
                            </CardTitle>
                            <CardDescription className="text-zinc-500">Update your primary account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-300">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500 shadow-sm transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-300">Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500 shadow-sm transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-300">Email Address</label>
                                <div className="space-y-1">
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed opacity-70 rounded-lg p-2.5 text-sm text-zinc-800 dark:text-zinc-100 shadow-sm"
                                    />
                                    <p className="text-xs text-zinc-500">Contact global support to change your email.</p>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-amber-500 text-zinc-950 hover:bg-amber-600 font-medium px-6 shadow-sm disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Notifications */}
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 shadow-xl overflow-hidden rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                                <Bell className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                                Notifications
                            </CardTitle>
                            <CardDescription className="text-zinc-500">Decide what hits your inbox</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/40">
                                <div>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200 text-sm mb-1">Task Assignments</p>
                                    <p className="text-xs text-zinc-500">Email me when I'm assigned to a new task</p>
                                </div>
                                <div className="h-6 w-11 bg-amber-500 rounded-full relative cursor-pointer opacity-90 hover:opacity-100 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                                    <div className="absolute top-1 right-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/40">
                                <div>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200 text-sm mb-1">Deadlines</p>
                                    <p className="text-xs text-zinc-500">Email me 24 hours before a task is due</p>
                                </div>
                                <div className="h-6 w-11 bg-amber-500 rounded-full relative cursor-pointer opacity-90 hover:opacity-100 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                                    <div className="absolute top-1 right-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/40 opacity-80">
                                <div>
                                    <p className="font-medium text-zinc-800 dark:text-zinc-200 text-sm mb-1">Society Announcements</p>
                                    <p className="text-xs text-zinc-500">Email me about general team updates</p>
                                </div>
                                <div className="h-6 w-11 bg-zinc-700/50 rounded-full relative cursor-pointer hover:bg-zinc-700 transition">
                                    <div className="absolute top-1 left-1 h-4 w-4 bg-zinc-400 rounded-full shadow-sm" />
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="bg-rose-500/5 border-rose-500/20 shadow-xl overflow-hidden rounded-2xl">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-semibold text-rose-500 mb-2">Danger Zone</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                            <Button variant="outline" className="border-rose-500/50 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 h-9">
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>
    );
}
