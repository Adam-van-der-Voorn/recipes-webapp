import React, { createContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Recipie } from "./types/recipieTypes";
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, enableIndexedDbPersistence, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import useRecipieStorage from "./util/hooks/useRecipieStorage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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

const del = (collectionName: string, docName: string) => {
    deleteDoc(doc(db, collectionName, docName))
        .then(() => {
            console.log("deleted from DB");
        })
        .catch(err => {
            console.error('del error', err);
        });
};

type RecipiesContextType = {
    recipies: Map<string, Recipie>;
    addRecipie: (recipie: Recipie, onAvalible?: (id: string, recipie: Recipie) => void) => void;
    editRecipie: (editedRecipie: Recipie, id: string, onAvalible?: (id: string, recipie: Recipie) => void) => void;
};

export const RecipiesContext = createContext<RecipiesContextType>({} as RecipiesContextType);

function App() {

    const recipieStorageInterface: RecipiesContextType = useRecipieStorage(db); 

    return (
        <RecipiesContext.Provider value={recipieStorageInterface}>
            <div className="App">
                <Outlet />
            </div>
        </RecipiesContext.Provider>
    );
}

export default App;
