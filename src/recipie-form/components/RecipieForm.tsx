import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useContext } from "react";
import { RecipiesContext } from "../../App";
import { Recipie } from "../../types/recipieTypes";
import parseUnitValInputs from "../parseUnitValInputs";
import getFullSchema from "../recipieInputSchema";
import IngredientsField from "./IngredientsField";
import InstructionsField from "./InstructionsField";
import SubstitutionsField from "./SubstitutionsField";

export type RecipieFormData = {
    name: string,
    timeframe: string,
    notes: string;
    ingredients: RecipieInputIngredients,
    servings: string,
    instructions: string[],
    substitutions: RecipieInputSubstitutions,
};

export type RecipieInputIngredient = {
    name: string,
    quantity: string,
    optional: boolean,
    percentage: string,
};

export type RecipieInputIngredients = {
    lists: {
        name: string;
        ingredients: RecipieInputIngredient[];
    }[];
    anchor: number,
};

export type RecipieInputSubstitutions = {
    additions: {
        quantity: string,
        ingredientName: string;
    }[],
    removals: {
        quantity: string,
        ingredientName: string;
    }[];
}[];

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
                validationSchema={getFullSchema(invalidRecipieNames)}
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

                    if (values.notes !== '') {
                        newRecipie.notes = values.notes.trim();
                    }

                    if (values.ingredients.lists.length > 0) {
                        newRecipie.ingredients = {
                            lists: values.ingredients.lists.map(sublist => {
                                return {
                                    name: sublist.name,
                                    ingredients: sublist.ingredients.map(ingredient => {
                                        return {
                                            name: ingredient.name,
                                            quantity: parseUnitValInputs(ingredient.quantity)[0],
                                            optional: ingredient.optional
                                        };
                                    })
                                };
                            })
                        };
                        if (values.ingredients.anchor) {
                            newRecipie.ingredients.anchor = values.ingredients.anchor;
                        }
                    }

                    if (values.instructions.length > 0) {
                        newRecipie.instructions = values.instructions
                            // remove empty instructions
                            .flatMap(instruction => instruction.trim() !== '' ? [instruction] : []);
                    }

                    if (values.substitutions.length > 0) {
                        const parseSubPart = (subPartInput: { quantity: string, ingredientName: string; }) => {
                            return {
                                ingredientName: subPartInput.ingredientName.trim(),
                                quantity: parseUnitValInputs(subPartInput.quantity)[0]
                            };
                        };
                        newRecipie.substitutions = values.substitutions.map(substitution => {
                            return {
                                additions: substitution.additions.map(addition => parseSubPart(addition)),
                                removals: substitution.removals.map(removal => parseSubPart(removal))
                            };
                        });
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

                        <label htmlFor="notes">Extra notes</label>
                        <Field name={`notes`} as="textarea" /><br />
                        <ErrorMessage name="notes" />


                        <FieldArray name="ingredients.lists" render={arrayHelpers => (
                            <IngredientsField arrayHelpers={arrayHelpers} />
                        )} />

                        <label htmlFor='servings'>Serves</label>
                        <Field name="servings" type="text" />
                        <ErrorMessage name="servings" />
                        <br />

                        <FieldArray name="instructions" render={arrayHelpers => (
                            <InstructionsField arrayHelpers={arrayHelpers} />
                        )} />
                        <br />

                        <FieldArray name="substitutions" render={arrayHelpers => (
                            <SubstitutionsField arrayHelpers={arrayHelpers} />
                        )} />
                        <br />

                        <input type="submit" name="submit" id="submit-recipie" />
                        <br /><br />
                        <pre>{JSON.stringify(values, null, 2)}</pre>

                    </Form>

                )}
            </Formik>
        </div >
    );
}

export default RecipieForm;
