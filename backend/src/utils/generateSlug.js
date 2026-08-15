export function generateSlug(title, city, society, code) {
  const base = `${society || ''}-${title || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base}-${code.toLowerCase()}`;
}