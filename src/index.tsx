import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import * as ServiceWorkerRegistration from './serviceWorkerRegistration'
import App from './App';
import AddRecipePage from './routes/add-recipe/AddRecipePage';
import EditRecipePage from './routes/edit-recipe/EditRecipePage';
import RecipeSetPage from './routes/home/RecipeSetPage';
import RecipePage from './routes/recipe/RecipePage';
import NotFound from './components-misc/placeholders/NotFound';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<RecipeSetPage />} />
                    <Route path="add-recipe" element={<AddRecipePage />} />
                    <Route path="view-:recipeId" element={<RecipePage />} />
                    <Route path="edit-:recipeId" element={<EditRecipePage />} />
                </Route>
                <Route path="*" element={<NotFound message="Page not found" />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,

    document.getElementById('root')
);

ServiceWorkerRegistration.register();