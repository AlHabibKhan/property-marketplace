import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminFetchOffers,
  adminFetchPendingListings,
  adminFetchContacts,
  adminFetchRequirements,
  adminFetchReports,
  adminUpdateOfferStatus,
  adminApproveProperty
} from '../api/client';

const TABS = [
  { key: 'offers', label: 'New Offers' },
  { key: 'pending', label: 'Pending Listings' },
  { key: 'requirements', label: 'Buyer Requirements' },
  { key: 'flagged', label: 'Flagged' },
  { key: 'contacts', label: 'All Contacts' }
];

function whatsappLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function exportToCSV(contacts) {
  const headers = 'Name,Phone,Role,City,Tags\n';
  const rows = contacts.map(c => `${c.full_name},${c.phone},${c.role},${c.city},"${(c.tags || []).join(';')}"`).join('\n');
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'contacts.csv'; a.click();
  URL.revokeObjectURL(url);
}

const waBtnCls = "inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 hover:bg-emerald-100 transition-colors mt-1";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('offers');
  const [offers, setOffers] = useState([]);
  const [pending, setPending] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [offersData, pendingData, requirementsData, flaggedData, contactsData] = await Promise.all([
        adminFetchOffers(),
        adminFetchPendingListings(),
        adminFetchRequirements(),
        adminFetchReports(),
        adminFetchContacts()
      ]);

      const anyUnauthorized =
        offersData.error === 'Unauthorized' ||
        pendingData.error === 'Unauthorized' ||
        requirementsData.error === 'Unauthorized' ||
        flaggedData.error === 'Unauthorized' ||
        contactsData.error === 'Unauthorized';

      if (anyUnauthorized) {
        sessionStorage.removeItem('adminPassword');
        navigate('/admin', { replace: true });
        return;
      }

      setOffers(Array.isArray(offersData) ? offersData : []);
      setPending(Array.isArray(pendingData) ? pendingData : []);
      setRequirements(Array.isArray(requirementsData) ? requirementsData : []);
      setFlagged(Array.isArray(flaggedData) ? flaggedData : []);
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData, activeTab]);

  const handleStatusChange = async (id, status) => {
    const res = await adminUpdateOfferStatus(id, { status, admin_notes: null });
    if (res.success) {
      setOffers(offers.map(o => (o.id === id ? { ...o, status } : o)));
    } else if (res.error === 'Unauthorized') {
      sessionStorage.removeItem('adminPassword');
      navigate('/admin', { replace: true });
    }
  };

  const handleApprove = async id => {
    const res = await adminApproveProperty(id);
    if (res.success) {
      setPending(pending.filter(p => p.id !== id));
    } else if (res.error === 'Unauthorized') {
      sessionStorage.removeItem('adminPassword');
      navigate('/admin', { replace: true });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    navigate('/admin', { replace: true });
  };

  const thCls = "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase";
  const tdCls = "px-4 py-3 text-sm text-gray-800 align-top";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className="ml-1 text-xs text-gray-400">
              {tab.key === 'offers' ? offers.length : tab.key === 'pending' ? pending.length : tab.key === 'requirements' ? requirements.length : tab.key === 'flagged' ? flagged.length : contacts.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading...</p>
      ) : (
        <>
          {activeTab === 'offers' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thCls}>Property</th>
                    <th className={thCls}>Buyer</th>
                    <th className={thCls}>Seller</th>
                    <th className={thCls}>Offer</th>
                    <th className={thCls}>Date</th>
                    <th className={thCls}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {offers.length === 0 && (
                    <tr><td colSpan="6" className={tdCls + " text-center text-gray-500"}>No offers yet.</td></tr>
                  )}
                  {offers.map(o => (
                    <tr key={o.id}>
                      <td className={tdCls}>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{o.property_code}</span>
                        <div className="mt-1 text-xs text-gray-500">{o.property_title}</div>
                      </td>
                      <td className={tdCls}>
                        <div className="font-medium">{o.buyer_name || '—'}</div>
                        <div className="text-xs text-gray-500">{o.buyer_phone}</div>
                        <a
                          href={whatsappLink(o.buyer_phone, `Assalam o Alaikum, regarding property ${o.property_code}`)}
                          target="_blank"
                          rel="noreferrer"
                          className={waBtnCls}
                        >
                          WhatsApp Buyer
                        </a>
                      </td>
                      <td className={tdCls}>
                        <div className="font-medium">{o.seller_name || '—'}</div>
                        <div className="text-xs text-gray-500">{o.seller_phone}</div>
                        <a
                          href={whatsappLink(o.seller_phone, `Assalam o Alaikum, regarding property ${o.property_code}`)}
                          target="_blank"
                          rel="noreferrer"
                          className={waBtnCls}
                        >
                          Message Seller on WhatsApp
                        </a>
                      </td>
                      <td className={tdCls}>
                        {o.offer_price != null ? `PKR ${Number(o.offer_price).toLocaleString()}` : '—'}
                        {o.message && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{o.message}</div>}
                      </td>
                      <td className={tdCls}>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className={tdCls}>
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="negotiating">negotiating</option>
                          <option value="closed">closed</option>
                          <option value="rejected">rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thCls}>Property</th>
                    <th className={thCls}>Seller</th>
                    <th className={thCls}>Details</th>
                    <th className={thCls}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pending.length === 0 && (
                    <tr><td colSpan="4" className={tdCls + " text-center text-gray-500"}>No pending listings.</td></tr>
                  )}
                  {pending.map(p => (
                    <tr key={p.id}>
                      <td className={tdCls}>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-gray-500">Code: {p.property_code}</div>
                      </td>
                      <td className={tdCls}>
                        <div className="font-medium">{p.seller_name || '—'}</div>
                        <div className="text-xs text-gray-500">{p.seller_phone}</div>
                        <a
                          href={whatsappLink(p.seller_phone, `Assalam o Alaikum, regarding your listing ${p.property_code}`)}
                          target="_blank"
                          rel="noreferrer"
                          className={waBtnCls}
                        >
                          WhatsApp Seller
                        </a>
                      </td>
                      <td className={tdCls}>
                        <div>{p.property_type}{p.size ? ` • ${p.size}` : ''}</div>
                        <div className="text-sm font-semibold text-emerald-700">
                          {p.price != null ? `PKR ${Number(p.price).toLocaleString()}` : '—'}
                        </div>
                        {p.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</div>}
                      </td>
                      <td className={tdCls}>
                        <button
                          onClick={() => handleApprove(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Approve & Publish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thCls}>Buyer</th>
                    <th className={thCls}>Location</th>
                    <th className={thCls}>Requirement</th>
                    <th className={thCls}>Matches</th>
                    <th className={thCls}>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requirements.length === 0 && (
                    <tr><td colSpan="5" className={tdCls + " text-center text-gray-500"}>No buyer requirements yet.</td></tr>
                  )}
                  {requirements.map(r => (
                    <tr key={r.id}>
                      <td className={tdCls}>
                        <div className="font-medium">{r.buyer_name || '—'}</div>
                        <div className="text-xs text-gray-500">{r.buyer_phone}</div>
                        <a
                          href={whatsappLink(r.buyer_phone, `Assalam o Alaikum, about your property requirement`)}
                          target="_blank"
                          rel="noreferrer"
                          className={waBtnCls}
                        >
                          WhatsApp Buyer
                        </a>
                      </td>
                      <td className={tdCls}>
                        <div>{r.society_name || 'Any'}</div>
                        <div className="text-xs text-gray-500">{r.city_name || ''}</div>
                      </td>
                      <td className={tdCls}>
                        <div>{r.property_type || 'Any'}{r.budget_max != null ? ` • PKR ${Number(r.budget_max).toLocaleString()}` : ''}</div>
                        {r.notes && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{r.notes}</div>}
                      </td>
                      <td className={tdCls}>
                        <span className="font-semibold text-emerald-700">{r.matching_properties ?? 0}</span>
                        <span className="text-xs text-gray-500"> active</span>
                      </td>
                      <td className={tdCls}>{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'flagged' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thCls}>Property</th>
                    <th className={thCls}>Seller</th>
                    <th className={thCls}>Reports</th>
                    <th className={thCls}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flagged.length === 0 && (
                    <tr><td colSpan="4" className={tdCls + " text-center text-gray-500"}>No flagged listings.</td></tr>
                  )}
                  {flagged.map(p => (
                    <tr key={p.id}>
                      <td className={tdCls}>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-gray-500">Code: {p.property_code}</div>
                      </td>
                      <td className={tdCls}>
                        <div className="font-medium">{p.seller_name || '—'}</div>
                        <div className="text-xs text-gray-500">{p.seller_phone}</div>
                        <a
                          href={whatsappLink(p.seller_phone, `Assalam o Alaikum, regarding your flagged listing ${p.property_code}`)}
                          target="_blank"
                          rel="noreferrer"
                          className={waBtnCls}
                        >
                          WhatsApp Seller
                        </a>
                      </td>
                      <td className={tdCls}>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                          {p.report_count}
                        </span>
                      </td>
                      <td className={tdCls}>
                        <span className="text-red-600 font-medium">{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">{contacts.length} contacts</span>
                <button
                  onClick={() => exportToCSV(contacts)}
                  disabled={contacts.length === 0}
                  className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Export CSV
                </button>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={thCls}>Name</th>
                    <th className={thCls}>Phone</th>
                    <th className={thCls}>Role</th>
                    <th className={thCls}>City</th>
                    <th className={thCls}>Source</th>
                    <th className={thCls}>Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.length === 0 && (
                    <tr><td colSpan="6" className={tdCls + " text-center text-gray-500"}>No contacts yet.</td></tr>
                  )}
                  {contacts.map((c, i) => (
                    <tr key={c.phone + i}>
                      <td className={tdCls}>{c.full_name || '—'}</td>
                      <td className={tdCls}>{c.phone}</td>
                      <td className={tdCls}>{c.role || '—'}</td>
                      <td className={tdCls}>{c.city || '—'}</td>
                      <td className={tdCls}>{c.source_project || '—'}</td>
                      <td className={tdCls}>{c.last_active_at ? new Date(c.last_active_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}