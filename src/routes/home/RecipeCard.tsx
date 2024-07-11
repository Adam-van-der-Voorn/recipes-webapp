import { useNavigate } from 'react-router-dom';


type Props = {
    recipeId: string;
    recipeName: string;
};

function RecipeCard({ recipeId, recipeName }: Props) {
    const navigate = useNavigate();

    return (
        <div role="button" className="RecipeCard" onClick={() => navigate(`/view-${recipeId}`)}>
            {recipeName}
        </div>
    );
}

export default RecipeCard;
