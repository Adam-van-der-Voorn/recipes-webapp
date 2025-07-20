import { IngredientsList as IngredientsListType, Substitution } from '../../types/recipeTypes.ts';
import { IngredientsSection } from './IngredientsSection.tsx';


type Props = {
    ingredients?: IngredientsListType,
    substitutions?: Substitution[],
    servings?: string;
    makes?: string;
    timeframe?: string;
};

function IngredientsTab({ ingredients, substitutions, servings, makes, timeframe }: Props) {
    const hasIngredients = ingredients !== undefined && ingredients.lists
        .flatMap(l => l.ingredients)
        .length > 0;

    return <div role='tabpanel' className="recipePageTabPanel">
        {hasIngredients
            ? <IngredientsSection ingredients={ingredients.lists} />
            : <p>This recipe has no ingredients 🤔</p>
        }
        {substitutions !== undefined && <p>display of substitutions is not currently supported :(</p>}
    </div>;
}

export default IngredientsTab;