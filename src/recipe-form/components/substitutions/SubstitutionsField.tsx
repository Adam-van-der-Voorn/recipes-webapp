import { useState } from "react";
import { Control, UseFormGetValues, UseFormRegister, useFieldArray } from "react-hook-form";
import Dialog from "../../../components-misc/Dialog";
import { RecipeInput } from "../../../types/RecipeInputTypes";
import SubstitutionAdditionsField from "./SubstitutionAdditionsField";
import SubstitutionRemovalsField from "./SubstitutionRemovalsField";

type FormHelpers = {
    control: Control<RecipeInput, any>;
    getValues: UseFormGetValues<RecipeInput>;
    register: UseFormRegister<RecipeInput>;
};

type Props = {} & FormHelpers;

function SubstitutionsField({ ...formHelpers }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const { control, register, getValues } = formHelpers;
    const { fields: substitutions, remove, append } = useFieldArray({ control, name: "substitutions" });

    return (
        <div>
            <button type="button" onClick={() => setIsOpen(true)}>show/hide</button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <>
                    <h2>Substitutions</h2>
                    {
                        substitutions.map((substitution, index) => (
                            <div key={substitution.id}>
                                <button type="button" onClick={() => remove(index)}>
                                    -
                                </button>
                                <SubstitutionRemovalsField index={index}
                                    {...{ control, register, getValues }}
                                />
                                <SubstitutionAdditionsField index={index}
                                    {...{ control, register }}
                                />
                                <hr />
                            </div>
                        ))
                    }
                    <button type="button" onClick={() => append({ additions: [], removals: [] })}>
                        +
                    </button >
                </>
            </Dialog>
        </div >
    );
};

export default SubstitutionsField;