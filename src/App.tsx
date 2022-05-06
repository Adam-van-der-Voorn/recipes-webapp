import React, { createContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Recipie } from "./types/recipieTypes";
import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, enableIndexedDbPersistence, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
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

    const [recipies, setRecipies] = useState<Map<string, Recipie>>(new Map());
    const pendingWrites = useRef(new Map<string, (id: string, recipie: Recipie) => void>());

    const addRecipie = (recipie: Recipie, onAvalible?: (id: string, recipie: Recipie) => void) => {
        const id: string = uuid4();
        if (onAvalible) {
            pendingWrites.current.set(id + '-added', onAvalible)
        }
        return setDoc(doc(db, `recipies/${id}`), recipie)
            .then(() => {
                console.log("Recipie written to server with ID", id);
            })
    };

    const editRecipie = (editedRecipie: Recipie, id: string, onAvalible?: (id: string, recipie: Recipie) => void) => {
        if (onAvalible) {
            pendingWrites.current.set(id + '-modified', onAvalible)
        }
        return setDoc(doc(db, `recipies/${id}`), editedRecipie)
            .then(() => {
                console.log('Recipie edited on server with ID', id);
            })
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'recipies'), { includeMetadataChanges: true },
            (querySnapshot) => {
                // extract recipies
                const recipies: Map<string, Recipie> = new Map(querySnapshot.docs.map(doc => {
                    const recipie = doc.data() as Recipie;
                    console.assert(recipie.name !== undefined, `Recipie ${doc.id} pulled from DB has no name field`);
                    return [doc.id, recipie];
                }));

                // extract change data
                const changeData = querySnapshot.docChanges().map(change => {
                    const doc = change.doc;
                    return {type: change.type, data: doc.data(), id: doc.id}
                })

                // confirm data has been written
                changeData.forEach(change => {
                    const writeCallback = pendingWrites.current.get(change.id + '-' + change.type);
                    if (writeCallback) {
                        console.log("Callback on", change)
                        writeCallback(change.id, change.data as Recipie);
                    }
                });
                
                const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
                console.log(`Recipies snapshot (from ${source}):`, { recipies: recipies, changes: changeData});
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
