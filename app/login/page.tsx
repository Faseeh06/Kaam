"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            if (email === "admin@test.com" && password === "admin123") {
                router.push("/admin");
            } else if (email === "user@test.com" && password === "user123") {
                router.push("/dashboard");
            } else {
                setError("Invalid email or password");
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[100px] animate-slow-pulse" />
                <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 text-[#172b4d] dark:text-white transition-opacity hover:opacity-80">
                        <Shield className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                        <span className="font-medium text-2xl tracking-tight">Kaam</span>
                    </Link>
                </div>

                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-xl text-[#172b4d] dark:text-white">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-normal tracking-tight text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-800 dark:text-zinc-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    className="bg-zinc-100 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-[#172b4d] dark:text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-zinc-800 dark:text-zinc-300">Password</Label>
                                    <Link href="#" className="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-400">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    className="bg-zinc-100 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-[#172b4d] dark:text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-zinc-900 hover:bg-zinc-200 transition-all active:scale-95"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>


                        </CardContent>
                    </form>
                    <CardFooter>
                        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 w-full mt-2">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-amber-600 dark:text-amber-500 hover:text-amber-400 underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
