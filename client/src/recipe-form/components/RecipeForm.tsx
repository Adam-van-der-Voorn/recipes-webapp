import { Recipe } from "../../types/recipeTypes.ts";
import IngredientsField from "./ingredients/IngredientsField.tsx";
import SubstitutionsField from "./substitutions/SubstitutionsField.tsx";

import parseFormData from "../parseFormData.ts";
import FormErrorMessage from "./FormErrorMessage.tsx";
import TextAreaAutoHeight from "../../general/TextAreaAutoHeight.tsx";
import { useForm, SubmitHandler, RegisterOptions } from "react-hook-form";
import { RecipeInput } from "../../types/RecipeInputTypes.ts";
import { usePreventUnload } from "../../util/hooks/usePreventUnload.ts";

export const RECIPE_FORM_INPUT_REASONABLE_LEN = 1000;
export const RECIPE_FORM_TEXTAREA_REASONABLE_LEN = 50_000;


type Props = {
    id?: string,
    onSubmit: (recipe: Recipe) => void;
    initialValues: RecipeInput;
};

const standardLineHeightStr = getComputedStyle(document.documentElement)
    .getPropertyValue("--line-height-default");
let standardLineHeight = parseFloat(standardLineHeightStr);
if (isNaN(standardLineHeight)) {
    console.log("--line-height-default is NaN falling back to 1.2 for textarea")
    standardLineHeight = 1.2;
}

function RecipeForm({ id, onSubmit: doSubmitAction, initialValues }: Props) {
    const formHelper = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: initialValues
    });

    const { 
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors, isDirty },
        trigger
    } = formHelper;

    usePreventUnload(isDirty)

    const onSubmit: SubmitHandler<RecipeInput> = data => {
        const parsed = parseFormData(data);
        doSubmitAction(parsed);
    };

    const nameValidation: RegisterOptions<RecipeInput, "name"> = { 
        required: { value: true, message: "Ingredient name is required"},
        maxLength: { value: RECIPE_FORM_INPUT_REASONABLE_LEN, "message": "This ingredient name is far too long" }
    }
    const timeframeValidation: RegisterOptions<RecipeInput, "timeframe"> = { 
        maxLength: { value: RECIPE_FORM_INPUT_REASONABLE_LEN, "message": "Takes far too much time" }
    }
    const makesValidation: RegisterOptions<RecipeInput, "makes"> = {
        maxLength: { value: RECIPE_FORM_INPUT_REASONABLE_LEN, "message": "Yields far too much food" }
    }
    const servingsValidation: RegisterOptions<RecipeInput, "servings"> = {
        maxLength: { value: RECIPE_FORM_INPUT_REASONABLE_LEN, "message": "Serves for too many people" }
    }
    const notesValidation: RegisterOptions<RecipeInput, "servings"> = {
        maxLength: { value: RECIPE_FORM_INPUT_REASONABLE_LEN, "message": "Is this a novel? Please write less notes." }
    }
    const instructionsValidation: RegisterOptions<RecipeInput, "servings"> = {
        maxLength: { value: RECIPE_FORM_INPUT_REASONABLE_LEN, "message": "Is this a manifesto? Please write less instructions." }
    }

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="recipeForm">
            <input {...register("name", nameValidation)}
                type="text"
                className="recipeName"
                placeholder="Untitled"
                autoComplete="off"
                aria-label="recipe name"
            />

            <section className="recipeFormMeta">
                <label htmlFor="timeframe" className="metaLabel">Timeframe</label>
                <input {...register("timeframe", timeframeValidation)}
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                />

                <label htmlFor="makes" className="metaLabel">Yields</label>
                <input {...register("makes", makesValidation)}
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                />

                <label htmlFor="servings" className="metaLabel">Serves</label>
                <input {...register("servings", servingsValidation)}
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                />
            </section>
            <FormErrorMessage error={errors.name} />
            <FormErrorMessage error={errors.timeframe} />
            <FormErrorMessage error={errors.makes} />
            <FormErrorMessage error={errors.servings} />

            <div className="notes">
                <label htmlFor="notes">Extra notes</label>
                <TextAreaAutoHeight {...register("notes", notesValidation)} lineHeight={standardLineHeight} defaultLines={1} />
                <FormErrorMessage error={errors.notes} />
            </div>

            <IngredientsField {...{ control, register, getValues, setValue, trigger }} />

            <SubstitutionsField {...{ control, setValue }} />

            <div className="instructions">
                <label htmlFor="instructions" className="h-2">Instructions</label>
                <TextAreaAutoHeight {...register("instructions", instructionsValidation)} lineHeight={standardLineHeight} defaultLines={1} />
                <FormErrorMessage error={errors.instructions} />
            </div>
        </form >
    );
}

export default RecipeForm;
