import { Fragment } from 'react';
import { IngredientsList, Substitution } from '../types/recipeTypes';
import quantityToString from '../util/quantityToString';
import style from './RecipeView.module.css';

type Props = {
    ingredients: IngredientsList,
    substitutions?: Substitution[],
};

function IngredientsView({ ingredients, substitutions }: Props) {
    const hasMultipleLists = ingredients.lists.length > 1;
    return <section className={style.ingredients}>
        { hasMultipleLists
            ? <h2 className={style.h2}>{ingredients.lists[0].name}</h2>
            : <h2 className={style.h2}>Ingredients</h2>
        }
        <ul className={style.ingredientList}>
            {ingredients.lists.map((sublist, i) => {
                const isFirstList = i === 0;
                return <Fragment key={`ingredients-${i}`}>
                    { hasMultipleLists && !isFirstList && <h2 className={style.ingredientListName}>{sublist.name}</h2> }
                    { sublist.ingredients.map((ingredient, ii) => {
                        const optional = ingredient.optional ? <span>(optional)</span> : null;
                        return <Fragment key={`ingredient-${ii}/${i}`}>
                            <li>{quantityToString(ingredient.quantity)}</li>
                            <li className={style.ingredientName}>{ingredient.name}  {optional}</li>
                        </Fragment>;
                    }) }
                </Fragment>;
            })}
        </ul>
    </section>;
}

export default IngredientsView;