import { Auth } from "aws-amplify";
import { useContext, useRef } from "react";
import { UserContext } from "../App";
import SignUp from "./SignUp";

async function signIn(username: string, password: string) {
    try {
        await Auth.signIn(username, password);
        console.log(`${username} - Sign in success!`);
    } catch (error) {
        console.error('Error signing in', error);
    }
}

async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.error('Error signing out: ', error);
    }
}

function SignIn() {
    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    let user = useContext(UserContext);

    return (
        <div className="SignIn">
            {user === null &&
                <>
                    <input placeholder="username" type="text" ref={usernameInput} />
                    <input placeholder="password" type="password" ref={passwordInput} />
                    <button onClick={() => signIn(usernameInput.current!.value, passwordInput.current!.value)}>Sign In</button>
                    <br />
                    <br />
                    <SignUp />
                </>
            }
            {user !== null &&
                <button onClick={signOut}>Sign Out</button>
            }
        </div>
    );
}

export default SignIn;
