import { useContext } from 'react';
import { RecipesContext } from '../../contexts/RecipesContext';
import RecipeCard from './RecipeCard';

function RecipeCardContainer() {

    const { recipes } = useContext(RecipesContext);

    const cards: JSX.Element[] = Array.from(recipes).map(([id, recipe]) => {
        return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} />;
    });

    return (
        <div className="RecipeCardContainer" aria-details='list of saved recipies'>
            {cards}
        </div>
    );
}

export default RecipeCardContainer;
