import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  return (
    <Link
      to={`/property/${property.slug}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-gray-100 relative">
        {property.images && property.images[0] ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        {property.is_verified && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
            ✓ Verified
          </span>
        )}
        {property.is_featured && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {property.society_name}{property.phase_name ? ` • ${property.phase_name}` : ''}{property.city_name ? ` • ${property.city_name}` : ''}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-emerald-700">
              {property.price != null ? `PKR ${Number(property.price).toLocaleString()}` : 'Price on request'}
            </p>
            <p className="text-xs text-gray-500">{property.property_type}{property.size ? ` • ${property.size}` : ''}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}