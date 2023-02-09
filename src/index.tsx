import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './palette.css';
import './style.css';
import './button.css';
import './icon-button.css'
import * as ServiceWorkerRegistration from './serviceWorkerRegistration'
import App from './App';
import AddRecipePage from './routes/add-recipe/AddRecipePage';
import EditRecipePage from './routes/edit-recipe/EditRecipePage';
import RecipeSetPage from './routes/home/RecipeSetPage';
import RecipePage from './routes/recipe/RecipePage';

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
                <Route path="*" element={<div>BAD PATH !!!!</div>} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,

    document.getElementById('root')
);

ServiceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();