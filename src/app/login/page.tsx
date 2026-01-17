'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Chrome, AlertCircle, Loader2, Lock } from 'lucide-react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from '@/firebase';
import React from 'react';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [lockoutTimer, setLockoutTimer] = React.useState(0);

  const router = useRouter();
  const auth = getAuth(app);

  // Lockout timer effect
  React.useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setTimeout(() => setLockoutTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTimer]);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return "Login failed. Please check your credentials and try again.";
      case 'auth/too-many-requests':
        return "Account temporarily disabled due to too many failed attempts. Please try again later.";
      case 'auth/invalid-email':
        return "Please enter a valid email address.";
      case 'auth/user-disabled':
        return "This account has been disabled. Please contact support.";
      default:
        return "Something went wrong. Please try again or check your connection.";
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/profile');
    } catch (err: any) {
      console.error("Login error:", err.code, err.message);

      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 5) {
        setLockoutTimer(30);
        setFailedAttempts(0);
        setError("Too many failed attempts. Access locked for 30 seconds.");
      } else {
        setError(getFriendlyErrorMessage(err.code));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/profile');
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative overflow-hidden">
        <div className="absolute bottom-8 left-8 right-8 p-4 bg-black/50 rounded-lg backdrop-blur-sm z-10">
          <h3 className="text-white text-2xl font-bold font-headline">
            Your next unforgettable experience is just a login away.
          </h3>
          <p className="text-white/80 mt-2">
            Discover, book, and manage tickets for the best live events in
            Kenya.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="mx-auto" />
            <h1 className="text-3xl font-bold font-headline mt-4">
              Welcome Back
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-500 leading-tight text-left">
                  {error}
                </p>
              </div>
            )}

            {lockoutTimer > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                <Lock className="h-5 w-5 text-orange-500 shrink-0" />
                <p className="text-sm font-black uppercase tracking-widest text-orange-500">
                  Locked: {lockoutTimer}s
                </p>
              </div>
            )}
          </div>
          <form onSubmit={handleSignIn}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-obsidian font-black uppercase tracking-widest text-xs h-12 rounded-xl" disabled={isLoading || lockoutTimer > 0}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : lockoutTimer > 0 ? (
                  'Access Locked'
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>
          <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            {isLoading ? 'Processing...' : 'Login with Google'}
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
