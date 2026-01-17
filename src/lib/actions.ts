
'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import type { EventFormValues } from '@/app/organizer/events/new/page';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


import { adminAuth } from './firebase-admin';
import { sendPasswordResetEmail, sendConfirmationEmail } from './email-service';

export async function sendSignupConfirmation(email: string, name: string) {
    console.log(`[Server Action] Attempting to send signup confirmation to: ${email}`);
    try {
        await sendConfirmationEmail(email, name);
        console.log(`[Server Action] Signup confirmation sent successfully to: ${email}`);
        return { success: true };
    } catch (error) {
        console.error("[Server Action] Error sending signup confirmation:", error);
        throw new Error("Failed to send welcome email.");
    }
}

export async function getSignature(folder: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            folder: folder,
        },
        process.env.CLOUDINARY_API_SECRET as string
    );

    return { timestamp, signature };
}

export async function requestPasswordReset(email: string) {
    if (!adminAuth) {
        console.error("Firebase Admin Auth not initialized");
        throw new Error("Internal Server Error: Auth service unavailable");
    }

    try {
        // Generate the reset link
        const resetLink = await adminAuth.generatePasswordResetLink(email, {
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/login`,
        });

        // Try to get user details for the name
        let name = 'User';
        try {
            const userRecord = await adminAuth.getUserByEmail(email);
            name = userRecord.displayName || 'User';
        } catch (e) {
            // If user doesn't exist, we still return success for security
            console.log(`Password reset requested for non-existent email: ${email}`);
            return { success: true };
        }

        // Send the email via ZeptoMail
        await sendPasswordResetEmail(email, name, resetLink);

        return { success: true };
    } catch (error: any) {
        console.error("Error in requestPasswordReset:", error);
        if (error.code === 'auth/user-not-found') {
            return { success: true }; // Security best practice
        }
        throw new Error("Failed to send reset email. Please try again later.");
    }
}
