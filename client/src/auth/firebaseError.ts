export enum FireBaseErr {
    UNKNOWN,
    WRONG_PASSWORD,
    TOO_MANY_REQUESTS,
    EMAIL_ALREADY_IN_USE,
    USER_NOT_FOUND,
    NETWORK_REQUEST_FAILED,
    WEAK_PASSWORD,
}

const map = {
    "wrong-password": {
        key: FireBaseErr.WRONG_PASSWORD, 
        message:"Username and password do not match"
    },
    "too-many-requests": {
        key: FireBaseErr.TOO_MANY_REQUESTS, 
        message: "Too many login attempts! Your account access has been temporarily disabled, try again later or reset your password."
    },
    "email-already-in-use": {
        key: FireBaseErr.EMAIL_ALREADY_IN_USE, 
        message: "Email already in use— did you mean to sign in?",
    },
    "user-not-found": {
        key: FireBaseErr.USER_NOT_FOUND,
        message: "User for that email not found"
    },
    "network-request-failed": {
        key: FireBaseErr.NETWORK_REQUEST_FAILED,
        message: "Could not connect to network. Are you connected to the internet?"
    },
    "auth/weak-password": {
        key: FireBaseErr.WEAK_PASSWORD,
        message: "Password is too weak, must be at least 6 characters"
    }
}

export function parseFirebaseError(e: Error, fallbackMessage: string) {
    for (const [key, value] of Object.entries(map)) {
        if (e.message.includes(key)) {
            return value
        }
    }
    
    // no message is found in map
    console.error("Unhandled firebase error", e)
    // console.dir (e)
    return {
        key: FireBaseErr.UNKNOWN,
        message: fallbackMessage
    };
}