import React, { PropsWithChildren, useState } from "react";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string } from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { parseFirebaseError } from "./firebaseError";
import style from './style.module.css';

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

    return <div className={style.container}>
        {/* <h1 className={style.title}>Log in</h1> */}
        <form onSubmit={handleSubmit(onSubmit)} className={style['form']}>
            <div className={style.inputContainer}>
                <label htmlFor="email" className={style['label']}>Email</label>
                <input {...register("email")}
                    type="text"
                    className={style['input']}
                    inputMode="email"
                    id="username-input"
                />
            </div>
            <div className={style.inputContainer}>
                <label htmlFor="password" className={style['label']}>Password</label>
                <input {...register("password")} type="password" className={style['input']} id="password-input" />
            </div>
            <input className={style.submit} type="submit" value="Log in" />
            <div className={style.errorContainer}>
                <em className={style.error}>{topLevelError}</em>
                <em className={style.error}>{errors.email?.message || ""}</em>
                <em className={style.error}>{errors.password?.message || ""}</em>
            </div>
        </form>
    </div>;
}

export default LoginForm;
