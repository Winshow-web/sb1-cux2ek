import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './user/App.tsx';
import Admin from './admin/App.tsx';
import './index.css';

const baseUrl = (import.meta as any).env.VITE_SERVER_URL;

createRoot(document.getElementById('root')!).render(
    <Router>
        <Routes>
            <Route path="/*" element={
                <App
                    baseUrl={baseUrl}
                />} />
            <Route path="/admin/*" element={
                <Admin
                    baseUrl={baseUrl}
                />} />
        </Routes>
    </Router>
);
