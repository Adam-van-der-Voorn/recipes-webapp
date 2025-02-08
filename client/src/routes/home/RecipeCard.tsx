import { Link, useNavigate } from 'react-router-dom';


type Props = {
    recipeId: string;
    recipeName: string;
    highlight?: readonly number[][];
};

function RecipeCard({ recipeId, recipeName, highlight }: Props) {
    const text = highlight ? highlightText(recipeName, highlight) : recipeName;
    return <Link to={`/view/${recipeId}`} className="RecipeCard">
        {text}
    </Link>;
}

/** highlight is inclusive */
function highlightText(text: string, highlight: readonly number[][]) {
    let elements = [];
    let i = 0;
    for (const [left, right] of highlight) {
        const blank = text.slice(i, left);
        if (blank.length > 0) {
            elements.push(blank);
        }
        const em = text.slice(left, right + 1);
        const key = Math.random().toString(36); // always re-render
        elements.push(<mark key={key}>{em}</mark>);
        i = right + 1;
    }
    elements.push(text.slice(i, text.length));
    return elements;
}

export default RecipeCard;
