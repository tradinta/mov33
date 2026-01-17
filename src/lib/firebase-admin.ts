import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        console.log('[Firebase Admin] Initializing...');
        console.log('[Firebase Admin] Available Env Keys:', Object.keys(process.env).filter(k => k.includes('FIREBASE') || k.includes('NEXT_PUBLIC')));

        if (serviceAccountBase64) {
            console.log(`[Firebase Admin] Base64 string found. Length: ${serviceAccountBase64.length}`);

            try {
                const decoded = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
                const serviceAccount = JSON.parse(decoded);

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                console.log('[Firebase Admin] Initialized successfully');
            } catch (innerError) {
                console.error('[Firebase Admin] Failed to parse or initialize with service account:', innerError);
            }
        } else {
            console.warn('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_BASE64 is missing from process.env');
        }
    } catch (error) {
        console.error('[Firebase Admin] Fatal initialization error:', error);
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminFirestore = admin.apps.length ? admin.firestore() : null;
