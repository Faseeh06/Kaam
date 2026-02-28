"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";

export default function LoginPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[100px] animate-slow-pulse" />
                <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 text-white">
                        <Shield className="h-8 w-8 text-amber-500" />
                        <span className="font-medium text-2xl tracking-tight">Kaam</span>
                    </Link>
                </div>

                <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-xl text-white">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-normal tracking-tight text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center text-zinc-400">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                                <Link href="#" className="text-xs text-amber-500 hover:text-amber-400">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500"
                            />
                        </div>
                        <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-200">
                            Sign In
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-700" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-zinc-900 px-2 text-zinc-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800 hover:text-white">
                            GitHub
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <p className="text-center text-sm text-zinc-400 w-full mt-2">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-amber-500 hover:text-amber-400 underline underline-offset-4"
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
