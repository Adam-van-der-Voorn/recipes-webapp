import { useField } from "formik";
import { RecipieFormData } from '../components/RecipieForm';

type Props = {
    name: string;
};

function FormErrorMessage({ name }: Props) {
    const [input, meta, helpers] = useField<RecipieFormData>(name);
    
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