import { FastField, FieldArray, Form, Formik } from "formik";
import { Recipe } from "../../types/recipeTypes";
import getFullSchema from "../recipeInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import InstructionsField from "./instructions/InstructionsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";
import './RecipeForm.css';
import parseFormData from "../parseFormData";
import FormErrorMessage from "./FormErrorMessage";
import TextAreaAutoHeight from "../../components-misc/TextAreaAutoHeight";
import { useForm, SubmitHandler } from "react-hook-form";

export type RecipeFormData = {
    name: string,
    timeframe: string,
    notes: string,
    ingredients: RecipeInputIngredients,
    servings: string,
    makes: string,
    instructions: RecipeInputInstruction[],
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

export type RecipeInputInstruction = {
    val: string;
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

    const formHelper = useForm<RecipeFormData>();
    const { register, handleSubmit } = formHelper;
    const onSubmit: SubmitHandler<RecipeFormData> = data => console.log(data);

    return (
        <form className="RecipeForm"
            onSubmit={handleSubmit(onSubmit)}
        >
            <input {...register("name")}
                className="title"
                placeholder="Untitled"
                autoComplete="off"
            />
            <InstructionsField formHelper={formHelper} />
            <input type="submit" />
        </form >
    );
}

export default RecipeForm;
