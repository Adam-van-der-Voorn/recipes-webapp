import { Link, useNavigate } from 'react-router-dom';


type Props = {
    recipeId: string;
    recipeName: string;
};

function RecipeCard({ recipeId, recipeName }: Props) {
    const navigate = useNavigate();

    return (
        <Link to={`/view/${recipeId}`} className="RecipeCard">
            {recipeName}
        </Link>
    );
}

export default RecipeCard;
