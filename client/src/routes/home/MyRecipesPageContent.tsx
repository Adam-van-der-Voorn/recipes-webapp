import { useContext, useMemo } from 'react';
import Fuse from 'fuse.js';
import MyError from "../../general/placeholders/Error";
import { GlobalContext } from '../../contexts/GlobalContext';
import RecipeCard from './RecipeCard';
import Loading from '../../general/placeholders/Loading';
import { Recipe } from '../../types/recipeTypes';
import NotFound from '../../general/placeholders/NotFound';

const fuseOptions = {
    keys: ['recipe.name'],
    shouldSort: true,
    includeMatches: true,
    isCaseSensitive: false,
    threshold: 0.4, // threshold for fuzzy matching
};

type Props = {
    searchQuery: string;
};

function MyRecipesPageContent({ searchQuery }: Props) {
    const { recipes: recipesStore } = useContext(GlobalContext);
    const recipes = recipesStore?.data;
    const recipeSearchIndex = useMemo(() => {
        return new Fuse(recipesIndexable(recipes), fuseOptions);
    }, [recipes]);

    let content;
    if (recipesStore.status === "prefetch") {
        content = <Loading message="Loading your recipes ..." />;
    }

    else if (recipesStore.status === "error") {
        content = <MyError message={`Something went wrong :( ${recipesStore.message ?? ""}`} />;
    }

    else {
        if (!searchQuery) {
            const cards = recipesIndexable(recipes).map(obj => {
                const { id, recipe } = obj
                return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} />;
            });
            content = <div className="recipe-container">{cards}</div>;
        }
        else {
            const searchResults = recipeSearchIndex.search(searchQuery);
            if (searchResults.length === 0) {
                content = <NotFound message={`No recipes found for '${searchQuery}'`} />;
            }
            else {
                const cards = searchResults.map((entry) => {
                    const x = entry.matches?.[0]?.indices
                    console.log(JSON.stringify(x))
                    const { id, recipe } = entry.item;
                    return <RecipeCard key={id} recipeId={id} recipeName={recipe.name} highlight={x} />;
                });
                content = <div className="recipe-container">{cards}</div>;
            }
        }
    }

    return <main>
        {content}
    </main>;
}

function recipesIndexable(recipes: Map<string, Recipe> | undefined) {
    if (recipes === undefined) {
        return [];
    }
    const r = [];
    for (const [id, recipe] of Array.from(recipes)) {
        r.push({ id, recipe });
    }

    return r;
}

export default MyRecipesPageContent;
