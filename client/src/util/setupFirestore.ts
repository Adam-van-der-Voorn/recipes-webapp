import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

export default function setupFirebase() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        // https://firebase.google.com/docs/projects/api-keys
        // Firebase-related APIs use API keys only to identify the Firebase project or app,
        // not for authorization to call the API (like some other APIs allow).
        apiKey: "AIzaSyBZaU6DaCaZHqeHFuQwg8enna3LkEkJNu8",
        authDomain: "recipiesapp-85118.firebaseapp.com",
        projectId: "recipiesapp-85118",
        storageBucket: "recipiesapp-85118.appspot.com",
        messagingSenderId: "192864545623",
        appId: "1:192864545623:web:8178b8ffa7b2b8b43d6c12",
        measurementId: "G-822KJ4KS41"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.error("FireStore IndexedDB - failed precondition: Multiple tabs open, persistence can only be enabled in one tab at a a time.");
        }
        else if (err.code === 'unimplemented') {
            console.error("FireStore IndexedDB: The current browser does not support all of the features required to enable persistence");
        }
    });
    const auth = getAuth()
    return { firebaseApp: app, db, auth };
}