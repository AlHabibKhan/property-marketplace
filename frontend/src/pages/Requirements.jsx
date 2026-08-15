import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LocationSelector from '../components/LocationSelector';
import { useAuth } from '../context/AuthContext';
import { submitRequirement } from '../api/client';

export default function Requirements() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState({
    city_id: searchParams.get('city_id') || '',
    city_name: '',
    society_id: searchParams.get('society_id') || '',
    society_name: '',
    phase_id: '',
    phase_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    buyer_name: user?.role === 'buyer' ? user.name : '',
    buyer_phone: user?.role === 'buyer' ? user.phone : '',
    buyer_email: '',
    budget_max: '',
    property_type: '',
    notes: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.buyer_phone) {
      setError('Phone number is required.');
      return;
    }

    setLoading(true);
    const res = await submitRequirement({
      ...form,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      city_id: location.city_id || null,
      city_name: location.city_name || null,
      society_id: location.society_id || null,
      society_name: location.society_name || null
    });
    setLoading(false);

    if (res.success) {
      setSuccess('Requirement posted! Our team will match it against available listings.');
      setForm({ buyer_name: '', buyer_phone: '', buyer_email: '', budget_max: '', property_type: '', notes: '' });
      setLocation({ city_id: '', city_name: '', society_id: '', society_name: '', phase_id: '', phase_name: '' });
    } else {
      setError(res.error || 'Failed to post requirement.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Your Requirement</h1>
      <p className="text-gray-600 mb-6">
        Tell us what you're looking for and our team will match you against active listings.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Your Name</label>
            <input name="buyer_name" value={form.buyer_name} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Your Phone (WhatsApp) *</label>
            <input name="buyer_phone" type="tel" required value={form.buyer_phone} onChange={handleChange} className={inputCls} placeholder="0300 1234567" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Email (optional)</label>
          <input name="buyer_email" type="email" value={form.buyer_email} onChange={handleChange} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Preferred Location</label>
          <LocationSelector onChange={setLocation} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Budget Max (PKR)</label>
            <input name="budget_max" type="number" min="0" value={form.budget_max} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Property Type</label>
            <select name="property_type" value={form.property_type} onChange={handleChange} className={inputCls}>
              <option value="">Any</option>
              <option>House</option>
              <option>Flat</option>
              <option>Plot</option>
              <option>Commercial</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Notes</label>
          <textarea name="notes" rows="3" value={form.notes} onChange={handleChange} className={inputCls} placeholder="Size, phase preference, features..." />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Posting...' : 'Post Requirement'}
        </button>
      </form>
    </div>
  );
}