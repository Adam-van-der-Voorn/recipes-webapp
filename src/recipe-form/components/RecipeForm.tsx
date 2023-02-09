import { Recipe } from "../../types/recipeTypes";
import getFullSchema from "../recipeInputSchema";
import IngredientsField from "./ingredients/IngredientsField";
import SubstitutionsField from "./substitutions/SubstitutionsField";
import './RecipeForm.css';
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

    const { register, handleSubmit, control, setValue, getValues, formState: { errors }} = formHelper;

    const onSubmit: SubmitHandler<RecipeInput> = data => {
        const parsed = parseFormData(data);
        doSubmit(parsed);
    };

    return (
        <div className="RecipeForm">
            <form onSubmit={handleSubmit(onSubmit)} >
                <input {...register("name")}
                    className="title"
                    placeholder="Untitled"
                    autoComplete="off"
                />
                <FormErrorMessage error={errors.name} />

                <div className="field-container inline">
                    <label htmlFor="timeframe">Timeframe:</label>
                    <input {...register("timeframe")}
                        type="text"
                        placeholder="-"
                        autoComplete="off"
                    />
                    <FormErrorMessage error={errors.timeframe} />
                </div>

                <div className="field-container inline">
                    <label htmlFor="makes">Makes:</label>
                    <input {...register("makes")}
                        type="text"
                        placeholder="-"
                        autoComplete="off"
                    />
                    <FormErrorMessage error={errors.makes} />
                </div>

                <div className="field-container inline">
                    <label htmlFor='servings'>Serves:</label>
                    <input {...register("servings")}
                        type="text"
                        placeholder="-"
                        autoComplete="off"
                    />
                    <FormErrorMessage error={errors.servings} />
                </div>

                <div className="field-container stacked">
                    <label htmlFor="notes">Extra notes</label>
                    <TextAreaAutoHeight {...register("notes")} defaultHeight={'112px'} />
                    <FormErrorMessage error={errors.notes} />
                </div>

                <IngredientsField {...{control, register, getValues, setValue}} />

                <SubstitutionsField {...{control, setValue}} />

                <div className="field-container stacked">
                    <label htmlFor="instructions">Instructions</label>
                    <TextAreaAutoHeight {...register("instructions")} defaultHeight={'112px'} />
                    <FormErrorMessage error={errors.instructions} />
                </div>
                
                <input type="submit" />
            </form >
        </div>
    );
}

export default RecipeForm;
