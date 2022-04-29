import React, { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Recipie, dummyData } from "./types/recipieTypes";
import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { v4 as uuid4 } from 'uuid';

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
    setRecipies: (recipies: Map<string, Recipie>) => void;
    addRecipie: (recipie: Recipie) => void;
    editRecipie: (editedRecipie: Recipie, id: string) => void;
};

export const RecipiesContext = createContext<RecipiesContextType>({} as RecipiesContextType);

function App() {

    const [recipies, setRecipies] = useState<Map<string, Recipie>>(new Map());

    const addRecipie = (recipie: Recipie) => {
        const id = uuid4();
        setDoc(doc(db, `recipies/${id}`), recipie)
            .then(() => {
                console.log("Recipie written with ID", id);
            })
            .catch(err => {
                console.error("Recipie not added to db", err);
            });
        return id;
    };

    const editRecipie = (editedRecipie: Recipie, id: string) => {
        setDoc(doc(db, `recipies/${id}`), editedRecipie)
            .then(() => {
                console.log('Recipie edited with ID', id);
            })
            .catch(err => {
                console.error(`Recipie ${id} not edited`, err);
            });
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'recipies'),
            (querySnapshot) => {
                // TODO - dont update whole arr by using querySnapshot.docChanges()
                const recipies: Map<string, Recipie> = new Map(querySnapshot.docs.map(doc => {
                    const recipie = doc.data() as Recipie;
                    console.assert(recipie.name != undefined, `Recipie ${doc.id} pulled from DB has no name field`);
                    return [doc.id, recipie];
                }));
                console.log("Recipies snapshot:", recipies);
                setRecipies(recipies);
            },
            (error) => {
                console.error("Recipies snapshot failed:", error);
            });
        console.log('Subscribed to recipie snapshots');
        return function cleanup() {
            console.log('Unsubscribed from recipie snapshots');
            unsubscribe();
        };
    }, []);

    return (
        <RecipiesContext.Provider value={{
            "recipies": recipies,
            "setRecipies": setRecipies,
            "addRecipie": addRecipie,
            "editRecipie": editRecipie,
        }}>
            <div className="App">
                <Outlet />
            </div>
        </RecipiesContext.Provider>
    );
}

export default App;
