import { IngredientsList as IngredientsListType, Substitution } from '../../types/recipeTypes';
import { IngredientsSection } from './IngredientsSection';


type Props = {
    ingredients?: IngredientsListType,
    substitutions?: Substitution[],
    servings?: string;
    makes?: string;
    timeframe?: string;
};

function IngredientsTab({ ingredients, substitutions, servings, makes, timeframe }: Props) {
    const hasMetaData = servings !== undefined || makes !== undefined || timeframe !== undefined;
    const hasIngredients = ingredients !== undefined && ingredients.lists
        .flatMap(l => l.ingredients)
        .length > 0;

    return <div role='tabpanel' className="recipePageTabPanel">
        {hasMetaData
            ? <MetaData servings={servings} makes={makes} timeframe={timeframe} />
            : null
        }
        {hasIngredients
            ? <IngredientsSection ingredients={ingredients.lists} />
            : <p>This recipe has no ingredients 🤔</p>
        }
        {substitutions !== undefined && <p>display of substitutions is not currently supported :(</p>}
    </div>;
}

type MetaDataProps = {
    servings?: string;
    makes?: string;
    timeframe?: string;
};

function MetaData({ servings, makes, timeframe }: MetaDataProps) {
    return <ul className="recipeViewMeta" aria-details="recipe metadata">
        {servings && <li>Serves: {servings}</li>}
        {makes && <li>Yields: {makes}</li>}
        {timeframe && <li>Timeframe: {timeframe}</li>}
    </ul>;
}

export default IngredientsTab;