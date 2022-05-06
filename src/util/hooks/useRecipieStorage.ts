import { setDoc, doc, onSnapshot, collection, Firestore, deleteDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { Recipie } from "../../types/recipieTypes";
import { v4 as uuid4 } from 'uuid';

export default function useRecipieStorage(db: Firestore) {
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

    const deleteRecipie = (id: string, onAvalible?: (id: string, recipie: Recipie) => void) => {
        if (onAvalible) {
            pendingWrites.current.set(id + '-removed', onAvalible)
        }
        return deleteDoc(doc(db, `recipies/${id}`))
            .then(() => {
                console.log('Recipie deleted on server with ID', id);
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
    }, [db]);

    return {
        "recipies": recipies,
        "addRecipie": addRecipie,
        "editRecipie": editRecipie,
        "deleteRecipie": deleteRecipie
    }
}