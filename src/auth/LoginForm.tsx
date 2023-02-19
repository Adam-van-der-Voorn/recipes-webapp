import React, { PropsWithChildren, useState } from "react";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string } from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import FormErrorMessage from "../recipe-form/components/FormErrorMessage";
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

    return <div>
        <h1 className="text-center font-bold text-3xl mb-4 area">Log in</h1>
        <form className="inline-grid grid-cols-2 grid-rows-3 col-auto"
            onSubmit={handleSubmit(onSubmit)}
        >
            <label className="w-auto"
             htmlFor="email">Email</label>
            <input className="border-b-2 border-zinc-600"
                {...register("email")}
                type="text"
                inputMode="email"
                id="username-input"
            />
            <em className="error">{errors.email}</em>
            <label htmlFor="password">Password</label>
            <input {...register("password")} type="password" id="password-input" />
            <em className="error">{errors.password}</em>
            <FormErrorMessage error={errors.password} />
            <input type="submit" value="Log in" />
            <p>{topLevelError}</p>
        </form>
    </div>;
}

export default LoginForm;
