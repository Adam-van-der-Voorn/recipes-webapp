import { Recipe } from "../../types/recipeTypes";
import getFullSchema from "../recipeInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";
import style from './RecipeForm.module.css';
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
        <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
            <input {...register("name")}
                type="text"
                className={style.recipeName}
                placeholder="Untitled"
                autoComplete="off"
                aria-label="recipie name"
            />

            <section className={style.meta}>
                <label htmlFor="timeframe" className={style.metaLabel}>Timeframe</label>
                <input {...register("timeframe")}
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                />

                <label htmlFor="makes" className={style.metaLabel}>Yields</label>
                <input {...register("makes")}
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                />

                <label htmlFor="servings" className={style.metaLabel}>Serves</label>
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

            <div className={style.notes}>
                <label htmlFor="notes">Extra notes</label>
                <TextAreaAutoHeight {...register("notes")} defaultHeight={'0'} className={style.multiLine} />
                <FormErrorMessage error={errors.notes} />
            </div>

            <IngredientsField {...{ control, register, getValues, setValue }} />

            <SubstitutionsField {...{ control, setValue }} />

            <div className={style.instructions}>
                <label htmlFor="instructions" className="h-2">Instructions</label>
                <TextAreaAutoHeight {...register("instructions")} defaultHeight={'0'} className={style.multiLine} />
                <FormErrorMessage error={errors.instructions} />
            </div>

            <input type="submit" />
        </form >
    );
}

export default RecipeForm;
