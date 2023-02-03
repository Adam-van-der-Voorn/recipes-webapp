import { FieldError } from "react-hook-form";

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