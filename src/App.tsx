import React, { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Recipie, dummyData } from "./types/recipieTypes";
import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot } from "firebase/firestore";

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

const add = (collectionName: string, data: string) => {
    addDoc(collection(db, collectionName), { data: data })
        .then(docRef => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(err => {
            console.error("not saved to db", err);
        });
};

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
    recipies: Recipie[];
    setRecipies: (recipies: Recipie[]) => void;
    addRecipie: (recipie: Recipie) => void;
    editRecipie: (editedRecipie: Recipie, originalName?: string) => void;
};

export const RecipiesContext = createContext<RecipiesContextType>({} as RecipiesContextType);

function App() {

    const [recipies, setRecipies] = useState<Recipie[]>(dummyData);
    const [beans, setBeans] = useState({});

    const addRecipie = (recipie: Recipie) => {
        setRecipies(old => [...old, recipie]);
    };

    const editRecipie = (editedRecipie: Recipie, originalName?: string) => {
        if (originalName === undefined) {
            originalName = editedRecipie.name;
        }
        const without = recipies.filter(r => r.name !== originalName);
        setRecipies([...without, editedRecipie]);
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "beans"),
            (querySnapshot) => {
                // TODO - dont update whole arr using querySnapshot.docChanges()
                const beans = querySnapshot.docs.map(doc => [doc.id, doc.data().data]);
                console.log("new beans snapshot:", beans);
                setBeans(beans);
            },
            (error) => {
                console.error("snapshot failed:", error);
            });
        return function cleanup() {
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
                <form style={{ border: "red dotted 1px" }}
                    onSubmit={event => {
                        event.preventDefault();
                        const { collection, data } = event.currentTarget;
                        add(collection.value, data.value);
                    }}>
                    <label htmlFor="collection">Collection name</label>
                    <input type="text" name="collection" />
                    <label htmlFor="data">Data</label>
                    <input type="text" name="data" />
                    <button type="submit">Save to DB</button>
                </form>
                <form style={{ border: "blue dotted 1px" }}
                    onSubmit={event => {
                        event.preventDefault();
                        const { collection, doc } = event.currentTarget;
                        del(collection.value, doc.value);
                    }}>
                    <label htmlFor="collection">Collection name</label>
                    <input type="text" name="collection" />
                    <label htmlFor="doc">Doc Name</label>
                    <input type="text" name="doc" />
                    <button type="submit">Delete</button>
                </form>
                <pre>{JSON.stringify(beans, null, 2)}</pre>
                <Outlet />
            </div>
        </RecipiesContext.Provider>
    );
}

export default App;
