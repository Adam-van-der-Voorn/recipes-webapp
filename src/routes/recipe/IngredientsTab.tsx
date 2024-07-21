import { Fragment } from 'react';
import { IngredientsList as IngredientsListType, IngredientsSubList, Substitution } from '../../types/recipeTypes';
import quantityToString from '../../util/quantityToString';


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
        .length > 0

    return <div role='tabpanel' className="recipePageTabPanel">
        {hasMetaData
            ? <MetaData servings={servings} makes={makes} timeframe={timeframe} />
            : null
        }
        { hasIngredients
            ? <IngredientsList ingredients={ingredients.lists} />
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
    return <ul className="recipeViewMeta" aria-details="recipie metadata">
        {servings && <li>Serves: {servings}</li>}
        {makes && <li>Yields: {makes}</li>}
        {timeframe && <li>Timeframe: {timeframe}</li>}
    </ul>;
}

type IngredientsListProps = {
    ingredients: IngredientsSubList[];
};

function IngredientsList({ ingredients }: IngredientsListProps) {
    const hasMultipleLists = ingredients.length > 1;
    return <section aria-details="recipe ingredients" className="ingredients">
        {ingredients.map((sublist, i) => {
            return <SubList key={`sublist-${i}`} sublist={sublist} renderName={hasMultipleLists} />;
        })}
    </section>;
}

type IngredientsSubListProps = {
    sublist: IngredientsSubList;
    renderName: boolean;
};

function SubList({ sublist, renderName }: IngredientsSubListProps) {
    return <>
        {renderName && <h2 className="ingredientListName">{sublist.name}</h2>}
        <ul className="ingredientViewList">
            {sublist.ingredients.map((ingredient, i) => {
                const optional = ingredient.optional ? <span className='ingredientOptionalTag'>(optional)</span> : null;
                return <Fragment key={`ingredient-${i}`}>
                    <li>{quantityToString(ingredient.quantity)}</li>
                    <li className="ingredientName">{ingredient.name} {optional}</li>
                </Fragment>;
            })}
        </ul>
    </>;
}

export default IngredientsTab;