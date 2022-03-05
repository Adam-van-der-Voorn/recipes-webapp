import { dummyData } from "../types/recipieTypes";
import RecipieCardContainer from "./recipies_page/RecipieCardContainer";

function App() {
  return (
    <div className="App">
      <RecipieCardContainer recipieData={dummyData} />
    </div>
  );
}

export default App;
