import { Hub, Auth } from "aws-amplify";
import { useEffect, useState } from "react";

function useCheckUserStatus() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signIn":
                    setUser(data);
                    break;
                case "signOut":
                    setUser(null);
                    break;
            }
        });
        Auth.currentAuthenticatedUser()
            .then(currentUser => {
                setUser(currentUser)
                console.log('User is', currentUser)
            })
            .catch(() => console.log("Not signed in"));

        return unsubscribe;
    }, []);

    return user;
}

export default useCheckUserStatus;