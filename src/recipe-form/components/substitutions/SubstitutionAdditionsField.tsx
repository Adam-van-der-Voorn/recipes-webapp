import { useEffect } from "react";
import { Control, useFieldArray, UseFormRegister, useFormState } from "react-hook-form";
import FormErrorMessage from "../FormErrorMessage";
import { RecipeFormData } from "../RecipeForm";

type FormHelpers = {
    control: Control<RecipeFormData, any>;
    register: UseFormRegister<RecipeFormData>;
};

type Props = {
    index: number;
} & FormHelpers;

function SubstitutionAdditionsField({ index, ...formHelpers }: Props) {
    const { control, register } = formHelpers;
    const { fields: additions, append, remove } = useFieldArray({ control, name: `substitutions.${index}.additions` });
    const errors = useFormState({ control, name: `substitutions.${index}.additions` })
        .errors.substitutions?.at(index)?.additions;

    useEffect(() => {
        if (additions.length === 0) {
            append({ quantity: '', ingredientName: '' });
        }
    }, []);

    return (
        <div>
            <p>with...</p>
            {
                additions.map((addition, idx) => (
                    <div key={addition.id}>
                        {idx !== 0 &&
                            <button type="button" onClick={() => remove(idx)}>
                                --
                            </button>
                        }
                        <input {...register(`substitutions.${index}.additions.${idx}.quantity`)}
                            autoComplete="off"
                        />
                        <span>of</span>
                        <input {...register(`substitutions.${index}.additions.${idx}.ingredientName`)}
                            type="text"
                            autoComplete="off"
                        />
                        <br />
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

export default SubstitutionAdditionsField;