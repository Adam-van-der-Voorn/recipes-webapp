import { useContext } from 'react';
import MyError from "../../general/placeholders/Error";
import { GlobalContext } from '../../contexts/GlobalContext';
import RecipeCard from './RecipeCard';


function RecipeCardContainer() {
    const { recipes } = useContext(GlobalContext);

    if (recipes.status === "prefetch") {
        return null;
    }

    if (recipes.status === "error") {
        return <MyError message={`Something went wrong :( ${recipes.message ?? ""}`} />;
    }

    const recipeMap = recipes.data!; // we should have recipies due to guard statements above
    const cards: JSX.Element[] = Array.from(recipeMap).map(([id, recipe]) => {
        return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} />;
    });

    return <main className="recipeFlexContainer" aria-details='list of saved recipies'>
            {cards}
    </main>
}

export default RecipeCardContainer;
