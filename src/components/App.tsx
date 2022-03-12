import RecipieCardContainer from "./recipies_page/RecipieCardContainer";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <RecipieCardContainer />
      </div>
    </QueryClientProvider>

  );
}

export default App;
