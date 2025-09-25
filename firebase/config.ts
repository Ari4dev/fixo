import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi ini diambil dari Firebase Console Anda.
// Semua nilai yang diperlukan untuk koneksi sudah lengkap.
const firebaseConfig = {
  apiKey: "AIzaSyDesKgGLkbapOIdQnFMFit9GgGTsqxK-OA",
  authDomain: "fixora-b4c31.firebaseapp.com",
  projectId: "fixora-b4c31",
  storageBucket: "fixora-b4c31.firebasestorage.app",
  messagingSenderId: "549103553853",
  appId: "1:549103553853:web:2cb726820ddbdb7f3f4954",
  measurementId: "G-QQ940108N2"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor instance layanan Firebase
export const db = getFirestore(app);
export const storage = getStorage(app);