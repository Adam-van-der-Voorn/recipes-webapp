import { useEffect } from "react";
import { Control, UseFormSetValue, UseFormRegister, useFieldArray, UseFormGetValues, useFormState } from "react-hook-form";
import { register } from "../../../serviceWorkerRegistration";
import FormErrorMessage from "../FormErrorMessage";
import { RecipeFormData } from "../RecipeForm";

type FormHelpers = {
    control: Control<RecipeFormData, any>;
    getValues: UseFormGetValues<RecipeFormData>;
    register: UseFormRegister<RecipeFormData>;
};

type Props = {
    index: number;
} & FormHelpers;

function SubstitutionRemovalsField({ index, ...formHelpers }: Props) {
    const { control, register, getValues } = formHelpers;
    const { fields: removals, append, remove } = useFieldArray({ control, name: `substitutions.${index}.removals` });
    const errors = useFormState({ control, name: `substitutions.${index}.removals` })
        .errors.substitutions?.at(index)?.removals;

    useEffect(() => {
        if (removals.length === 0) {
            append({ quantity: '', ingredientName: '' });
        }
    }, []);

    return (
        <div>
            <label>You may substitute</label>
            {
                removals.map((removal, idx) => (
                    <div key={removal.id}>
                        {idx !== 0 &&
                            <button type="button" onClick={() => remove(idx)}>
                                --
                            </button>
                        }
                        <input {...register(`substitutions.${index}.removals.${idx}.quantity`)}
                            type="text"
                            autoComplete="off"
                            placeholder="all"
                        />
                        <span>of</span>
                        <select {...register(`substitutions.${index}.removals.${idx}.ingredientName`)}>
                            <option disabled value="">Select an ingredient</option>
                            {
                                getValues().ingredients.lists
                                    .flatMap(list => list.ingredients)
                                    .map(ingredient => {
                                        const name = ingredient.name;
                                        return <option key={name} value={name.toLowerCase()}>{name}</option>;
                                    })
                            }
                        </select> <br />
                        <FormErrorMessage error={errors?.at(idx)?.ingredientName} /><br />
                        <FormErrorMessage error={errors?.at(idx)?.quantity} />
                    </div>
                ))
            }
            <button type="button" onClick={() => append({ quantity: '', ingredientName: '' })}>
                ++
            </button >
        </div >
    );
}

export default SubstitutionRemovalsField;