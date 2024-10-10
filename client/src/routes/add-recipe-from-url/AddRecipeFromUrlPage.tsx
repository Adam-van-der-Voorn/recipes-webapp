import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import AuthGate from "../../auth/AuthGate";
import { addFromUrl } from "../../api/externalRecipe";
import { User } from "firebase/auth";
import Loading from "../../general/placeholders/Loading";
import AuthForm from "../../auth/AuthForm";

const headerStyle: React.CSSProperties = {
    gridTemplateColumns: 'auto 1fr',
};

function AddRecipeFromUrlPage() {
    const { user, auth } = useContext(GlobalContext);

    if (user === "pre-auth") {
        return <Loading message="Finding user ..." />;;
    }
    else if (user) {
        return <MainContent user={user} />
    }
    else {
        return <AuthForm auth={auth} />;
    }
}

type Props2 = {
    user: User
}

function MainContent({ user }: Props2) {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmit = (ev: any) => {
        ev.preventDefault()
        const val = inputRef?.current?.value;
        if (typeof val == 'string') {
            addFromUrl(user, val)
                .then(() => {
                    navigate("/")
                })
                .catch(e => {
                    console.error("add recipe failed:", e)
                    alert("add recipe failed")
                })
        }
    };

    const onPaste = (ev: any) => {
        const text = ev.target.value;
        try {
            const _ = new URL(text);
            // valid url pasted, go on
            if (formRef.current) {
                formRef.current.request()
            }
        }
        catch (e) {
            // not a url? that's all good.
        }
    }

    return <div className="page">
        <header style={headerStyle}>
            <Link to="/" className="headerLink">Home</Link>
            <h1 className="headerTitle">New Recipe from URL</h1>
        </header>
        <main className="recipeFormBody">
            <form onSubmit={onSubmit} ref={formRef}>
            <label htmlFor="add-from-url">URL: </label>
            <input type="text" name="add-from-url"
                id="add-from-url"
                onPaste={onPaste}
                ref={inputRef}
                autoFocus
            />
            <input type="submit" value="Add" />
            </form>
        </main>
    </div>;
}

export default AddRecipeFromUrlPage;
