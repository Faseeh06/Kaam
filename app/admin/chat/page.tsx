"use client";

import Image from "next/image";
import { MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminChatPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[#f4f5f7] dark:bg-zinc-950">
            <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center">

                {/* Image / GIF */}
                <img
                    src="/gif/1.png"
                    alt="Chat unavailable"
                    className="w-80 md:w-96 h-auto drop-shadow-2xl animate-in zoom-in duration-500"
                />

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-[#172b4d] dark:text-white flex items-center justify-center gap-2">
                        <MessageCircle className="h-8 w-8 text-rose-500" />
                        In-App Chat
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                        Use WhatsApp for that.
                    </p>
                </div>

                <Button
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all font-medium"
                    onClick={() => window.open('https://web.whatsapp.com', '_blank')}
                >
                    Open WhatsApp <ExternalLink className="ml-2 h-5 w-5" />
                </Button>

            </div>
        </div>
    );
}
