import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyListings, fetchReceivedOffers } from '../api/client';

const STATUS_BADGE = {
  active: 'bg-emerald-100 text-emerald-800',
  pending_review: 'bg-amber-100 text-amber-800',
  flagged: 'bg-red-100 text-red-800'
};
const STATUS_LABEL = {
  active: 'Live',
  pending_review: 'Pending Review',
  flagged: 'Flagged'
};

function fmtPrice(p) {
  if (p == null) return '—';
  return 'PKR ' + Number(p).toLocaleString('en-PK');
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState(null);
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchMyListings(user.phone), fetchReceivedOffers(user.phone)])
      .then(([l, o]) => {
        setListings(Array.isArray(l) ? l : []);
        setOffers(Array.isArray(o) ? o : []);
      })
      .catch(() => {
        setListings([]);
        setOffers([]);
      });
  }, [user]);

  if (!listings || !offers) {
    return <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-gray-500">Loading your dashboard...</section>;
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Seller Dashboard</h2>
          <p className="text-sm text-gray-600">Your listings and buyer offers.</p>
        </div>
        <Link
          to="/list"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + List New Property
        </Link>
      </div>

      <h3 className="mt-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">Your Listings ({listings.length})</h3>
      {listings.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">
          You haven't listed any properties yet.{' '}
          <Link to="/list" className="text-emerald-600 underline">List your first property</Link>
        </p>
      ) : (
        <div className="mt-2 space-y-2">
          {listings.map(p => (
            <div key={p.id} className="border border-gray-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <Link to={`/property/${p.slug}`} className="font-medium text-gray-900 hover:text-emerald-700">{p.title}</Link>
                <p className="text-sm text-gray-500">
                  {p.city_name}{p.society_name ? `, ${p.society_name}` : ''} · {fmtPrice(p.price)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">{p.offer_count ?? 0} offers</span>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[p.status] || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABEL[p.status] || p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="mt-6 font-semibold text-gray-800 text-sm uppercase tracking-wide">Offers Received ({offers.length})</h3>
      {offers.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">No offers yet. Buyers will reach out once your listings go live.</p>
      ) : (
        <div className="mt-2 space-y-2">
          {offers.map(o => (
            <div key={o.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-gray-900">
                  {o.buyer_name || 'Buyer'} <span className="text-sm text-gray-500">({o.buyer_phone})</span>
                </p>
                <span className="text-sm text-gray-600">{fmtPrice(o.offer_price)}</span>
              </div>
              <Link to={`/property/${o.property_slug}`} className="text-sm text-emerald-600 hover:underline">{o.property_title}</Link>
              {o.message && <p className="text-sm text-gray-600 mt-1">{o.message}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(o.created_at).toLocaleDateString()} · {o.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}