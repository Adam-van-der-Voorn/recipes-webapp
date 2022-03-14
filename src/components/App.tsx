import { createContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import useCheckUserStatus from '../hooks/auth/user';
import SignIn from "./auth/SignIn";
import RecipieCardContainer from './recipies_page/RecipieCardContainer';

const queryClient = new QueryClient();

export const UserContext: any = createContext(null);

function App() {

    const user = useCheckUserStatus()

    return (
        <QueryClientProvider client={queryClient}>
            <UserContext.Provider value={user}>
                <div className="App">
                    <SignIn />
                    {user !== null &&
                        <RecipieCardContainer />
                    }
                </div>
            </UserContext.Provider>
        </QueryClientProvider>

    );
}

export default App;
