import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import Loading from "../../general/placeholders/Loading";
import { User } from "firebase/auth";
import AuthForm from "../../auth/AuthForm";
import RecipeForm from "../../recipe-form/components/RecipeForm";
import { Recipe } from "../../types/recipeTypes";
import useRecipeStorage from "../../util/hooks/useRecipeStorage";
import { Firestore } from "firebase/firestore";
import { RecipeInput } from "../../types/RecipeInputTypes";
import { ingredientInputsFromExistingRecipe } from "../../recipe-form/ingredientInputsFromExistingRecipe";
import AddRecipeFromUrlOuter from "../add-recipe-from-url/AddRecipeFromUrlOuter";

const FORM_ID = "edit-recipe";

type Props = {
    user: User;
    db: Firestore;
};

function MainContent({ user, db }: Props) {
    const recipeRef = useRef<Recipe | null>(null);

    const { addRecipe } = useRecipeStorage(db, user.uid);
    const navigate = useNavigate();

    const doSubmit = (recipe: Recipe) => {
        addRecipe(recipe, (id) => {
            navigate(`/view/${id}`, { replace: true });
        });
    };

    if (recipeRef.current === null) {
        // populate with qp
        const id = window.location.hash;
        let val;
        if (id === '') {
            val = {};
        }
        else {
            // substring to rm #
            const s = window.sessionStorage.getItem(id.substring(1));
            if (s === null) {
                console.log("no value in cache for id:", id);
                val = {};
            }
            else {
                try {
                    val = JSON.parse(s);
                }
                catch {
                    console.error("could not parse from sessionstorage, this should not happen. value: ", s);
                    val = {};
                }
            }
        }
        recipeRef.current = val;
    }

    // !: we know it exists as it is _always_ initalised in the above block
    const recipe = recipeRef.current!;
    const initialValues: RecipeInput = {
        name: recipe.name || '',
        timeframe: recipe.timeframe || '',
        makes: recipe.makes || '',
        notes: recipe.notes || '',
        ingredients: ingredientInputsFromExistingRecipe(recipe.ingredients),
        servings: recipe.servings || '',
        instructions: recipe.instructions || '',
        substitutions: recipe.substitutions || [],
    };

    return <main className="recipeFormBody" aria-details="edit a recipe extracted from a URL">
        <RecipeForm id={FORM_ID} onSubmit={doSubmit} initialValues={initialValues} />
    </main>;
}

export default function AddRecipeFromUrlPageEdit() {
    const { user, auth, db } = useContext(GlobalContext);

    if (user === "pre-auth") {
        return <AddRecipeFromUrlOuter><Loading message="Finding user ..." /></AddRecipeFromUrlOuter>;
    }
    else if (user) {
        return <AddRecipeFromUrlOuter><MainContent user={user} db={db} /></AddRecipeFromUrlOuter>;
    }
    else {
        return <AddRecipeFromUrlOuter><AuthForm auth={auth} /></AddRecipeFromUrlOuter>;
    }
}