import { User } from "firebase/auth";

export async function addFromUrl(fbUser: User, url: string) {
    const token = await fbUser.getIdToken(/* forceRefresh */ true);
    const body = JSON.stringify({ url });
    const res = await fetch("/api/add-from-url", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${token}`
        },
        body
    });
    if (!res.ok) {
        const j = await res.json();
        throw new Error(j)
    }
}