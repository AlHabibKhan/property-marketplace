import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyRequirements, fetchMyOffers } from '../api/client';

function fmtPrice(p) {
  if (p == null) return '—';
  return 'PKR ' + Number(p).toLocaleString('en-PK');
}

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState(null);
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchMyRequirements(user.phone), fetchMyOffers(user.phone)])
      .then(([r, o]) => {
        setRequirements(Array.isArray(r) ? r : []);
        setOffers(Array.isArray(o) ? o : []);
      })
      .catch(() => {
        setRequirements([]);
        setOffers([]);
      });
  }, [user]);

  if (!requirements || !offers) {
    return <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-500">Loading your dashboard...</section>;
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Buyer Dashboard</h2>
          <p className="text-sm text-gray-600">Your requirements and offers.</p>
        </div>
        <Link
          to="/requirements"
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + Post New Requirement
        </Link>
      </div>

      <h3 className="mt-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">Your Requirements ({requirements.length})</h3>
      {requirements.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">
          You haven't posted any requirements yet.{' '}
          <Link to="/requirements" className="text-teal-600 underline">Tell us what you're looking for</Link>
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {requirements.map(r => (
            <div key={r.id} className="border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">
                  {r.property_type || 'Property'}{r.society_name ? ` in ${r.society_name}` : ''}
                </p>
                <p className="text-sm text-gray-500">
                  {r.city_name || 'Anywhere'}{r.society_name ? `, ${r.society_name}` : ''} · Budget up to {fmtPrice(r.budget_max)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">{r.matching_properties ?? 0} matching listings</span>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="mt-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">Offers You've Made ({offers.length})</h3>
      {offers.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">
          No offers yet.{' '}
          <Link to="/" className="text-teal-600 underline">Browse properties to make an offer</Link>
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {offers.map(o => (
            <div key={o.id} className="border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <Link to={`/property/${o.property_slug}`} className="font-medium text-gray-900 hover:text-teal-700">{o.property_title}</Link>
                <p className="text-sm text-gray-500">
                  {o.city_name || ''}{o.society_name ? `, ${o.society_name}` : ''} · Offer: {fmtPrice(o.offer_price)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">{new Date(o.created_at).toLocaleDateString()}</span>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}