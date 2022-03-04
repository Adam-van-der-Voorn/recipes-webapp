import { RecipieSetFormat } from "../types/recipieTypes";
import RecipieCardContainer from "./recipies_page/RecipieCardContainer";

const dummyData: RecipieSetFormat = {
  recipies: [
    { name: "Toast" },
    { name: "Ham" },
    { name: "Bread" },
    { name: "Steak" }
  ]
}

function App() {
  return (
    <div className="App">
      <RecipieCardContainer recipieData={dummyData} />
    </div>
  );
}

export default App;
