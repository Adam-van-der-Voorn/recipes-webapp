type Props = {
    message: string;
};

const style: React.CSSProperties = {}
const containerStyle: React.CSSProperties = {}

function NotFound({ message }: Props) {
    return <div style={containerStyle} className="placeholder">
        <em style={style}>{message}</em>
    </div>
}

export default NotFound;