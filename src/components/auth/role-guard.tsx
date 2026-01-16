'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types';
import { Loader2, ShieldCheck, Server, User, Globe, CheckCircle2 } from 'lucide-react';
import { logAccess, getClientIP } from '@/lib/audit-logger';

// Type definition for steps
type VerificationStep = 'identity' | 'role' | 'device' | 'logging' | 'complete';

export function RoleGuard({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}) {
    const { profile, loading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState<VerificationStep>('identity');
    const [ipAddress, setIpAddress] = useState<string>('Searching...');
    const [deviceInfo, setDeviceInfo] = useState<string>('Analyzing...');

    useEffect(() => {
        if (!loading && !profile) {
            router.push('/login');
        }
    }, [loading, profile, router]);

    useEffect(() => {
        if (loading || !profile) return;

        if (!allowedRoles.includes(profile.role)) {
            router.push('/'); // Or unauthorized page
            return;
        }

        // Start verification sequence
        const verify = async () => {
            // Step 1: Identity (Fast)
            await new Promise(r => setTimeout(r, 400));
            setStep('role');

            // Step 2: Device & IP (Async)
            const ip = await getClientIP();
            setIpAddress(ip);
            setDeviceInfo(navigator.userAgent.split(')')[0] + ')'); // Simple OS info
            setStep('device');
            await new Promise(r => setTimeout(r, 400));

            // Step 3: Logging
            setStep('logging');
            await logAccess({
                userId: profile.uid,
                userName: profile.displayName || 'Unknown',
                userEmail: profile.email,
                role: profile.role,
                action: 'ADMIN_ACCESS',
                status: 'success',
                ipAddress: ip,
                userAgent: navigator.userAgent
            });
            await new Promise(r => setTimeout(r, 300));

            // Step 4: Complete
            setStep('complete');
        };

        if (step === 'identity') {
            verify();
        }
    }, [loading, profile, allowedRoles, router, step]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-obsidian">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!profile || !allowedRoles.includes(profile.role)) {
        return null;
    }

    if (step !== 'complete') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-obsidian text-white p-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <ShieldCheck className="h-12 w-12 text-gold mx-auto mb-4 animate-pulse" />
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Security Check</h2>
                        <p className="text-xs text-white/50 font-mono">ESTABLISHING SECURE SESSION</p>
                    </div>

                    <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">

                        {/* Identity Step */}
                        <div className={`flex items-center gap-4 transition-opacity duration-500 ${step === 'identity' ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'identity' ? 'bg-gold animate-pulse text-obsidian' : 'bg-kenyan-green text-obsidian'}`}>
                                {step === 'identity' ? <User className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            </div>
                            <div>
                                <p className="text-xs text-white/40 font-bold uppercase">Identity</p>
                                <p className="font-mono text-sm">{profile.email}</p>
                            </div>
                        </div>

                        {/* Role Step */}
                        {(step === 'role' || step === 'device' || step === 'logging') && (
                            <div className="flex items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-300">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'role' ? 'bg-gold animate-pulse text-obsidian' : 'bg-kenyan-green text-obsidian'}`}>
                                    {step === 'role' ? <ShieldCheck className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 font-bold uppercase">Role Verification</p>
                                    <p className="font-mono text-sm uppercase text-gold">{profile.role} ACCESS CONFIRMED</p>
                                </div>
                            </div>
                        )}

                        {/* Device Step */}
                        {(step === 'device' || step === 'logging') && (
                            <div className="flex items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-300">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'device' ? 'bg-gold animate-pulse text-obsidian' : 'bg-kenyan-green text-obsidian'}`}>
                                    {step === 'device' ? <Globe className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 font-bold uppercase">Device & Network</p>
                                    <p className="font-mono text-xs truncate max-w-[200px]">{ipAddress}</p>
                                    <p className="font-mono text-[10px] text-white/50 truncate max-w-[200px]">{deviceInfo}</p>
                                </div>
                            </div>
                        )}

                        {/* Logging Step */}
                        {step === 'logging' && (
                            <div className="flex items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-300">
                                <div className="h-8 w-8 rounded-full bg-gold animate-pulse flex items-center justify-center text-obsidian">
                                    <Server className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 font-bold uppercase">Audit Trail</p>
                                    <p className="font-mono text-xs text-gold">Encrypting & Logging Session...</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
