import { useField } from "formik";
import { RecipeFormData } from '../components/RecipeForm';

type Props = {
    name: string;
};

function FormErrorMessage({ name }: Props) {
    const [input, meta, helpers] = useField<RecipeFormData>(name);
    
    const hasError = meta.error && meta.touched;

    if (!hasError) {
        return null;
    }

    return (
        <div className="error">
            {meta.error}
        </div>
    );
}

export default FormErrorMessage;