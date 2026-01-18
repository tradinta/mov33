'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Facebook, Linkedin, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";

export function ShareModal() {
    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-white hover:bg-white/10">
                    <Share2 className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-obsidian border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Share this Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2 border-white/10 hover:bg-white/5" onClick={handleCopyLink}>
                            <Copy className="h-4 w-4" /> Copy Link
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 border-white/10 hover:bg-blue-600 hover:text-white hover:border-blue-600" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, '_blank')}>
                            <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 border-white/10 hover:bg-blue-700 hover:text-white hover:border-blue-700" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}>
                            <Facebook className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
