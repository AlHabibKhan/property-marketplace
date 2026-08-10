import { useState } from 'react';
import { submitOffer } from '../api/client';

export default function OfferForm({ propertyCode }) {
  const [form, setForm] = useState({ buyer_name: '', buyer_phone: '', buyer_email: '', offer_price: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });
    const res = await submitOffer(propertyCode, {
      ...form,
      offer_price: form.offer_price ? Number(form.offer_price) : null
    });
    setLoading(false);
    if (res.success) {
      setStatus({ type: 'success', text: res.message });
      setForm({ buyer_name: '', buyer_phone: '', buyer_email: '', offer_price: '', message: '' });
    } else {
      setStatus({ type: 'error', text: res.error || 'Something went wrong. Please try again.' });
    }
  };

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Your Name</label>
        <input name="buyer_name" required value={form.buyer_name} onChange={handleChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Phone (WhatsApp)</label>
        <input name="buyer_phone" required type="tel" value={form.buyer_phone} onChange={handleChange} className={inputCls} placeholder="0300 1234567" />
      </div>
      <div>
        <label className={labelCls}>Email (optional)</label>
        <input name="buyer_email" type="email" value={form.buyer_email} onChange={handleChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Offer Price (PKR, optional)</label>
        <input name="offer_price" type="number" min="0" value={form.offer_price} onChange={handleChange} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Message</label>
        <textarea name="message" rows="3" value={form.message} onChange={handleChange} className={inputCls} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit Offer'}
      </button>

      {status.text && (
        <p className={`text-sm text-center ${status.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
          {status.text}
        </p>
      )}
    </form>
  );
}