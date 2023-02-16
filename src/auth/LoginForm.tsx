import React, { PropsWithChildren, useState } from "react";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string } from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import FormErrorMessage from "../recipe-form/components/FormErrorMessage";
import { parseFirebaseError } from "./firebaseError";

const schema = object().shape({
    email: string()
        .email("Must be a valid email")
        .required("Email is required"),
    password: string()
        .required("Password is required")
})

type LoginInput = {
    email: string,
    password: string,
}

type Props = {
    auth: Auth;
};

function LoginForm({ auth }: PropsWithChildren<Props>) {

    const formHelper = useForm<LoginInput>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: '', password: ''}
    });

    const { register, handleSubmit, formState: { errors } } = formHelper;
    const [topLevelError, setTopLevelError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<LoginInput> = data => {
        // on success, auth state will change
        setTopLevelError(undefined)
        return signInWithEmailAndPassword(auth, data.email, data.password)
            .catch(e => {
                const defaultMessage = "Something went wrong when trying to log you in. Please try again later."
                setTopLevelError(parseFirebaseError(e, defaultMessage).message)
            })
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Log in</h1>
        <label htmlFor="email">Email</label>
        <input {...register("email")} type="text" inputMode="email" id="username-input" />
        <FormErrorMessage error={errors.email} />
        <br />
        <label htmlFor="password">Password</label>
        <input {...register("password")} type="password" id="password-input" />
        <FormErrorMessage error={errors.password} />
        <input type="submit" value="Log in" />
        <p>{topLevelError}</p>
    </form>;
}

export default LoginForm;
