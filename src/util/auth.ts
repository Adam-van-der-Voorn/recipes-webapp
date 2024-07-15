import { User } from "firebase/auth";
import { UserState } from "../types/user";

export function isAuthed(userState: UserState): userState is User {
    return typeof userState === 'object';
}