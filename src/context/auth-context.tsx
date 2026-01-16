'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '@/firebase';
import { UserProfile, UserRole } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isModerator: boolean;
    isOrganizer: boolean;
    isInfluencer: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    isAdmin: false,
    isSuperAdmin: false,
    isModerator: false,
    isOrganizer: false,
    isInfluencer: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                // Fetch profile from Firestore
                const docRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile);
                } else {
                    // Default profile if not found
                    setProfile({
                        uid: user.uid,
                        email: user.email || '',
                        role: 'user',
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    });
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        profile,
        loading,
        isAdmin: profile?.role === 'admin' || profile?.role === 'super-admin',
        isSuperAdmin: profile?.role === 'super-admin',
        isModerator: profile?.role === 'moderator',
        isOrganizer: profile?.role === 'organizer',
        isInfluencer: profile?.role === 'influencer',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
