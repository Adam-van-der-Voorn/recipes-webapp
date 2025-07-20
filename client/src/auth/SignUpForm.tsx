import { PropsWithChildren, useState } from "react";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import FormErrorMessage from "../recipe-form/components/FormErrorMessage.tsx";
import { parseFirebaseError } from "./firebaseError.ts";

export type SignUpInput = {
    email: string,
    password: string,
};

type Props = {
    auth: Auth;
    switchToLogIn: (formState: SignUpInput) => void
    initEmail?: string,
    initPassword?: string,
};

function SignUpForm({ auth, switchToLogIn, initEmail, initPassword }: PropsWithChildren<Props>) {

    const formHelper = useForm<SignUpInput>({
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: initEmail, password: initPassword}
    });

    const { register, handleSubmit, formState: { errors }, getValues} = formHelper;
    const [topLevelError, setTopLevelError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<SignUpInput> = data => {
        // on success, auth state will change
        setTopLevelError(undefined);
        return createUserWithEmailAndPassword(auth, data.email, data.password)
            .catch(e => {
                const defaultMessage = "Something went wrong when trying to sign you up. Please try again later.";
                const message = parseFirebaseError(e, defaultMessage).message;
                setTopLevelError(message);
            });
    };

    const hasErrors =  (errors.email || errors.password || topLevelError)
    
    const emailValidation = {
        required: { value: true, message: "Email is required"},
        pattern: { value: /.+@.+/, message: "Email is invalid" }
    };

    const passwordValidation = {
        required: { value: true, message: "Password is required"},
    };

    return <>
        <h1 className="authFormTitle">Create an account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="authForm">
            <div className="inputContainer">
                <label htmlFor="email" className={"label"}>Email</label>
                <input {...register("email", emailValidation)}
                    type="text"
                    inputMode="email"
                    id="username-input"
                />
            </div>
            <div className="inputContainer">
                <label htmlFor="password" className={"label"}>Password</label>
                <input {...register("password", passwordValidation)} type="password" id="password-input" />
            </div>
            {hasErrors && <div className="authFormErrorContainer">
                <FormErrorMessage className="authFormError" error={topLevelError} />
                <FormErrorMessage className="authFormError" error={errors.email} />
                <FormErrorMessage className="authFormError" error={errors.password} />
            </div>}
            <div className="authFormFooter">
                <button className="switchLogInSignUp" onClick={() => switchToLogIn(getValues())}>I have an account</button>
                <input type="submit" value="Create" />
            </div>
        </form>
    </>;
}

export default SignUpForm;
