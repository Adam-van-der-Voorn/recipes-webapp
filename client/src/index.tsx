import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root.tsx';
import ErrorPage from './routes/general/ErrorPage.tsx';
import AddRecipePage from './routes/add-recipe/AddRecipePage.tsx';
import EditRecipePage from './routes/edit-recipe/EditRecipePage.tsx';
import RecipePage from './routes/recipe/RecipePage.tsx';
import MyRecipesPage from './routes/home/MyRecipesPage.tsx';
import AddRecipeFromUrlPage from './routes/add-recipe-from-url/AddRecipeFromUrlPage.tsx';
import AddRecipeFromUrlEditPage from './routes/add-recipe-from-url_edit/AddRecipeFromUrlEditPage.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <MyRecipesPage />
            },
            {
                path: "add-recipe",
                element: <AddRecipePage />,
            },
            {
                path: "add-recipe-from-url",
                element: <AddRecipeFromUrlPage />,
            },
            {
                path: "add-recipe-from-url/edit",
                element: <AddRecipeFromUrlEditPage />,
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
 }
 