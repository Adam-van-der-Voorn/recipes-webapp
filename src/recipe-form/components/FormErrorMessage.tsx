import { FieldError } from "react-hook-form";

type Props = {
    error?: FieldError | string;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function FormErrorMessage({ error, ...props }: Props) {
    if (!error) {
        return null;
    }

    const message = typeof error === 'string'
        ? error
        : error.message

    return (
        <em className="error" {...props}>
            {message}
        </em>
    );
}

export default FormErrorMessage;