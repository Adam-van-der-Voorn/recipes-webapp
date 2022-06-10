import { useContext } from 'react';
import RecipeCard from './RecipeCard';

import './RecipeCardContainer.css';
import { RecipesContext } from '../../App';

function RecipeCardContainer() {

    const { recipes } = useContext(RecipesContext);

    const cards: JSX.Element[] = Array.from(recipes).map(([id, recipe]) => {
        return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} />;
    });

    return (
        <div className="RecipeCardContainer">
            {cards}
        </div>
    );
}

export default RecipeCardContainer;
