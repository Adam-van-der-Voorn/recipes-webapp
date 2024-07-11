import React, { PropsWithChildren, useState } from "react";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string } from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { parseFirebaseError } from "./firebaseError";


const schema = object().shape({
    email: string()
        .email("Must be a valid email")
        .required("Email is required"),
    password: string()
        .required("Password is required")
});

type LoginInput = {
    email: string,
    password: string,
};

type Props = {
    auth: Auth;
};

function LoginForm({ auth }: PropsWithChildren<Props>) {

    const formHelper = useForm<LoginInput>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: '', password: '' }
    });

    const { register, handleSubmit, formState: { errors } } = formHelper;
    const [topLevelError, setTopLevelError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<LoginInput> = data => {
        // on success, auth state will change
        setTopLevelError(undefined);
        return signInWithEmailAndPassword(auth, data.email, data.password)
            .catch(e => {
                const defaultMessage = "Something went wrong when trying to log you in. Please try again later.";
                setTopLevelError(parseFirebaseError(e, defaultMessage).message);
            });
    };

    return <div className="container">
        {/* <h1 className="title">Log in</h1> */}
        <form onSubmit={handleSubmit(onSubmit)} className={"form"}>
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
            <input className="submit" type="submit" value="Log in" />
            <div className="errorContainer">
                <em className="error">{topLevelError}</em>
                <em className="error">{errors.email?.message || ""}</em>
                <em className="error">{errors.password?.message || ""}</em>
            </div>
        </form>
    </div>;
}

export default LoginForm;
