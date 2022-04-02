import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useContext } from "react";
import { UnitVal, Recipie } from "../../types/recipieTypes";
import { RecipiesContext } from "../App";
import IngredientsField from "./IngredientsField";
import parseUnitValInput from "./parseUnitValInput";

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
        .map(recipie => recipie.name)
        // remove initial name from invalid names
        .filter(name => name !== initialValues.name);

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
                        ingredients: {
                            list: []
                        }
                    };

                    if (values.servings !== '') {
                        newRecipie.servings = parseUnitValInput(values.servings);
                    }

                    if (values.timeframe !== '') {
                        newRecipie.timeframe = values.timeframe.trim();
                    }

                    for (const ingredient of values.ingredients.list) {
                        const parsedQuantity: UnitVal = parseUnitValInput(ingredient.quantity);
                        newRecipie.ingredients.list.push({
                            name: ingredient.name,
                            quantity: parsedQuantity
                        });
                    }

                    newRecipie.ingredients.anchor = values.ingredients.anchor

                    if (values.instructions !== '') {
                        newRecipie.instructions = values.instructions.trimEnd();
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
