import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import ListProperty from './pages/ListProperty';
import Requirements from './pages/Requirements';
import SocietyLanding from './pages/SocietyLanding';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import LegalPage from './pages/LegalPage';
import { legalContent } from './pages/legal-content';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const roleLabel = user?.role === 'seller' ? 'Seller' : user?.role === 'buyer' ? 'Buyer' : null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-emerald-700">Property Marketplace</Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-gray-700 hover:text-emerald-700">Browse</Link>
          <Link to="/list" className="text-gray-700 hover:text-emerald-700">List Property</Link>
          <Link to="/requirements" className="text-gray-700 hover:text-emerald-700">Post Requirement</Link>
          {user ? (
            <>
              <span className="hidden sm:inline-flex items-center gap-2 text-gray-700">
                Hi, <span className="text-emerald-700">{user.name || 'Guest'}</span>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${user.role === 'seller' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'}`}>
                  {roleLabel}
                </span>
              </span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="text-emerald-600 font-semibold hover:text-emerald-700">Login</Link>
          )}
          <Link to="/admin" className="text-gray-700 hover:text-emerald-700">Admin</Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:slug" element={<PropertyDetail />} />
            <Route path="/list" element={<ListProperty />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/:citySlug/:societySlug" element={<SocietyLanding />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/terms" element={<LegalPage {...legalContent.terms} />} />
            <Route path="/privacy" element={<LegalPage {...legalContent.privacy} />} />
            <Route path="/disclaimer" element={<LegalPage {...legalContent.disclaimer} />} />
          </Routes>
        </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}