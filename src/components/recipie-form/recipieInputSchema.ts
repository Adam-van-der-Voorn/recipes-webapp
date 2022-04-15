import * as Yup from 'yup';

const unitValPattern = /^\d+(\.\d+)?[aA-zZ ]+$/;
const decimalValPattern = /^\d+(\.\d+)?$/;

const yupQuantitySchema = Yup.string()
    .matches(unitValPattern, 'Must be a number, followed by a unit')
    .max(30, 'please make this shorter');

const yupIngredientNameSchema = Yup.string()
    .max(60, 'Please make this shorter.')
    .required("Ingredient name is required.");

const yupRecipieNameSchema = (invalidRecipieNames: string[]) => Yup.string()
    .required("Required")
    .trim()
    .max(150, 'Please make this shorter.')
    .lowercase()
    .notOneOf(invalidRecipieNames, 'A recipie with this name already exists');

const yupIngredientsSchema = Yup.object().shape({
    list: Yup.array()
        .of(
            Yup.object().shape({
                name: yupIngredientNameSchema,
                quantity: yupQuantitySchema
                    .required('Ingredient quantity is required.'),
                percentage: Yup.string()
                    .transform(old => old.trim() === '' ? '0' : old) // allow whitespace only
                    .matches(decimalValPattern, 'Must be a valid percentage'),
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
                ingredientName: yupIngredientNameSchema,
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

export default function getFullSchema(invalidRecipieNames: string[]) {
    return Yup.object({
        name: yupRecipieNameSchema(invalidRecipieNames),
        timeframe: Yup.string()
            .max(150, 'Please make this shorter.'),
        notes: Yup.string()
            .max(10000, 'Please make this shorter.'),
        ingredients: yupIngredientsSchema,
        servings: yupQuantitySchema,
        instructions: Yup.array()
            .max(1000, "Please make this step shorter"),
        substitutions: yupSubstitutionsSchema,
    });
};