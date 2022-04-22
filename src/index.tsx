import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './palette.css';
import './style.css';
import * as ServiceWorkerRegistration from './serviceWorkerRegistration'
import App from './App';
import AddRecipiePage from './routes/add-recipie/AddRecipiePage';
import EditRecipiePage from './routes/edit-recipie/EditRecipiePage';
import RecipieSetPage from './routes/home/RecipieSetPage';
import RecipiePage from './routes/recipie/RecipiePage';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<RecipieSetPage />} />
                    <Route path="add-recipie" element={<AddRecipiePage />} />
                    <Route path=":recipieName" element={<RecipiePage />} />
                    <Route path="edit-:recipieName" element={<EditRecipiePage />} />
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