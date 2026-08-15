import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LocationSelector from '../components/LocationSelector';
import PropertyCard from '../components/PropertyCard';
import LoginPanel from '../components/LoginPanel';
import SellerDashboard from '../components/SellerDashboard';
import BuyerDashboard from '../components/BuyerDashboard';
import { useAuth } from '../context/AuthContext';
import { fetchProperties } from '../api/client';

export default function Home() {
  const { user } = useAuth();
  const [location, setLocation] = useState({ city_id: '', society_id: '', phase_id: '' });
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProperties(); }, [location, propertyType, minPrice, maxPrice]);

  async function loadProperties() {
    setLoading(true);
    const filters = {
      ...(location.city_id ? { city_id: location.city_id } : {}),
      ...(location.society_id ? { society_id: location.society_id } : {}),
      ...(location.phase_id ? { phase_id: location.phase_id } : {}),
      ...(propertyType ? { property_type: propertyType } : {}),
      ...(minPrice ? { min_price: minPrice } : {}),
      ...(maxPrice ? { max_price: maxPrice } : {})
    };
    const data = await fetchProperties(filters);
    setProperties(data);
    setLoading(false);
  }

  const selectCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      <LoginPanel />

      {user?.role === 'seller' && <SellerDashboard />}
      {user?.role === 'buyer' && <BuyerDashboard />}

      <section className="bg-emerald-700 text-white rounded-xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold">Find Your Next Property</h1>
        <p className="mt-2 text-emerald-100">Browse verified plots, houses, and apartments across Pakistan.</p>
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className={labelCls}>Location</label>
            <LocationSelector onChange={setLocation} />
          </div>
          <div>
            <label className={labelCls}>Property Type</label>
            <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className={selectCls}>
              <option value="">Any</option>
              <option value="House">House</option>
              <option value="Flat">Flat / Apartment</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Min Price (PKR)</label>
            <input type="number" min="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} className={selectCls} placeholder="e.g. 5,000,000" />
          </div>
          <div>
            <label className={labelCls}>Max Price (PKR)</label>
            <input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={selectCls} placeholder="e.g. 50,000,000" />
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No properties found. Try adjusting your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>

      <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h2 className="font-semibold text-amber-900">Important Notice</h2>
        <p className="text-sm text-amber-800 leading-relaxed mt-2">
          Property Marketplace is a listing and lead-connection platform only. We are not a real estate agent,
          broker, or legal adviser. All listings are user-submitted and may not be independently verified — a
          "Verified" badge reflects an administrative review only. Before buying or selling, always verify ownership
          documents, NOC and society approvals, and transfer processes with qualified professionals.
        </p>
        <Link
          to="/disclaimer"
          className="inline-block mt-3 text-sm font-medium text-amber-900 underline hover:text-amber-700"
        >
          Read full disclaimer
        </Link>
      </section>
    </div>
  );
}