import { Field, FieldArray, Form, Formik } from "formik";
import { Recipe } from "../../types/recipeTypes";
import getFullSchema from "../recipeInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import InstructionsField from "./instructions/InstructionsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";
import './RecipeForm.css';
import parseFormData from "../parseFormData";
import FormErrorMessage from "./FormErrorMessage";
import TextAreaAutoHeight from "../../components-misc/TextAreaAutoHeight";

export type RecipeFormData = {
    name: string,
    timeframe: string,
    notes: string;
    ingredients: RecipeInputIngredients,
    servings: string,
    makes: string;
    instructions: string[],
    substitutions: RecipeInputSubstitutions,
};

export type RecipeInputIngredient = {
    name: string,
    quantity: string,
    optional: boolean,
    percentage: string,
};

export type RecipeInputIngredients = {
    lists: {
        name: string;
        ingredients: RecipeInputIngredient[];
    }[];
    anchor: number,
};

export type RecipeInputSubstitutions = {
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
    doSubmit: (recipe: Recipe) => void;
    initialValues: RecipeFormData;
};

function RecipeForm({ doSubmit, initialValues }: Props) {
    return (
        <div className="RecipeForm">
            <Formik
                initialValues={initialValues}
                validationSchema={getFullSchema()}
                onSubmit={(values) => {
                    const newRecipe = parseFormData(values);

                    // do something with the data
                    doSubmit(newRecipe);
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

                        <input type="submit" name="submit" id="submit-recipe" />
                        <br /><br />
                        <pre>{JSON.stringify(values, null, 2)}</pre>

                    </Form>

                )}
            </Formik>
        </div >
    );
}

export default RecipeForm;
