type Props = {
    message: string;
};

const MyError = ({ message }: Props) => (
    <em className="error-message">{message}</em>
);

export default MyError;