import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext.tsx";
import { getFromUrl } from "../../api/externalRecipe.ts";
import { User } from "firebase/auth";
import Loading from "../../general/placeholders/Loading.tsx";
import AuthForm from "../../auth/AuthForm.tsx";
import AddRecipeFromUrlOuter from "./AddRecipeFromUrlOuter.tsx";

type Props = {
  user: User;
};

function MainContent({ user }: Props) {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cacheExternalRecipe = (
    url: string,
    recipe: Record<string, unknown>,
  ) => {
    const serial = JSON.stringify(recipe);
    window.sessionStorage.setItem(url, serial);
  };

  const onSubmit = (ev: any) => {
    ev.preventDefault();
    const val = inputRef?.current?.value;
    if (typeof val == "string") {
      getFromUrl(val)
        .then((recipe) => {
          cacheExternalRecipe(val, recipe);
          navigate(`edit#${val}`, { relative: "path" });
        })
        .catch((e) => {
          console.error("add recipe failed:", e);
          let msg;
          if (e.ecode === "no.recipe.schema") {
            msg =
              "Sorry! This URL does not appear to supply a computer readable recipe, so you will have to add this recipe manually.";
          } else {
            msg =
              "Something went wrong, failed to add recipe :(\n maybe try again?";
          }
          alert(msg);
        });
    }
  };

  const onPaste = (ev: any) => {
    const text = ev.target.value;
    try {
      const _ = new URL(text);
      // valid url pasted, go on
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    } catch (e) {
      // not a url? that's all good.
    }
  };

  return (
    <main>
      <form className="recipeForm" onSubmit={onSubmit} ref={formRef}>
        <section>
          <label htmlFor="add-from-url">URL</label>
          <input
            type="text"
            name="add-from-url"
            id="add-from-url"
            onPaste={onPaste}
            ref={inputRef}
            autoFocus
            style={{ width: "100%" }}
          />
        </section>
        <br></br>
        <section>
          <input type="submit" value="Add" />
        </section>
      </form>
    </main>
  );
}

export default function AddRecipeFromUrlPage() {
  const { user, auth } = useContext(GlobalContext);
  if (user === "pre-auth") {
    return (
      <AddRecipeFromUrlOuter>
        <Loading message="Finding user ..." />
      </AddRecipeFromUrlOuter>
    );
  } else if (user) {
    return (
      <AddRecipeFromUrlOuter>
        <MainContent user={user} />
      </AddRecipeFromUrlOuter>
    );
  } else {
    return (
      <AddRecipeFromUrlOuter>
        <AuthForm auth={auth} />
      </AddRecipeFromUrlOuter>
    );
  }
}
