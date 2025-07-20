import { useState } from "react";
import LoginForm, { LoginInput } from "./LoginForm.tsx";
import { Auth } from "firebase/auth";
import SignUpForm, { SignUpInput } from "./SignUpForm.tsx";

type Props = {
    auth: Auth;
};

export default function AuthForm({ auth }: Props) {
    const [isLogIn, setIsLogIn] = useState(false);
    const [initialValues, setInitalValues] = useState({ email: '', password: '' });

    const switchToSignUp = (loginFormState: LoginInput) => {
        setInitalValues({
            email: loginFormState.email,
            password: loginFormState.password
        })
        setIsLogIn(false)
    }

    const switchToLogIn = (signupFormState: SignUpInput) => {
        setInitalValues({
            email: signupFormState.email,
            password: signupFormState.password
        })
        setIsLogIn(true)
    }

    if (isLogIn) {
        return <main className="authFormContainer">
            <LoginForm auth={auth}
                switchToSignUp={switchToSignUp}
                initEmail={initialValues.email}
                initPassword={initialValues.password}
            />
        </main>;
    }
    else {
        return <main className="authFormContainer">
            <SignUpForm auth={auth}
                switchToLogIn={switchToLogIn}
                initEmail={initialValues.email}
                initPassword={initialValues.password}
            />
        </main>;
    }
}