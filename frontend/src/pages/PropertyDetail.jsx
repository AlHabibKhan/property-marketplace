import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProperty, reportProperty } from '../api/client';
import OfferForm from '../components/OfferForm';

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  useEffect(() => {
    fetchProperty(slug)
      .then(data => {
        if (data.error) setError(data.error);
        else setProperty(data);
      })
      .catch(() => setError('Failed to load property'));
  }, [slug]);

  const handleReport = async () => {
    const res = await reportProperty(property.property_code, { reason: reportReason });
    if (res.success) {
      setReportStatus(`Report submitted. Thank you for helping keep listings trustworthy.`);
      setReportOpen(false);
      setReportReason('');
    } else {
      setReportStatus(res.error || 'Failed to submit report.');
    }
  };

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>;
  }

  if (!property) {
    return <p className="text-center text-gray-500 py-10">Loading property...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {property.images && property.images[0] ? (
          <img src={property.images[0]} alt={property.title} className="w-full max-h-[420px] object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {property.property_code}
            </span>
            {property.is_verified && (
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">✓ Verified</span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-600 mt-2">
            {property.society_name}{property.phase_name ? `, ${property.phase_name}` : ''}, {property.city_name}
            {property.block_or_street ? ` — ${property.block_or_street}` : ''}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Price</p>
              <p className="font-semibold text-emerald-700">
                {property.price != null ? `PKR ${Number(property.price).toLocaleString()}` : 'On request'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-semibold">{property.property_type || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Size</p>
              <p className="font-semibold">{property.size || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Views</p>
              <p className="font-semibold">{property.view_count ?? 0}</p>
            </div>
          </div>

          {property.description && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {property.video_url && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-2">Video Tour</h2>
              <a href={property.video_url} target="_blank" rel="noreferrer" className="text-emerald-600 underline">
                Watch video
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Interested in this property?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Submit your offer or enquiry. Our team will review it and connect you with the seller.
        </p>
        <OfferForm propertyCode={property.property_code} />
      </div>

      <div className="mt-6 text-right">
        {!reportOpen ? (
          <button
            onClick={() => setReportOpen(true)}
            className="text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
          >
            Report this listing
          </button>
        ) : (
          <div className="text-left bg-red-50 border border-red-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-red-800 mb-2">
              Report this listing
            </label>
            <textarea
              value={reportReason}
              onChange={e => setReportReason(e.target.value)}
              rows="2"
              placeholder="Why are you reporting this property?"
              className="w-full px-3 py-2 border border-red-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="mt-3 flex gap-3 justify-end">
              <button
                onClick={() => setReportOpen(false)}
                className="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="text-sm bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Submit report
              </button>
            </div>
          </div>
        )}
        {reportStatus && <p className="text-sm text-gray-600 mt-2 text-right">{reportStatus}</p>}
      </div>
    </div>
  );
}