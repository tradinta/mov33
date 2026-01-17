

import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

if (getApps().length > 0) {
    app = getApp();
} else {
    app = initializeApp(firebaseConfig);
}

auth = getAuth(app);
firestore = getFirestore(app);

export { app, auth, firestore };
