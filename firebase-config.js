// Firebase layihənizi yaratdıqdan sonra "Project Settings -> General -> Your apps -> Firebase SDK snippet -> CDN" bölməsindən
// əldə etdiyiniz məlumatları buradakı boşluqlara yapışdırın.
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Bu fayl həm ana səhifə (script.js) həm də admin panel (admin.js) tərəfindən modulyar şəkildə istifadə olunacaq.
