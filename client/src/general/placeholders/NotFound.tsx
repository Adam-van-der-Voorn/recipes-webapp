type Props = {
    message: string;
};

const style: React.CSSProperties = {
    fontSize: "var(--font-size-large)",
    flex: "0 0 auto"
}

const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
}

function NotFound({ message }: Props) {
    return <div style={containerStyle}>
        <em style={style}>{message}</em>
    </div>
}

export default NotFound;