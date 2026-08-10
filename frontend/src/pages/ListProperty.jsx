import { useState } from 'react';
import LocationSelector from '../components/LocationSelector';
import { createListing, polishDescription } from '../api/client';

export default function ListProperty() {
  const [location, setLocation] = useState({ city_id: '', society_id: '', phase_id: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [polishing, setPolishing] = useState(false);

  const [form, setForm] = useState({
    seller_name: '',
    seller_phone: '',
    title: '',
    description: '',
    property_type: 'House',
    size: '',
    price: '',
    block_or_street: '',
    images: []
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePolish = async () => {
    if (!form.description.trim()) return;
    setPolishing(true);
    setError('');
    const res = await polishDescription(form.description);
    setPolishing(false);
    if (res.polished) {
      setForm({ ...form, description: res.polished });
    } else {
      setError(res.error || 'AI polishing failed. Please try again.');
    }
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!location.city_id) {
      setError('Please select a city.');
      return;
    }
    if (!form.title || !form.seller_phone) {
      setError('Title and phone number are required.');
      return;
    }

    setLoading(true);
    const res = await createListing({
      ...form,
      price: form.price ? Number(form.price) : null,
      city_id: location.city_id,
      society_id: location.society_id || null,
      phase_id: location.phase_id || null
    });

    setLoading(false);
    if (res.success) {
      setSuccess(`Listing submitted for review! Your property code is ${res.property.property_code}.`);
      setForm({
        seller_name: '',
        seller_phone: '',
        title: '',
        description: '',
        property_type: 'House',
        size: '',
        price: '',
        block_or_street: '',
        images: []
      });
      setLocation({ city_id: '', society_id: '', phase_id: '' });
    } else {
      setError(res.error || 'Failed to submit listing. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">List Your Property</h1>
      <p className="text-gray-600 mb-6">
        It's free to list. Our team reviews every listing before it goes live.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Your Name *</label>
            <input name="seller_name" value={form.seller_name} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Your Phone (WhatsApp) *</label>
            <input name="seller_phone" type="tel" required value={form.seller_phone} onChange={handleChange} className={inputCls} placeholder="0300 1234567" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Property Title *</label>
          <input name="title" required value={form.title} onChange={handleChange} className={inputCls} placeholder="e.g. 10 Marla House for Sale in DHA Phase 6" />
        </div>

        <div>
          <label className={labelCls}>Location *</label>
          <LocationSelector onChange={setLocation} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Property Type</label>
            <select name="property_type" value={form.property_type} onChange={handleChange} className={inputCls}>
              <option>House</option>
              <option>Flat</option>
              <option>Plot</option>
              <option>Commercial</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Size</label>
            <input name="size" value={form.size} onChange={handleChange} className={inputCls} placeholder="e.g. 5 Marla, 240 sq. yd" />
          </div>
          <div>
            <label className={labelCls}>Price (PKR)</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className={inputCls} placeholder="e.g. 15000000" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Block / Street (optional)</label>
          <input name="block_or_street" value={form.block_or_street} onChange={handleChange} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <div className="flex gap-2 items-start">
            <textarea name="description" rows="5" value={form.description} onChange={handleChange} className={inputCls} placeholder="Features, condition, nearby amenities..." />
            <button
              type="button"
              onClick={handlePolish}
              disabled={polishing}
              className="shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
            >
              {polishing ? 'Polishing...' : 'Polish with AI'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Uses Gemini to rewrite your description professionally (optional).</p>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}