import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Recipe } from "../../types/recipeTypes.ts";
import RecipeForm from "../../recipe-form/components/RecipeForm.tsx";
import { v4 as uuid4 } from "uuid";
import { GlobalContext } from "../../contexts/GlobalContext.tsx";
import AuthGate from "../../auth/AuthGate.tsx";
import { isAuthed } from "../../util/auth.ts";

const headerStyle: React.CSSProperties = {
  gridTemplateColumns: "auto 1fr auto",
};

const FORM_ID = "add-recipe";

function AddRecipePage() {
  const { user, addRecipe } = useContext(GlobalContext);
  const navigate = useNavigate();

  const doSubmit = (recipe: Recipe) => {
    addRecipe(recipe, (id) => {
      navigate(`/view/${id}`, { replace: true });
    });
  };

  const initialValues = {
    name: "",
    timeframe: "",
    makes: "",
    notes: "",
    ingredients: {
      lists: [{
        id: uuid4(),
        name: "Main",
        ingredients: [],
      }],
      anchor: 0,
    },
    servings: "",
    instructions: "",
    substitutions: [],
  };

  return (
    <div className="page">
      <header style={headerStyle}>
        <Link to="/" className="headerLink">Home</Link>
        <h1 className="headerTitle">New Recipe</h1>
        <input
          type="submit"
          value="Save"
          form={FORM_ID}
          className="headerButton primary"
          disabled={user === "pre-auth" || user === null}
        />
      </header>
      <AuthGate>
        <main aria-details="add a new recipe">
          <RecipeForm
            id={FORM_ID}
            onSubmit={doSubmit}
            initialValues={initialValues}
          />
        </main>
      </AuthGate>
    </div>
  );
}

export default AddRecipePage;
