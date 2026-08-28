// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// ✅ ضع نفس الإعدادات هنا
firebase.initializeApp({
    apiKey: "AIzaSyBc0o7CZuyR-WfVf5BJJckG8YMxrgX2s78",
    authDomain: "school-r26rf.firebaseapp.com",
    databaseURL: "https://school-r26rf-default-rtdb.firebaseio.com",
    projectId: "school-r26rf",
    storageBucket: "school-r26rf.firebasestorage.app",
    messagingSenderId: "222056026971",
    appId: "1:222056026971:web:ffc345cb4f7b1001dfc07e",
    measurementId: "G-97B7P65Z9B"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('📨 Background message:', payload);
    const notificationTitle = payload.notification?.title || 'إشعار جديد';
    const notificationOptions = {
        body: payload.notification?.body || 'لديك إشعار جديد',
        icon: '/favicon.ico',
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});