import { useEffect } from "react";
import { Control, UseFormRegister, useFieldArray, UseFormGetValues, useFormState } from "react-hook-form";
import { RecipeInput } from "../../../types/RecipeInputTypes";
import FormErrorMessage from "../FormErrorMessage";

type FormHelpers = {
    control: Control<RecipeInput, any>;
    getValues: UseFormGetValues<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
};

type Props = {
    index: number;
} & FormHelpers;

function SubstitutionRemovalsField({ index, ...formHelpers }: Props) {
    const { control, register, getValues } = formHelpers;
    const { fields: removals, append, remove } = useFieldArray({ control, name: `substitutions.${index}.removals` as any });
    const errors = useFormState({ control, name: `substitutions.${index}.removals` })
        .errors.substitutions?.at(index)?.removals;

    useEffect(() => {
        if (removals.length === 0) {
            append({ proportion: '', ingredientName: '' });
        }
    }, [removals.length, append]);

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
                        <select {...register(`substitutions.${index}.removals.${idx}`)}>
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
                        <FormErrorMessage error={errors?.at(idx)} />
                    </div>
                ))
            }
            <button type="button" onClick={() => append({ proportion: '', ingredientName: '' })}>
                ++
            </button >
        </div >
    );
}

export default SubstitutionRemovalsField;