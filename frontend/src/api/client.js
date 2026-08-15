const API_URL = import.meta.env.VITE_API_URL || '';

export async function fetchCities() {
  const res = await fetch(`${API_URL}/locations/cities`);
  return res.json();
}
export async function fetchSocieties(cityId) {
  const res = await fetch(`${API_URL}/locations/societies?city_id=${cityId}`);
  return res.json();
}
export async function fetchPhases(societyId) {
  const res = await fetch(`${API_URL}/locations/phases?society_id=${societyId}`);
  return res.json();
}
export async function fetchSocietyBySlug(citySlug, societySlug) {
  const res = await fetch(`${API_URL}/locations/by-slug/${citySlug}/${societySlug}`);
  return res.json();
}
export async function submitRequirement(data) {
  const res = await fetch(`${API_URL}/requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function reportProperty(code, data) {
  const res = await fetch(`${API_URL}/properties/${code}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function fetchProperties(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_URL}/properties?${params}`);
  return res.json();
}
export async function fetchProperty(slug) {
  const res = await fetch(`${API_URL}/properties/${slug}`);
  return res.json();
}
export async function submitOffer(propertyCode, data) {
  const res = await fetch(`${API_URL}/offers/${propertyCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function createListing(data) {
  const res = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function polishDescription(text) {
  const res = await fetch(`${API_URL}/properties/polish-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return res.json();
}

export async function fetchMyListings(phone) {
  const res = await fetch(`${API_URL}/properties/my-listings/${encodeURIComponent(phone)}`);
  return res.json();
}
export async function fetchIdentity(phone) {
  const res = await fetch(`${API_URL}/identity/${encodeURIComponent(phone)}`);
  return res.json();
}
export async function fetchMyRequirements(phone) {
  const res = await fetch(`${API_URL}/requirements/my/${encodeURIComponent(phone)}`);
  return res.json();
}
export async function fetchMyOffers(phone) {
  const res = await fetch(`${API_URL}/offers/my/${encodeURIComponent(phone)}`);
  return res.json();
}
export async function fetchReceivedOffers(phone) {
  const res = await fetch(`${API_URL}/offers/received/${encodeURIComponent(phone)}`);
  return res.json();
}

function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-password': sessionStorage.getItem('adminPassword') || ''
  };
}

export async function adminFetchOffers() {
  const res = await fetch(`${API_URL}/admin/offers`, { headers: adminHeaders() });
  return res.json();
}
export async function adminFetchPendingListings() {
  const res = await fetch(`${API_URL}/admin/properties/pending`, { headers: adminHeaders() });
  return res.json();
}
export async function adminFetchContacts() {
  const res = await fetch(`${API_URL}/admin/contacts`, { headers: adminHeaders() });
  return res.json();
}
export async function adminUpdateOfferStatus(id, data) {
  const res = await fetch(`${API_URL}/admin/offers/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function adminApproveProperty(id) {
  const res = await fetch(`${API_URL}/admin/properties/${id}/approve`, {
    method: 'PATCH',
    headers: adminHeaders()
  });
  return res.json();
}
export async function adminFetchRequirements() {
  const res = await fetch(`${API_URL}/admin/requirements`, { headers: adminHeaders() });
  return res.json();
}
export async function adminFetchReports() {
  const res = await fetch(`${API_URL}/admin/reports`, { headers: adminHeaders() });
  return res.json();
}