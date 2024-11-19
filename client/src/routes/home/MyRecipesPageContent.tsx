import { useContext } from 'react';
import MyError from "../../general/placeholders/Error";
import { GlobalContext } from '../../contexts/GlobalContext';
import RecipeCard from './RecipeCard';
import Loading from '../../general/placeholders/Loading';


function MyRecipesPageContent() {
    const { recipes } = useContext(GlobalContext);

    if (recipes.status === "prefetch") {
        return <Loading message="Loading your recipes ..." />;
    }

    if (recipes.status === "error") {
        return <MyError message={`Something went wrong :( ${recipes.message ?? ""}`} />;
    }

    const recipeMap = recipes.data!; // we should have recipes due to guard statements above
    const cards: JSX.Element[] = Array.from(recipeMap).map(([id, recipe]) => {
        return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} />;
    });

    return <main>
        <div className="recipe-container" aria-details='list of saved recipes'>
            {cards}
        </div>
    </main>;
}

export default MyRecipesPageContent;
