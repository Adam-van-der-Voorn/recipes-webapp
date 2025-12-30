import { Link } from "react-router-dom";

const headerStyle: React.CSSProperties = {
  gridTemplateColumns: "auto 1fr",
};

export default function AddRecipeFromUrlOuter({ children }: any) {
  return (
    <div className="page">
      <header style={headerStyle}>
        <Link to="/" className="headerLink">Home</Link>
        <h1 className="headerTitle">New Recipe from URL</h1>
      </header>
      {children}
    </div>
  );
}
