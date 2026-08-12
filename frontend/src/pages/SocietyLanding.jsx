import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSocietyBySlug, fetchProperties } from '../api/client';
import PropertyCard from '../components/PropertyCard';

export default function SocietyLanding() {
  const { citySlug, societySlug } = useParams();
  const [location, setLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSocietyBySlug(citySlug, societySlug)
      .then(async data => {
        if (data.error) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setLocation(data);
        document.title = `${data.society_name} Properties for Sale in ${data.city_name}`;
        const props = await fetchProperties({ society_id: data.society_id });
        setProperties(props);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [citySlug, societySlug]);

  if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;
  if (notFound || !location) {
    return <p className="text-center text-red-600 py-10">Location not found.</p>;
  }

  return (
    <div className="space-y-6">
      <section className="bg-emerald-700 text-white rounded-xl p-6 md:p-10">
        <p className="text-emerald-200 text-sm uppercase tracking-wide">{location.city_name}</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">
          {location.society_name} Properties for Sale
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to={`/list?city_id=${location.city_id}&society_id=${location.society_id}`}
            className="bg-white text-emerald-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            List your property here
          </Link>
          <Link
            to={`/requirements?city_id=${location.city_id}&society_id=${location.society_id}`}
            className="bg-emerald-600 text-white font-medium text-sm px-4 py-2 rounded-lg border border-emerald-400 hover:bg-emerald-800 transition-colors"
          >
            Post a requirement
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {properties.length > 0
            ? `${properties.length} active listing${properties.length === 1 ? '' : 's'}`
            : 'Active listings'}
        </h2>
        {properties.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No active listings in {location.society_name} yet. Be the first to list one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}