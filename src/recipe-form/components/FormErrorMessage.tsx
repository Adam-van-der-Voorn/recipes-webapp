import { useField } from "formik";
import { FieldError } from "react-hook-form";
import { RecipeFormData } from '../components/RecipeForm';

type Props = {
    error?: FieldError;
};

function FormErrorMessage({ error }: Props) {
    if (!error) {
        return null;
    }

    return (
        <div className="error">
            {error.message}
        </div>
    );
}

export default FormErrorMessage;