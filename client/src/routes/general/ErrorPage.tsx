import { Link, useLocation, useRouteError } from "react-router-dom";
import AuthForm from "../../auth/AuthForm.tsx";
import { useContext } from "react";
import { GlobalContext } from "../../contexts/GlobalContext.tsx";

export default function ErrorPage() {
  const error = useRouteError() as any;
  const location = useLocation();

  const { auth } = useContext(GlobalContext);

  console.error("route error:", error);

  if (typeof error?.message === "string") {
    const lower = error.message.toLocaleLowerCase();
    if (lower === "user is null") {
      return <AuthForm auth={auth} />;
    }
  }

  if (typeof error?.status === "number") {
    if (error.status === 404) {
      // TODO put something nice here :)
      return (
        <div className="routeErrorPage">
          <h1>404</h1>
          <p>not found</p>
          <p>{location.pathname}</p>
          <Link to="/" style={{ display: "block" }}>return home</Link>
        </div>
      );
    }
  }

  return (
    <div
      className="routeErrorPage"
      style={{ backgroundColor: "blue", color: "white" }}
    >
      <h1>{`:(`}</h1>
      <p>an unexpected error has occurred.</p>
      <br />
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
