import * as Yup from 'yup';
import { isNumStrict } from '../util/numberInputs';

const unitValPattern = /^\d+(\.\d+)? *[aA-zZ]+[aA-zZ ]*$/;
const decimalValPattern = /^\d+(\.\d+)?$/;

const isLastIngredient = (context: any) => {
    // They're there, I promise
    const listLength = context.from[1].value.ingredients.length;
    const index = context.options.index;
    return index === listLength - 1;
};

export const yupQuantitySchema = Yup.string()
    .test('is-num-unit-optional', 'Must be a number, optionally followed by a unit', (el, context) => {
        return (!el || unitValPattern.test(el) || isNumStrict(el));
    })
    .max(30, 'please make this shorter');

export const yupIngredientNameSchema = Yup.string()
    .max(200, 'Please make this shorter.');

const yupRecipeNameSchema = Yup.string()
    .required("Required")
    .trim()
    .max(200, 'Please make this shorter.');

const yupIngredientsSchema = Yup.object().shape({
    lists: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string()
                    .max(200, 'Please make this shorter.')
                    .required("A name is required."),
                ingredients: Yup.array().of(
                    Yup.object().shape({
                        name: Yup.string()
                            .default('')
                            .test('required', 'Ingredient name is required.', (el, context) => {
                                return isLastIngredient(context) || el.trim() !== '';
                            })
                            .max(200, 'Please make this shorter.'),
                        quantity: Yup.string()
                            .default('')
                            .max(30, 'please make this shorter'),
                        percentage: Yup.string()
                            .test('is-num-or-whitespace', 'Must be a valid percentage.', (el, context) => {
                                if (el === undefined) {
                                    return false;
                                }
                                return (el.trim() === '' || decimalValPattern.test(el));
                            })
                    })
                )
            })
        ),
    anchor: Yup.string()
});

// TODO: ensure that removals are all listed ingredients
const yupSubstitutionsSchema = Yup.array().of(
    Yup.object().shape({
        additions: Yup.array().of(Yup.string()),
        removals: Yup.array().of(Yup.string()),
        notes: Yup.string()
            .max(500, 'Please make these notes shorter.'),
    })
);

export default function getFullSchema() {
    return Yup.object({
        name: yupRecipeNameSchema,
        timeframe: Yup.string()
            .max(150, 'Please make this shorter.'),
        makes: Yup.string()
            .max(150, 'Please make this shorter.'),
        servings: Yup.string()
            .max(150, 'Please make this shorter.'),
        notes: Yup.string()
            .max(10000, 'Please make this shorter.'),
        ingredients: yupIngredientsSchema,
        instructions: Yup.string()
            .max(10000, 'Please make this shorter.'),
        substitutions: yupSubstitutionsSchema,
    });
};