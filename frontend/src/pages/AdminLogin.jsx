import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Store password, then verify against a protected endpoint.
    sessionStorage.setItem('adminPassword', password);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/offers`, {
      headers: { 'x-admin-password': password }
    });

    setLoading(false);
    if (res.ok) {
      sessionStorage.setItem('adminPassword', password);
      navigate(from, { replace: true });
    } else {
      sessionStorage.removeItem('adminPassword');
      setError('Incorrect admin password.');
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Login</h1>
      <p className="text-sm text-gray-500 mb-5">Enter the admin password to continue.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Admin password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  );
}