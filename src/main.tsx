//import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import Admin from "./admin/Admin";
import './index.css';


createRoot(document.getElementById('root')!).render(
    //<StrictMode>
    <Router>
        <Routes>
            <Route path="*" element={<App />} />        {/* Default user Page */}
            <Route path="/admin" element={<Admin />} /> {/* admin Page */}
        </Routes>
    </Router>
    //</StrictMode>
);
