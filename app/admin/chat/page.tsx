"use client";

import { MessageCircle, ExternalLink, Construction, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMockData } from "@/app/context/MockDataContext";

export default function AdminChatPage() {
    // Pull the WhatsApp link from the first active society in context
    const { societies } = useMockData();
    const activeSociety = societies.find(s => s.status === "Active");
    const whatsappLink = activeSociety?.whatsapp || "https://web.whatsapp.com";

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[#f4f5f7] dark:bg-zinc-950 relative overflow-hidden">

            {/* Background decorative blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center relative z-10">

                {/* Icon block */}
                <div className="relative">
                    <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-rose-100 to-violet-100 dark:from-rose-500/10 dark:to-violet-500/10 border border-rose-200/50 dark:border-rose-500/20 flex items-center justify-center shadow-xl shadow-rose-500/10">
                        <MessageCircle className="h-14 w-14 text-rose-500" strokeWidth={1.5} />
                    </div>
                    {/* Badge */}
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-md">
                        <Wrench className="h-4 w-4 text-white" />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        <Construction className="h-3.5 w-3.5" />
                        Under Construction
                    </div>
                    <h1 className="text-3xl font-bold text-[#172b4d] dark:text-white">In-App Chat</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-sm mx-auto">
                        A built-in real-time messaging experience is on its way.
                        <br />
                        For now, connect with your team through the society's WhatsApp group.
                    </p>
                </div>

                {/* Feature hints */}
                <div className="w-full grid grid-cols-3 gap-3 text-center">
                    {[
                        { label: "Group Chats", icon: "💬" },
                        { label: "Announcements", icon: "📣" },
                        { label: "File Sharing", icon: "📎" },
                    ].map(f => (
                        <div key={f.label} className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 opacity-50">
                            <p className="text-2xl mb-1">{f.icon}</p>
                            <p className="text-[11px] text-zinc-500 font-medium">{f.label}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <Button
                    className="bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl px-8 py-5 text-base shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all font-semibold"
                    onClick={() => window.open(whatsappLink, '_blank')}
                >
                    <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Open Society WhatsApp
                    <ExternalLink className="ml-2.5 h-4 w-4 opacity-80" />
                </Button>

                <p className="text-xs text-zinc-400 dark:text-zinc-600">
                    {activeSociety ? `Linking to: ${activeSociety.name}` : "No active society found"}
                </p>
            </div>
        </div>
    );
}
