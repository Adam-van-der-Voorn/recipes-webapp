import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RecipesContext } from "../../App";
import MultiLineParagraph from "../../components-misc/MultiLineParagraph";
import MyError from "../../components-misc/MyError";
import { Recipe, Substitution } from "../../types/recipeTypes";

function RecipePage() {
    const recipeId = useParams().recipeId;
    const { recipes, deleteRecipe } = useContext(RecipesContext);

    const navigate = useNavigate();

    if (recipeId === undefined) {
        console.error(`RecipePage: no recipe provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    const recipe: Recipe | undefined = recipes.get(recipeId);

    let content;
    if (recipe === undefined) {
        content = null;
    }
    else {

        const deleteAndNavigate = () => {
            let confirmation = window.confirm(`Are you sure you want to delete recipe '${recipe.name}'`);
            if (confirmation) {
                deleteRecipe(recipeId, () => {
                    navigate(`/`);
                });
            }
        };

        const { name, servings, makes, timeframe, notes, ingredients, substitutions, instructions } = recipe;
        content = <>
            <h1>{name}</h1>
            <Link to={`/edit-${recipeId}`}>Edit</Link>
            {servings && <div>Serves {servings}</div>}
            {makes && <div>Makes {makes.value} {makes.unit}</div>}
            {timeframe && <div>Timeframe: {timeframe}</div>}
            {notes && <MultiLineParagraph>{notes}</MultiLineParagraph>}
            {ingredients &&
                <>
                    <h2>Ingredients</h2>
                    {ingredients.lists.map((sublist, i) => (
                        <div key={`list-${i}`}>
                            <h3>{sublist.name}</h3>
                            {sublist.ingredients.map((ingredient, ii) => {
                                const optional = ingredient.optional ? <>(optional)</> : <></>;
                                return <div key={`ingredient-${ii}/${i}`}>{ingredient.quantity.value} {ingredient.quantity.unit}{'\t'}{ingredient.name} {optional}</div>;
                            })}
                        </div>
                    ))}
                </>
            }
            {substitutions &&
                <>
                    {substitutions.map((substitution, i) => {
                        const { removals, additions } = substitution;
                        if (isBasicSubstitution(substitution)) {
                            return (
                                <div key={i}>
                                    The {removals[0]} can be substituted for {additions[0]}
                                </div>
                            );
                        }
                        return (
                            <pre key={i}>
                                display of this substitution is not yet suppourted :)
                                {JSON.stringify(substitution)}
                            </pre>
                        );
                    })}
                </>
            }
            {instructions &&
                <>
                    <h2>Method</h2>
                    <MultiLineParagraph>{instructions}</MultiLineParagraph>
                </>
            }
            <hr />
            <button onClick={deleteAndNavigate}>Delete</button>
        </>;
    }


    return (
        <div className="RecipePage">
            {content}
        </div>
    );
}

const isBasicSubstitution = (substitution: Substitution) => {
    return substitution.removals.length === 1 &&
        substitution.additions.length === 1
};

export default RecipePage;