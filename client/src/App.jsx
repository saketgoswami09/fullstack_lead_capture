import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import AdminPage   from './pages/admin/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
