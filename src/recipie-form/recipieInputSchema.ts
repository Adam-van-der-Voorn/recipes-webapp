import * as Yup from 'yup';

const unitValPattern = /^\d+(\.\d+)? *[aA-zZ]+[aA-zZ ]*$/;
const decimalValPattern = /^\d+(\.\d+)?$/;

const isLastIngredient = (context: any) => {
    // They're there, I promise
    const listLength = context.from[1].value.ingredients.length;
    const index = context.options.index;
    return index === listLength - 1;
};

export const yupQuantitySchema = Yup.string()
    .matches(unitValPattern, 'Must be a number, followed by a unit')
    .max(30, 'please make this shorter');

export const yupIngredientNameSchema = Yup.string()
    .max(60, 'Please make this shorter.');

const yupRecipieNameSchema = Yup.string()
    .required("Required")
    .trim()
    .max(150, 'Please make this shorter.');

const yupIngredientsSchema = Yup.object().shape({
    lists: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string()
                    .max(60, 'Please make this shorter.')
                    .required("A name is required."),
                ingredients: Yup.array().of(
                    Yup.object().shape({
                        name: yupIngredientNameSchema
                            .test('is-required', 'Ingredient name is required.', (el, context) => {
                                return (el !== undefined || isLastIngredient(context));
                            }),
                        quantity: yupQuantitySchema
                            .test('is-required', 'Ingredient quantity is required.', (el, context) => {
                                return (el !== undefined || isLastIngredient(context));
                            }),
                        percentage: Yup.string()
                            .transform(old => old.trim() === '' ? '0' : old) // allow whitespace only
                            .matches(decimalValPattern, 'Must be a valid percentage'),
                    })
                )
            })
        ),
    anchor: Yup.string()
});


const yupSubstitutionsSchema = Yup.array().of(
    Yup.object().shape({
        additions: Yup.array().of(
            Yup.object().shape({
                quantity: yupQuantitySchema
                    .required('Ingredient quantity is required.'),
                ingredientName: yupIngredientNameSchema
                    .required('Ingredient name is required.'),
            })
        ),
        removals: Yup.array().of(
            Yup.object().shape({
                quantity: yupQuantitySchema
                    .required('Ingredient quantity is required.'),
                ingredientName: Yup.string() // select field,
            })
        ),
    })
);

export default function getFullSchema() {
    return Yup.object({
        name: yupRecipieNameSchema,
        timeframe: Yup.string()
            .max(150, 'Please make this shorter.'),
        makes: yupQuantitySchema,
        notes: Yup.string()
            .max(10000, 'Please make this shorter.'),
        ingredients: yupIngredientsSchema,
        servings: Yup.string()
            .transform(old => old.trim() === '' ? '0' : old) // allow whitespace only
            .matches(decimalValPattern, 'Must be a number'),
        instructions: Yup.array()
            .max(1000, "Please make this step shorter"),
        substitutions: yupSubstitutionsSchema,
    });
};