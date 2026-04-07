// Firebase konfiqurasiyası
// Bu fayl həm ana səhifə (script.js) həm də admin panel (admin.js) tərəfindən modulyar şəkildə istifadə olunur.
export const firebaseConfig = {
    apiKey: "AIzaSyBD32XQPsw9OfHcxb7kLGpTAxRWHQWuugA",
    authDomain: "restoranmenyu.firebaseapp.com",
    projectId: "restoranmenyu",
    storageBucket: "restoranmenyu.firebasestorage.app",
    messagingSenderId: "966308677613",
    appId: "1:966308677613:web:84008dd34018caedd689e4",
    measurementId: "G-RFLSKE10XG"
};

// Cloudinary konfiqurasiyası
// Şəkillər birbaşa Cloudinary-yə yüklənir (Firebase Storage əvəzinə, bank kartı tələb etmir).
export const cloudinaryConfig = {
    cloudName: "dkdphyr6l",
    uploadPreset: "restoran_menyu"
};
