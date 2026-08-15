import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ROLES = {
  seller: { label: 'Seller', desc: 'List your property and track offers', icon: '▼' },
  buyer: { label: 'Buyer', desc: 'Post requirements and send offers', icon: '▲' }
};

export default function LoginPanel() {
  const { user, login, logout } = useAuth();
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const selectRole = r => {
    setRole(r);
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim() && !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    login(role, name.trim(), phone.trim());
    setName('');
    setPhone('');
    setRole(null);
  };

  if (user) {
    const roleLabel = ROLES[user.role]?.label || user.role;
    return (
      <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">
              Signed in as {user.name ? <span className="text-emerald-700">{user.name}</span> : 'Guest'}
            </p>
            <p className="text-sm text-gray-600">
              {roleLabel === 'Seller' ? 'Managing your listings' : 'Managing your requirements'} · {user.phone}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${user.role === 'seller' ? 'bg-emerald-600 text-white' : 'bg-teal-600 text-white'}`}>
              {roleLabel}
            </span>
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-600 border border-gray-300 bg-white px-3 py-1.5 rounded-lg hover:text-red-600 hover:border-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!role) {
    return (
      <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Continue as</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(ROLES).map(([key, r]) => (
            <button
              key={key}
              onClick={() => selectRole(key)}
              className="text-left bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{r.label}</span>
                <span className="text-emerald-600 text-xs">{r.icon}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          No password needed — we identify you by phone number. Your details stay on this device.
        </p>
      </section>
    );
  }

  const r = ROLES[role];
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Continue as {r.label}</h2>
        <button onClick={() => setRole(null)} className="text-sm text-gray-500 hover:text-gray-700">Back</button>
      </div>
      <p className="text-sm text-gray-600 mt-1">Enter your details to get started.</p>
      <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={`Your name`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="0300 1234567"
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className={`${role === 'seller' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-teal-600 hover:bg-teal-700'} text-white font-semibold px-4 py-2 rounded-lg transition-colors`}
        >
          {r.label === 'Seller' ? 'Start Selling' : 'Start Buying'}
        </button>
      </form>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </section>
  );
}