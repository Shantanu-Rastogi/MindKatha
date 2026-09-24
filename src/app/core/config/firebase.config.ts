/**
 * MindKatha Clinical Practice — Leona's Firebase Web SDK Configuration
 * Project: mindkatha-f3ba9 (psychotherapy.leona@gmail.com)
 */

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

export const LEONA_FIREBASE_CONFIG: FirebaseWebConfig = {
  apiKey: 'AIzaSyAOOJs6_cLgFRgcni4QjX1xvlK__nZFOSQ',
  authDomain: 'mindkatha-f3ba9.firebaseapp.com',
  projectId: 'mindkatha-f3ba9',
  storageBucket: 'mindkatha-f3ba9.firebasestorage.app',
  messagingSenderId: '25949808346',
  appId: '1:25949808346:web:3e390da9ed2ec4ff0327e3',
  measurementId: 'G-PT0JBJP6NN'
};

/**
 * Returns true once Leona's Firebase project keys have been configured.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    LEONA_FIREBASE_CONFIG.apiKey &&
    LEONA_FIREBASE_CONFIG.authDomain &&
    LEONA_FIREBASE_CONFIG.projectId &&
    LEONA_FIREBASE_CONFIG.appId
  );
}
