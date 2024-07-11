import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import * as ServiceWorkerRegistration from './serviceWorkerRegistration';
import Root from './routes/Root';
import ErrorPage from './routes/general/ErrorPage';
import AddRecipePage from './routes/add-recipe/AddRecipePage';
import EditRecipePage from './routes/edit-recipe/EditRecipePage';
import RecipePage from './routes/recipe/RecipePage';
import RecipeSetPage from './routes/home/RecipeSetPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <RecipeSetPage />
            },
            {
                path: "add-recipe",
                element: <AddRecipePage />,
            },
            {
                path: "view/:recipeId",
                element: <RecipePage />,
            },
            {
                path: "edit/:recipeId",
                element: <EditRecipePage />,
            },
        ],
    },
]);

ReactDOM.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,

    document.getElementById('root')
);

ServiceWorkerRegistration.register();