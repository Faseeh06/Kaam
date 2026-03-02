"use client";

import { Building2, Save, Mail, LinkIcon, MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { useMockData } from "@/app/context/MockDataContext";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminSocietyPage() {
    const { societies, updateSociety } = useMockData();
    const [managedSocietyId, setManagedSocietyId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getManagedSociety = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('user_societies(society_id, role)')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const managementRoles = ['Admin', 'Director', 'Deputy Director', 'HR', 'Society President', 'Vice President', 'Secretary', 'Treasurer', 'General Admin'];
                    const managed = (profile.user_societies as any[])?.find(us => managementRoles.includes(us.role));
                    setManagedSocietyId(managed?.society_id);
                }
            }
            setIsLoading(false);
        };
        getManagedSociety();
    }, []);

    const society = societies.find(s => s.id === managedSocietyId);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (society && name === "") {
            setName(society.name || "");
            setDescription(society.description || "");
            setEmail(society.email || "");
            setWebsite(society.website || "");
            setLogo(society.logo || "");
        }
    }, [society]);

    const handleSave = async () => {
        if (!society) return;
        setIsSaving(true);
        try {
            await updateSociety(society.id, {
                name,
                description,
                email,
                website,
                logo
            });
            toast.success("Society updated successfully");
        } catch (error: any) {
            toast.error("Failed to update society: " + error.message);
        }
        setIsSaving(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !society) return;

        setIsUploading(true);
        const toastId = toast.loading("Uploading logo...");

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${society.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('logos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath);

            setLogo(publicUrlData.publicUrl);
            await updateSociety(society.id, { logo: publicUrlData.publicUrl });
            toast.success("Logo uploaded successfully!", { id: toastId });
        } catch (error: any) {
            toast.error("Upload failed: " + error.message, { id: toastId });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
            </div>
        );
    }

    if (!society) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-500">
                Managed society not found.
            </div>
        );
    }
    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10">
                <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Society Profile</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                    Update the core details, branding, and visibility of your society.
                </p>
            </header>

            <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">

                {/* Visual Settings */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 shadow-sm overflow-hidden rounded-2xl">
                        <div className="h-28 bg-gradient-to-br from-rose-500/20 to-zinc-200 dark:to-zinc-900 w-full relative group cursor-pointer transition flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">Change Cover</span>
                            </div>
                        </div>
                        <CardContent className="pt-0 relative px-6 pb-6 text-center flex flex-col items-center border-t border-zinc-100 dark:border-zinc-800/50">
                            <div className="h-24 w-24 rounded-2xl border-4 border-white dark:border-zinc-950 -mt-12 mb-4 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden group cursor-pointer relative" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                {logo ? (
                                    <img src={logo} alt={society.name} className="h-full w-full object-cover" />
                                ) : (
                                    <Building2 className="h-10 w-10 text-rose-500" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold">{isUploading ? <Loader2 className="animate-spin h-4 w-4" /> : "Edit Logo"}</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-[#172b4d] dark:text-white mb-1">{society.name}</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{society.acronym}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Form Elements */}
                <div className="md:col-span-2 lg:col-span-3 space-y-6">

                    {/* General Settings */}
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm">
                        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                            <CardTitle className="text-lg font-medium text-[#172b4d] dark:text-white">Organization Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Society Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-3 text-sm text-[#172b4d] dark:text-zinc-100 outline-none resize-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        Logo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={logo}
                                        onChange={(e) => setLogo(e.target.value)}
                                        placeholder="https://example.com/logo.png"
                                        className="w-full bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        Upload Logo
                                    </label>
                                    <div className="relative">
                                        <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="w-full opacity-0 absolute inset-0 cursor-pointer z-10" />
                                        <div className="w-full bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-400 flex items-center justify-between outline-none">
                                            <span>{isUploading ? "Uploading..." : "Select file..."}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-zinc-400" /> Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4 text-zinc-400" /> Website URL
                                    </label>
                                    <input
                                        type="url"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full bg-[#f4f5f7] dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button disabled={isSaving} onClick={handleSave} className="bg-rose-500 text-white hover:bg-rose-600 font-medium px-6 shadow-sm disabled:opacity-50">
                                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20 shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-rose-600 dark:text-rose-500 mb-1">Visibility Settings</h3>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400">Control who can discover this society and request to join.</p>
                            </div>
                            <Button variant="outline" className="border-rose-300 dark:border-rose-500/50 text-rose-600 dark:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-400 h-9 shrink-0 bg-white dark:bg-transparent">
                                Status: Public
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
