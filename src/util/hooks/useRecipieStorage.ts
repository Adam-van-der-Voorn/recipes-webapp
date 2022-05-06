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

                // extract change data
                const changeData = querySnapshot.docChanges().map(change => {
                    const doc = change.doc;
                    return { type: change.type, recipie: doc.data() as Recipie, id: doc.id };
                });
                
                const newRecipies = new Map(recipies);
                changeData.forEach(change => {
                    // confirm data has been written
                    const writeCallback = pendingWrites.current.get(change.id + '-' + change.type);
                    if (writeCallback) {
                        console.log("Callback on", change);
                        writeCallback(change.id, change.recipie);
                    }
                    
                    // add to memory
                    if (change.type === 'added' || change.type === 'modified') {
                        newRecipies.set(change.id, change.recipie);
                    }
                    else if (change.type === 'removed') {
                        newRecipies.delete(change.id);
                    }
                    else {
                        console.error('recipies snapshot: unkown change type:', change.type)
                    }
                });
                setRecipies(newRecipies);


                const source = querySnapshot.metadata.fromCache ? "local cache" : "server";
                console.log(`Recipies snapshot (from ${source}):`, { changes: changeData });
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