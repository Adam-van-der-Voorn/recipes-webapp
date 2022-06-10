import { useNavigate } from 'react-router-dom';
import './RecipeCard.css';

type Props = {
    recipeId: string;
    recipeName: string;
};

function RecipeCard({ recipeId, recipeName }: Props) {
    const navigate = useNavigate();

    return (
        <div className="RecipeCard" onClick={() => navigate(`/view-${recipeId}`)}>
            {recipeName}
        </div>
    );
}

export default RecipeCard;
