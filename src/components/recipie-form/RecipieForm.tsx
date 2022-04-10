import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useContext } from "react";
import { UnitVal, Recipie, IngredientsSubList } from "../../types/recipieTypes";
import { RecipiesContext } from "../App";
import IngredientsField from "./IngredientsField";
import parseUnitValInputs from "./parseUnitValInputs";

const unitValPattern = /^\d+(\.\d+)?[aA-zZ ]+$/;
const unitValPatternOptional = /^\d+(\.\d+)?.*$/;
const decimalValPattern = /^\d+(\.\d+)?$/;

export type RecipieFormData = {
    name: string,
    timeframe: string,
    ingredients: {
        list: {
            name: string,
            quantity: string,
            percentage: string,
        }[],
        anchor: string,
    },
    servings: string,
    instructions: string;
};

type Props = {
    doSubmit: (recipie: Recipie) => void;
    initialValues: RecipieFormData;
};

function RecipieForm({ doSubmit, initialValues }: Props) {
    const recipiesContext = useContext(RecipiesContext);
    const invalidRecipieNames = recipiesContext.recipies
        .map(recipie => recipie.name.toLowerCase())
        // remove initial name from invalid names
        .filter(name => name !== initialValues.name.toLowerCase());

    return (
        <div className="RecipieForm">
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required("Required")
                        .trim()
                        .max(150, 'Please make this shorter.')
                        .lowercase()
                        .notOneOf(invalidRecipieNames, 'A recipie with this name already exists'),
                    timeframe: Yup.string()
                        .max(150, 'Please make this shorter.'),
                    ingredients: Yup.object().shape({
                        list: Yup.array()
                            .of(
                                Yup.object().shape({
                                    name: Yup.string()
                                        .max(60, 'Please make this shorter.')
                                        .required("Ingredient name is required."),
                                    quantity: Yup.string()
                                        .matches(unitValPattern, 'Must be a number, followed by a unit')
                                        .max(30, 'please make this shorter')
                                        .required('Ingredient quantity is required.'),
                                    percentage: Yup.string()
                                        .trim()
                                        .transform(old => old.trim() === '' ? '0' : old) // allow whitespace only
                                        .matches(decimalValPattern, 'Must be a valid percentage'),
                                })
                            ),
                        anchor: Yup.string()
                    }),
                    servings: Yup.string()
                        .matches(unitValPatternOptional, 'Must be a number, optionally followed by a unit.')
                        .max(30, 'please make this shorter'),
                    instructions: Yup.string()
                        .max(10000, 'Please make this shorter'),
                })}
                onSubmit={(values) => {
                    // parse form data
                    const newRecipie: Recipie = {
                        name: values.name.trim(),
                    };

                    if (values.servings !== '') {
                        newRecipie.servings = parseUnitValInputs(values.servings)[0];
                    }

                    if (values.timeframe !== '') {
                        newRecipie.timeframe = values.timeframe.trim();
                    }

                    if (values.ingredients.list.length > 0) {
                        newRecipie.ingredients = {
                            anchor: values.ingredients.anchor,
                            lists: [{name: "Main", ingredients: []}]
                        }
                        for (const ingredient of values.ingredients.list) {
                            const parsedQuantity: UnitVal = parseUnitValInputs(ingredient.quantity)[0];
                            newRecipie.ingredients!.lists[0].ingredients.push({
                                name: ingredient.name,
                                quantity: parsedQuantity
                            });
                        }
                    }
                    

                    if (values.instructions !== '') {
                        newRecipie.instructions = [values.instructions.trimEnd()];
                    }

                    // do something with the data
                    doSubmit(newRecipie);
                }}
            >
                {({ values }) => (
                    <Form>
                        <label htmlFor="name">Name</label>
                        <Field name="name" type="text" />
                        <ErrorMessage name="name" />
                        <br />

                        <label htmlFor="timeframe">About how long will this take to cook?</label>
                        <Field name="timeframe" type="text" />
                        <ErrorMessage name="timeframe" />
                        <br />

                        <FieldArray name="ingredients.list" render={arrayHelpers => (
                            <IngredientsField arrayHelpers={arrayHelpers} />
                        )} />

                        <label htmlFor='servings'>Serves</label>
                        <Field name="servings" type="text" />
                        <ErrorMessage name="servings" />
                        <br />

                        <label htmlFor="instructions">Method</label>
                        <Field name="instructions" as="textarea" />
                        <ErrorMessage name="instructions" />
                        <br />
                        <input type="submit" name="submit" id="submit-recipie" />
                    </Form>

                )}
            </Formik>

        </div>
    );
}

export default RecipieForm;
