import React, { PropsWithChildren, useState } from "react";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
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
        .min(8, "Must be at least 8 characters long")
        .required("Password is required")
})

type SignUpInput = {
    email: string,
    password: string,
}

type Props = {
    auth: Auth;
};

function SignUpForm({ auth }: PropsWithChildren<Props>) {

    const formHelper = useForm<SignUpInput>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: '', password: ''}
    });

    const { register, handleSubmit, formState: { errors } } = formHelper;
    const [topLevelError, setTopLevelError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<SignUpInput> = data => {
        // on success, auth state will change
        setTopLevelError(undefined)
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .catch(e => {
                const defaultMessage = "Something went wrong when trying to sign you up. Please try again later.";
                setTopLevelError(parseFirebaseError(e, defaultMessage).message)
            })
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign up</h1>
        <label htmlFor="email">Email</label>
        <input {...register("email")} type="text" inputMode="email" id="username-input" />
        <FormErrorMessage error={errors.email} />
        <br />
        <label htmlFor="password">Password</label>
        <input {...register("password")} type="password" id="password-input" />
        <FormErrorMessage error={errors.password} />
        <input type="submit" value="Sign up" />
        <p>{topLevelError}</p>
    </form>;
}

export default SignUpForm;
