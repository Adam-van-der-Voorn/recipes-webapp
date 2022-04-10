import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { RecipiesContext } from "../../App";

function RecipiePage() {
    const recipieName = useParams().recipieName;
    const allRecipies = useContext(RecipiesContext).recipies;
    const recipie = allRecipies.find(value => value.name === recipieName);
    let content;
    if (!recipie) {
        content = <>recipie {recipieName} does not exist :(</>;
    }
    else {
        const { name, servings, timeframe, notes, ingredients, substitutions, instructions } = recipie;
        content = <>
            <h1>{name}</h1>
            <Link to={`/edit-${recipieName}`}>Edit</Link>
            {servings && <div>Servings: {servings.value} {servings.unit}</div>}
            {timeframe && <div>Timeframe: {timeframe}</div>}
            {notes && <pre>{notes}</pre>}
            {ingredients &&
                <>
                    <h2>Ingredients</h2>
                    {ingredients.lists.map(sublist => {
                        return (<div key={sublist.name}>
                            <h3>{sublist.name}</h3>
                            {sublist.ingredients.map(ingredient => {
                                return <div key={ingredient.name}>{ingredient.quantity.value} {ingredient.quantity.unit}{'\t'}{ingredient.name}</div>;
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
                            {substitution.changes.map(subPart => {
                                return <div key={subPart.action+subPart.ingredientName}>{subPart.action} {subPart.amount} {subPart.ingredientName}</div>;
                            })}
                        </div>);
                    })}
                </>
            }
            {instructions &&
                <>
                    <h2>Method</h2>
                    {instructions.map((step, idx) => {
                        return <div key={idx}>{idx + 1}. {step}</div>;
                    })}
                </>
            }
            <br/><br/><br/><br/>
            <pre>{JSON.stringify(recipie, null, 2)}</pre>;
        </>;
    }


    return (
        <div className="RecipiePage">
            {content}
        </div>
    );
}

export default RecipiePage;