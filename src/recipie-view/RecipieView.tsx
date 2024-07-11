import { Recipe, Substitution } from "../types/recipeTypes";
import quantityToString from "../util/quantityToString";
import IngredientsView from "./IngredientsView";

const isBasicSubstitution = (substitution: Substitution) => {
    return substitution.removals.length === 1 &&
        substitution.additions.length === 1;
};

type Props = {
    recipe: Recipe;
};

function RecipeView({ recipe }: Props) {
    const { name, servings, makes, timeframe, notes, ingredients, substitutions, instructions } = recipe;
    const hasMetaData = servings || makes || timeframe;
    return <>
        <h1>{name}</h1>

        {hasMetaData &&
            <ul className="meta" aria-details="recipie metadata">
                {servings && <li>Serves {servings}</li>}
                {makes && <li>Yields {quantityToString(makes)}</li>}
                {timeframe && <li>Time: {timeframe}</li>}
            </ul>
        }

        {notes &&
            <section aria-details="recipie notes" className="notes">
                {notes}
            </section>
        }

        <div className="main">
            {ingredients && <IngredientsView ingredients={ingredients} substitutions={substitutions} />}
            {instructions &&
                <section className="instructions">
                    <h2 className="h2">Method</h2>
                    <ol>
                        {instructions.split("\n")
                            .map((line, i) => <li key={i} className="instruction">
                                <span className="instructionMarker">{i + 1}. </span><span>{line}</span>
                            </li>)
                        }
                    </ol>
                </section>
            }
        </div>

        <hr />

        {substitutions &&
            <section>
                <h2 className="h2">Substitutions</h2>
                <ul aria-details="substitutions list">
                    {substitutions.map((substitution, i) => {
                        const { removals, additions } = substitution;
                        if (isBasicSubstitution(substitution)) {
                            return <li className="substitution" key={i}>
                                The {removals[0]} can be substituted for {additions[0]}
                            </li>;
                        }
                        return <pre key={i}>
                            display of this substitution is not yet suppourted :)
                            {JSON.stringify(substitution)}
                        </pre>;
                    })}
                </ul>
            </section>
        }
    </>;
}

export default RecipeView;