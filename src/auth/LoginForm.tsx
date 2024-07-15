import { PropsWithChildren, useState } from "react";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string } from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { parseFirebaseError } from "./firebaseError";
import FormErrorMessage from "../recipe-form/components/FormErrorMessage";


const schema = object().shape({
    email: string()
        .email("Must be a valid email")
        .required("Email is required"),
    password: string()
        .required("Password is required")
});

export type LoginInput = {
    email: string,
    password: string,
};

type Props = {
    auth: Auth;
    switchToSignUp: (formState: LoginInput) => void
    initEmail?: string,
    initPassword?: string,
};

function LoginForm({ auth, switchToSignUp, initEmail, initPassword }: PropsWithChildren<Props>) {

    const formHelper = useForm<LoginInput>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: initEmail ?? '', password: initPassword ?? '' }
    });

    const { register, handleSubmit, formState: { errors }, getValues } = formHelper;
    const [topLevelError, setTopLevelError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<LoginInput> = data => {
        // on success, auth state will change
        setTopLevelError(undefined);
        return signInWithEmailAndPassword(auth, data.email, data.password)
            .catch(e => {
                const defaultMessage = "Something went wrong when trying to log you in. Please try again later.";
                const message = parseFirebaseError(e, defaultMessage).message;
                setTopLevelError(message);
            });
    };

    return <>
        <h1 className="authFormTitle">Log in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="authForm">
            <div className="inputContainer">
                <label htmlFor="email" className={"label"}>Email</label>
                <input {...register("email")}
                    type="text"
                    className={"input"}
                    inputMode="email"
                    id="username-input"
                />
            </div>
            <div className="inputContainer">
                <label htmlFor="password" className={"label"}>Password</label>
                <input {...register("password")} type="password" className={"input"} id="password-input" />
            </div>
            <div className="authFormFooter">
                <input type="submit" value="Log in" />
                <button className="switchLogInSignUp" onClick={() => switchToSignUp(getValues())}>Sign up instead</button>
            </div>
        </form>
        <div className="authFormErrorContainer">
            <FormErrorMessage className="authFormError" error={topLevelError} />
            <FormErrorMessage className="authFormError" error={errors.email} />
            <FormErrorMessage className="authFormError" error={errors.password} />
        </div>
    </>;
}

export default LoginForm;
