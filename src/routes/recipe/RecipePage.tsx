import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RecipesContext } from "../../App";
import MyError from "../../components-misc/MyError";
import { Recipe } from "../../types/recipeTypes";

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
            <button onClick={deleteAndNavigate}>del</button>
            {servings && <div>Serves {servings}</div>}
            {makes && <div>Makes {makes.value} {makes.unit}</div>}
            {timeframe && <div>Timeframe: {timeframe}</div>}
            {notes && <pre>{notes}</pre>}
            {ingredients &&
                <>
                    <h2>Ingredients</h2>
                    {ingredients.lists.map(sublist => {
                        return (<div key={sublist.name}>
                            <h3>{sublist.name}</h3>
                            {sublist.ingredients.map(ingredient => {
                                const optional = ingredient.optional ? <>(optional)</> : <></>;
                                return <div key={ingredient.name}>{ingredient.quantity.value} {ingredient.quantity.unit}{'\t'}{ingredient.name} {optional}</div>;
                            })}
                        </div>);
                    })}
                </>
            }
            {substitutions &&
                <>
                    <h3>Substitutions</h3>
                    {substitutions.map((substitution, idx) => {
                        return (<div key={idx}>
                            <h4>substitution {idx + 1}</h4>
                            <div>add:</div>
                            {substitution.additions.map(addition => {
                                return <div key={addition.ingredientName}> {addition.proportion} {"<--proportion"} {addition.ingredientName}</div>;
                            })}
                            <div>remove:</div>
                            {substitution.removals.map(removal => {
                                return <div key={removal}> {removal}</div>;
                            })}
                        </div>);
                    })}
                </>
            }
            {instructions &&
                <>
                    <h2>Method</h2>
                    <p>{instructions}</p>
                </>
            }
            <br /><br /><br /><br />
            <pre>{JSON.stringify(recipe, null, 2)}</pre>;
        </>;
    }


    return (
        <div className="RecipePage">
            {content}
        </div>
    );
}

export default RecipePage;