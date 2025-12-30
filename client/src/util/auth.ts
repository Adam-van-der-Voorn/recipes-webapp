import { User } from "firebase/auth";
import { UserState } from "../types/user.ts";

export function isAuthed(userState: UserState): userState is User {
  return typeof userState === "object";
}
