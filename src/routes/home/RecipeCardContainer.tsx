import { useContext } from 'react';
import Loading from '../../components-misc/placeholders/Loading';
import MyError from "../../components-misc/placeholders/Error";
import { RecipesContext } from '../../contexts/RecipesContext';
import RecipeCard from './RecipeCard';

import './RecipeCardContainer.css';

function RecipeCardContainer() {

    const { recipes } = useContext(RecipesContext);

    if (recipes.status === "prefetch") {
        return <Loading message="Loading recipes..." />
    }

    if (recipes.status === "error") {
        return <MyError message={`Something went wrong :( ${recipes.message ?? "<no error message>"}`} />
    }

    const recipeMap = recipes.data!; // we should have recipies due to guard statements above
    const cards: JSX.Element[] = Array.from(recipeMap).map(([id, recipe]) => {
        return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} />;
    });

    return (
        <div className="RecipeCardContainer" aria-details='list of saved recipies'>
            {cards}
        </div>
    );
}

export default RecipeCardContainer;
