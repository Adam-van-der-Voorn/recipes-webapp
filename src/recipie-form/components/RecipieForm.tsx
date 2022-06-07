import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { Recipie } from "../../types/recipieTypes";
import { parseUnitValInput } from "../parseUnitValInputs";
import getFullSchema from "../recipieInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import InstructionsField from "./InstructionsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";
import './RecipieForm.css';

export type RecipieFormData = {
    name: string,
    timeframe: string,
    notes: string;
    ingredients: RecipieInputIngredients,
    servings: string,
    makes: string;
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
    return (
        <div className="RecipieForm">
            <Formik
                initialValues={initialValues}
                validationSchema={getFullSchema()}
                onSubmit={(values) => {
                    // parse form data
                    const newRecipie: Recipie = {
                        name: values.name.trim(),
                    };

                    if (values.servings !== '') {
                        newRecipie.servings = parseFloat(values.servings);
                    }

                    if (values.timeframe !== '') {
                        newRecipie.timeframe = values.timeframe.trim();
                    }

                    if (values.makes !== '') {
                        newRecipie.makes = parseUnitValInput(values.makes)!;
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
                                            quantity: parseUnitValInput(ingredient.quantity)!,
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
                                quantity: parseUnitValInput(subPartInput.quantity)!
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
                        <Field name="name"
                            type="text"
                            className="title"
                            placeholder="Untitled"
                            autoComplete="off"
                        />
                        <ErrorMessage name="name" />

                        <div className="field-container inline">
                            <label htmlFor="timeframe">Timeframe:</label>
                            <Field name="timeframe"
                                type="text"
                                placeholder="-"
                                autoComplete="off"
                            />
                            <div className="error"><ErrorMessage name="timeframe" /></div>
                        </div>

                        <div className="field-container inline">
                            <label htmlFor="makes">Makes:</label>
                            <Field name="makes"
                                type="text"
                                placeholder="-"
                                autoComplete="off"
                            />
                            <div className="error"><ErrorMessage name="makes" /></div>
                        </div>

                        <div className="field-container inline">
                            <label htmlFor='servings'>Serves:</label>
                            <Field name="servings"
                                type="text"
                                placeholder="-"
                                autoComplete="off"
                            />
                            <div className="error"><ErrorMessage name="servings"/></div>
                        </div>

                        <div className="field-container stacked">
                            <label htmlFor="notes">Extra notes</label>
                            <Field name={`notes`} as="textarea" />
                            <div className="error"><ErrorMessage name="notes" /></div>
                        </div>

                        <FieldArray name="ingredients.lists" render={arrayHelpers => (
                            <IngredientsField arrayHelpers={arrayHelpers} />
                        )} />

                        <FieldArray name="instructions" render={arrayHelpers => (
                            <InstructionsField arrayHelpers={arrayHelpers} />
                        )} />

                        <FieldArray name="substitutions" render={arrayHelpers => (
                            <SubstitutionsField arrayHelpers={arrayHelpers} />
                        )} />

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
