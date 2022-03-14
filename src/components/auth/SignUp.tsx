import { Auth } from "aws-amplify";
import { useRef } from "react";

async function signUp(username: string, password: string) {
    try {
        await Auth.signUp({
            username,
            password,
        });
        console.log(`${username}  - Sign up successful`);
    } catch (error) {
        console.error('error signing up:', error);
    }
}

async function confirmSignUp(username: string, password: string, code: string) {
    try {
      await Auth.confirmSignUp(username, code);
      console.log("Correct code, sign up confirmed!")

    } catch (error) {
        console.log('Error confirming sign up', error);
    }
}

function SignUp() {
    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmationCode = useRef<HTMLInputElement>(null)

    return (
        <div className="SignUp">
            <input placeholder="username" type="text" ref={usernameInput} />
            <input placeholder="password" type="password" ref={passwordInput} />
            <button onClick={() => signUp(usernameInput.current!.value, passwordInput.current!.value)}>Sign Up</button>
            <br/>
            <input placeholder="conformation code" type="text" ref={confirmationCode} />
            <button onClick={() => confirmSignUp(usernameInput.current!.value, passwordInput.current!.value, confirmationCode.current!.value)}>Confirm</button>
        </div>
    );
}

export default SignUp;
