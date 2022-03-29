import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import './palette.css';
import './style.css';
import AddRecipiePage from './components/routes/add-recipie/AddRecipiePage';
import RecipieSetPage from './components/routes/home/RecipieSetPage';
import RecipiePage from './components/routes/recipie/RecipiePage';
import * as ServiceWorkerRegistration from './serviceWorkerRegistration'

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<RecipieSetPage />} />
                    <Route path="add-recipie" element={<AddRecipiePage />} />
                    <Route path=":recipieName" element={<RecipiePage />} />
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