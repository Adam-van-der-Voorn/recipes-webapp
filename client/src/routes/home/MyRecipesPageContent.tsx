import { useContext } from 'react';
import MyError from "../../general/placeholders/Error";
import { GlobalContext } from '../../contexts/GlobalContext';
import RecipeCard from './RecipeCard';
import Loading from '../../general/placeholders/Loading';


type Props = {
    searchQuery: string
}

function MyRecipesPageContent({ searchQuery }: Props) {
    const { recipes: recipesStore } = useContext(GlobalContext);

    if (recipesStore.status === "prefetch") {
        return <Loading message="Loading your recipes ..." />;
    }

    if (recipesStore.status === "error") {
        return <MyError message={`Something went wrong :( ${recipesStore.message ?? ""}`} />;
    }

    /** 
     * `recipes` type example
     * {
           name: string
     * }
     */
    const recipes = Array.from(recipesStore.data!); // we should have recipes due to guard statements above
    const cards: JSX.Element[] = recipes.map(([id, recipe]) => {
        return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} />;
    });

    return <main>
        <div className="recipe-container" aria-details='list of saved recipes'>
            {cards}
        </div>
    </main>;
}

export default MyRecipesPageContent;
