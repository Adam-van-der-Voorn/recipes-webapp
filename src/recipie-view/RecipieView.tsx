import { Recipe, Substitution } from "../types/recipeTypes";
import StrList from "../components-misc/StrList";
import "./RecipeView.css";
import { Fragment } from "react";

const isBasicSubstitution = (substitution: Substitution) => {
    return substitution.removals.length === 1 &&
        substitution.additions.length === 1;
};

type Props = {
    recipe: Recipe;
};

function RecipeView({ recipe }: Props) {
    const { name, servings, makes, timeframe, notes, ingredients, substitutions, instructions } = recipe;
    return <>
        <h1>{name}</h1>
        {servings && <div>Serves {servings}</div>}
        {makes && <div>Makes {makes.value} {makes.unit}</div>}
        {timeframe && <div>Timeframe: {timeframe}</div>}
        {notes &&
            <section aria-details="recipie notes">
                <StrList>{notes}</StrList>
            </section>
        }
        {ingredients &&
            <section>
                <h2>Ingredients</h2>
                <div id="ingredient-lists-view" style={{ marginBottom: "18px" }}>
                    {ingredients.lists.map((sublist, i) => (
                        <div key={`list-${i}`} className="ingredient-list-view">
                            {ingredients.lists.length > 1 && <h3>{sublist.name}</h3>}
                            <ul className="tabbed" style={{ gridTemplateColumns: "auto auto", }}>
                                {sublist.ingredients.map((ingredient, ii) => {
                                    const optional = ingredient.optional ? <span>(optional)</span> : null;
                                    return <Fragment key={`ingredient-${ii}/${i}`}>
                                        <li>{ingredient.name}</li>
                                        <li>{ingredient.quantity.value} {ingredient.quantity.unit} {optional}</li>
                                    </Fragment>;
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        }
        {substitutions &&
            <ul aria-details="substitutions">
                {substitutions.map((substitution, i) => {
                    const { removals, additions } = substitution;
                    if (isBasicSubstitution(substitution)) {
                        return (
                            <li key={i}>
                                The {removals[0]} can be substituted for {additions[0]}
                            </li>
                        );
                    }
                    return (
                        <pre key={i}>
                            display of this substitution is not yet suppourted :)
                            {JSON.stringify(substitution)}
                        </pre>
                    );
                })}
            </ul>
        }
        {instructions &&
            <section>
                <h2>Method</h2>
                <StrList>{instructions}</StrList>
            </section>
        }
    </>;
}

export default RecipeView;