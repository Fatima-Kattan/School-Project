// src/lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

let messaging: any = null;
if (typeof window !== 'undefined') {
    messaging = getMessaging(app);
}

export const getFCMToken = async (): Promise<string | null> => {
    try {
        if (typeof window === 'undefined' || !messaging) {
            console.warn('⚠️ FCM not available');
            return null;
        }

        // ✅ تأكد من تسجيل Service Worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('✅ Service Worker registered:', registration);
            } catch (swError) {
                console.error('❌ Service Worker registration failed:', swError);
                // نستمر مع ذلك، قد ينجح لاحقاً
            }
        }

        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            
            console.log('✅ FCM Token generated:', token);
            return token;
        }
        
        console.warn('⚠️ Notification permission denied');
        return null;
    } catch (error) {
        console.error('❌ Error getting FCM Token:', error);
        return null;
    }
};

export { messaging };