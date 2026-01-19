"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase";

export interface PlatformSettings {
    // General
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    whatsappNumber: string;
    address: string;

    // Socials
    socials: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        tiktok: string;
        youtube: string;
    };

    // Features
    features: {
        newUserRegistration: boolean;
        emailNotifications: boolean;
        organizerAutoApproval: boolean;
        blog: boolean;
        shop: boolean;
        tours: boolean;
        maintenanceMode: boolean;
    };

    // Business
    platformFee: number;
    maxTicketsPerUser: number;
    pointsPerKsh: number;
    currency: string;

    // SEO & Legal
    metaTitleSuffix: string;
    privacyUrl: string;
    termsUrl: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
    platformName: "Mov33",
    supportEmail: "support@mov33.com",
    supportPhone: "+254 700 000000",
    whatsappNumber: "+254 700 000000",
    address: "Nairobi, Kenya",
    socials: {
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        tiktok: "https://tiktok.com",
        youtube: "https://youtube.com",
    },
    features: {
        newUserRegistration: true,
        emailNotifications: true,
        organizerAutoApproval: false,
        blog: true,
        shop: true,
        tours: true,
        maintenanceMode: false,
    },
    platformFee: 5,
    maxTicketsPerUser: 10,
    pointsPerKsh: 1,
    currency: "KES",
    metaTitleSuffix: "| Mov33",
    privacyUrl: "/privacy",
    termsUrl: "/terms",
};

interface SettingsContextType {
    settings: PlatformSettings;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: DEFAULT_SETTINGS,
    loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(firestore, "platform_settings", "global");

        // Real-time listener
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                // Deep merge logic could be added here if needed, but simplistic spread works for top-level
                // For nested objects like 'socials', we want to ensure we don't lose keys if the DB doc is partial.
                const data = doc.data();
                setSettings(prev => ({
                    ...prev,
                    ...data,
                    socials: { ...prev.socials, ...data.socials },
                    features: { ...prev.features, ...data.features },
                } as PlatformSettings));
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching settings:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
