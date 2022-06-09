import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { Recipie } from "../../types/recipieTypes";
import { parseUnitValInput } from "../parseUnitValInputs";
import getFullSchema from "../recipieInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import InstructionsField from "./InstructionsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";
import './RecipieForm.css';
import parseFormData from "./parseFormData";
import FormErrorMessage from "./FormErrorMessage";
import TextAreaAutoHeight from "../../components-misc/TextAreaAutoHeight";

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
                    const newRecipie = parseFormData(values);

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
                        <FormErrorMessage name="name" />

                        <div className="field-container inline">
                            <label htmlFor="timeframe">Timeframe:</label>
                            <Field name="timeframe"
                                type="text"
                                placeholder="-"
                                autoComplete="off"
                            />
                            <FormErrorMessage name="timeframe" />
                        </div>

                        <div className="field-container inline">
                            <label htmlFor="makes">Makes:</label>
                            <Field name="makes"
                                type="text"
                                placeholder="-"
                                autoComplete="off"
                            />
                            <FormErrorMessage name="makes" />
                        </div>

                        <div className="field-container inline">
                            <label htmlFor='servings'>Serves:</label>
                            <Field name="servings"
                                type="text"
                                placeholder="-"
                                autoComplete="off"
                            />
                            <FormErrorMessage name="servings"/>
                        </div>

                        <div className="field-container stacked">
                            <label htmlFor="notes">Extra notes</label>
                            <TextAreaAutoHeight name={`notes`} defaultHeight={'112px'} />
                            <FormErrorMessage name="notes" />
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
