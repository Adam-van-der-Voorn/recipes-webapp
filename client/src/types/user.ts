import { User } from "firebase/auth";

export type UserState = "pre-auth" | User | null