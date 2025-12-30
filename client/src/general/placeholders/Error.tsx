type Props = {
  message: string;
};

const style: React.CSSProperties = {};
const containerStyle: React.CSSProperties = {};

function Error({ message }: Props) {
  return (
    <div style={containerStyle} className="placeholder">
      <em style={style}>{message}</em>
    </div>
  );
}

export default Error;
