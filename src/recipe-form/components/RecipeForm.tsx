import { Recipe } from "../../types/recipeTypes";
import getFullSchema from "../recipeInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";

import parseFormData from "../parseFormData";
import FormErrorMessage from "./FormErrorMessage";
import TextAreaAutoHeight from "../../general/TextAreaAutoHeight";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { RecipeInput } from "../../types/RecipeInputTypes";

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

    const formHelper = useForm<RecipeInput>({
        resolver: yupResolver(getFullSchema()),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: initialValues
    });

    const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = formHelper;

    const onSubmit: SubmitHandler<RecipeInput> = data => {
        const parsed = parseFormData(data);
        doSubmitAction(parsed);
    };

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="recipeForm">
            <input {...register("name")}
                type="text"
                className="recipeName"
                placeholder="Untitled"
                autoComplete="off"
                aria-label="recipie name"
            />

            <section className="recipeFormMeta">
                <label htmlFor="timeframe" className="metaLabel">Timeframe</label>
                <input {...register("timeframe")}
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                />

                <label htmlFor="makes" className="metaLabel">Yields</label>
                <input {...register("makes")}
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                />

                <label htmlFor="servings" className="metaLabel">Serves</label>
                <input {...register("servings")}
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
                <TextAreaAutoHeight lineHeight={standardLineHeight} {...register("notes")} />
                <FormErrorMessage error={errors.notes} />
            </div>

            <IngredientsField {...{ control, register, getValues, setValue }} />

            <SubstitutionsField {...{ control, setValue }} />

            <div className="instructions">
                <label htmlFor="instructions" className="h-2">Instructions</label>
                <TextAreaAutoHeight lineHeight={standardLineHeight} {...register("instructions")} />
                <FormErrorMessage error={errors.instructions} />
            </div>
        </form >
    );
}

export default RecipeForm;
