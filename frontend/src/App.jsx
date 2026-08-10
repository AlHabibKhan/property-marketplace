import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import ListProperty from './pages/ListProperty';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-emerald-700">Property Marketplace</Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link to="/" className="text-gray-700 hover:text-emerald-700">Browse</Link>
              <Link to="/list" className="text-gray-700 hover:text-emerald-700">List Property</Link>
              <Link to="/admin" className="text-gray-700 hover:text-emerald-700">Admin</Link>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:slug" element={<PropertyDetail />} />
            <Route path="/list" element={<ListProperty />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}