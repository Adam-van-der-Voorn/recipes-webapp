import { FieldError } from "react-hook-form";

type Props = {
    error?: FieldError;
};

function FormErrorMessage({ error }: Props) {
    if (!error) {
        return null;
    }

    return (
        <em className="error">
            {error.message}
        </em>
    );
}

export default FormErrorMessage;