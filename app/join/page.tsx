"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2, CheckCircle2 } from "lucide-react";

export default function JoinSocietyPage() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Find society by code
            const { data: society, error: socError } = await supabase
                .from('societies')
                .select('id, name')
                .eq('join_code', code.trim().toUpperCase())
                .single();

            if (socError || !society) {
                throw new Error("Invalid society code. Please check and try again.");
            }

            // 2. Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found. Please log in again.");

            // 3. Link user to society
            const { error: linkError } = await supabase
                .from('user_societies')
                .insert([{
                    user_id: user.id,
                    society_id: society.id,
                    role: 'Member',
                    status: 'Pending'
                }]);

            if (linkError) {
                if (linkError.code === '23505') {
                    throw new Error("You are already a member of this society.");
                }
                throw linkError;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f5f7] dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
                <CardHeader className="space-y-1 pt-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl ring-1 ring-amber-500/20">
                            <Shield className="h-10 w-10 text-amber-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center tracking-tight">Join Your Society</CardTitle>
                    <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
                        Enter the unique code provided by your society administrator.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                            <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400 text-center">Successfully Joined!</p>
                            <p className="text-sm text-zinc-500 text-center">Redirecting you to your dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleJoin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-sm font-semibold uppercase tracking-wider text-zinc-500 ml-1">Society Code</Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. CSS2026"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                    className="h-12 text-center text-lg font-mono tracking-widest uppercase bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-amber-500 transition-all"
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium animate-in slide-in-from-top-1 duration-200">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying Code...
                                    </>
                                ) : (
                                    "Join Society"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
                {!success && (
                    <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800/50 pt-6">
                        <button
                            onClick={handleLogout}
                            className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                        >
                            Log out & try another account
                        </button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
