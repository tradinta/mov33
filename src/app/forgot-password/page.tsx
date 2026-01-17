
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '@/lib/actions';

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await requestPasswordReset(email);
            if (result.success) {
                setIsSuccess(true);
            }
        } catch (err: any) {
            console.error("Forgot password error:", err);
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 bg-obsidian text-white">
            <div className="hidden bg-muted lg:block relative overflow-hidden bg-gold/10">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent opacity-50" />
                <div className="absolute bottom-8 left-8 right-8 p-4 bg-black/50 rounded-lg backdrop-blur-sm z-10">
                    <h3 className="text-white text-2xl font-bold font-headline uppercase tracking-tighter">
                        Secure Your Account
                    </h3>
                    <p className="text-white/80 mt-2 font-poppins text-sm leading-relaxed">
                        Kenya's most premium platform for events and experiences keeps your data protected.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center py-12 px-4">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="grid gap-2 text-center">
                        <Link href="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-4 w-fit mx-auto">
                            <ArrowLeft className="h-4 w-4" /> Back to Login
                        </Link>
                        <Logo className="mx-auto scale-125 mb-4" />
                        <h1 className="text-3xl font-black font-headline uppercase tracking-tighter mt-2">
                            Forgot Password?
                        </h1>
                        <p className="text-muted-foreground font-poppins text-sm">
                            Enter your registered email and we'll send you a link to reset your password.
                        </p>

                        {error && (
                            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-red-500 leading-tight text-left">
                                    {error}
                                </p>
                            </div>
                        )}

                        {isSuccess && (
                            <div className="mt-4 p-6 rounded-2xl bg-kenyan-green/10 border border-kenyan-green/20 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                                <CheckCircle2 className="h-12 w-12 text-kenyan-green" />
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-white mb-2">Check Your Inbox</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        If an account exists for <span className="text-gold font-bold">{email}</span>, you will receive a password reset link shortly.
                                    </p>
                                </div>
                                <Button variant="outline" asChild className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest text-xs mt-2">
                                    <Link href="/login">Return to Login</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {!isSuccess && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-white/60 font-bold uppercase tracking-widest text-[10px] ml-1">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    disabled={isLoading}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-gold/50 focus:border-gold/50 transition-all"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gold hover:bg-gold/90 text-obsidian font-black uppercase tracking-widest text-xs h-12 rounded-xl shadow-lg shadow-gold/10"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    )}

                    <div className="text-center text-xs text-muted-foreground font-poppins mt-4 italic">
                        Need help? Contact <a href="mailto:support@mov33.com" className="text-gold underline">support@mov33.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
