import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RecipiesContext } from "../../App";
import MyError from "../../components-misc/MyError";
import { Recipie } from "../../types/recipieTypes";

function RecipiePage() {
    const recipieId = useParams().recipieId;
    const { recipies, deleteRecipie }  = useContext(RecipiesContext);

    const navigate = useNavigate();

    if (recipieId === undefined) {
        console.error(`RecipiePage: no recipie provided as param`);
        return <MyError message="Oops! Something went wrong." />;
    }

    const deleteAndNavigate = () => {
        deleteRecipie(recipieId, () => {
            navigate(`/`);
        })                                                                                                                                       
    }

    const recipie: Recipie | undefined = recipies.get(recipieId);

    let content;
    if (recipie === undefined) {
        content = null;
    }
    else {
        const { name, servings, timeframe, notes, ingredients, substitutions, instructions } = recipie;
        content = <>
            <h1>{name}</h1>
            <Link to={`/edit-${recipieId}`}>Edit</Link>
            <button onClick={deleteAndNavigate}>del</button>
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
                                return <div key={addition.ingredientName}> {addition.quantity.value} {addition.quantity.unit} {addition.ingredientName}</div>;
                            })}
                            <div>remove:</div>
                            {substitution.removals.map(removal => {
                                return <div key={removal.ingredientName}> {removal.quantity.value} {removal.quantity.unit} {removal.ingredientName}</div>;
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