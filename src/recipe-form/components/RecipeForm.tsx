import { Recipe } from "../../types/recipeTypes";
import getFullSchema from "../recipeInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";

import parseFormData from "../parseFormData";
import FormErrorMessage from "./FormErrorMessage";
import TextAreaAutoHeight from "../../components-misc/TextAreaAutoHeight";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { RecipeInput } from "../../types/RecipeInputTypes";

type Props = {
    doSubmit: (recipe: Recipe) => void;
    initialValues: RecipeInput;
};

function RecipeForm({ doSubmit, initialValues }: Props) {

    const formHelper = useForm<RecipeInput>({
        resolver: yupResolver(getFullSchema()),
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        defaultValues: initialValues
    });

    const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = formHelper;

    const onSubmit: SubmitHandler<RecipeInput> = data => {
        const parsed = parseFormData(data);
        doSubmit(parsed);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <input {...register("name")}
                type="text"
                className="recipeName"
                placeholder="Untitled"
                autoComplete="off"
                aria-label="recipie name"
            />

            <section className="meta">
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
                <TextAreaAutoHeight {...register("notes")} defaultHeight={'0'} className="multiLine" />
                <FormErrorMessage error={errors.notes} />
            </div>

            <IngredientsField {...{ control, register, getValues, setValue }} />

            <SubstitutionsField {...{ control, setValue }} />

            <div className="instructions">
                <label htmlFor="instructions" className="h-2">Instructions</label>
                <TextAreaAutoHeight {...register("instructions")} defaultHeight={'0'} className="multiLine" />
                <FormErrorMessage error={errors.instructions} />
            </div>

            <input type="submit" />
        </form >
    );
}

export default RecipeForm;
