import * as admin from 'firebase-admin';

// Only initialize in runtime environment, not during build
const isBuildTime = process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!admin.apps.length && !isBuildTime) {
    try {
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

        if (serviceAccountBase64 && serviceAccountBase64.length > 0) {
            try {
                const decoded = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
                const serviceAccount = JSON.parse(decoded);

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                console.log('[Firebase Admin] Initialized successfully');
            } catch (innerError) {
                // Silently skip - this is expected during build
                console.warn('[Firebase Admin] Skipping initialization - invalid config');
            }
        }
    } catch (error) {
        // Silently skip during build
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminFirestore = admin.apps.length ? admin.firestore() : null;
