type Props = {
    message: string;
};

const MyError = ({ message }: Props) => (
    <div className="error-message">{message}</div >
);

export default MyError;