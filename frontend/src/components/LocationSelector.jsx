import { useState, useEffect } from 'react';
import { fetchCities, fetchSocieties, fetchPhases } from '../api/client';

export default function LocationSelector({ onChange }) {
  const [cities, setCities] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [phases, setPhases] = useState([]);
  const [selected, setSelected] = useState({ city_id: '', society_id: '', phase_id: '' });

  useEffect(() => { fetchCities().then(setCities); }, []);

  useEffect(() => {
    if (selected.city_id) fetchSocieties(selected.city_id).then(setSocieties);
    else setSocieties([]);
    setSelected(s => ({ ...s, society_id: '', phase_id: '' }));
  }, [selected.city_id]);

  useEffect(() => {
    const soc = societies.find(s => s.id === Number(selected.society_id));
    if (soc?.has_phases) fetchPhases(selected.society_id).then(setPhases);
    else setPhases([]);
  }, [selected.society_id, societies]);

  useEffect(() => { onChange(selected); }, [selected]);

  return (
    <div className="space-y-3">
      <select value={selected.city_id} onChange={e => setSelected(s => ({ ...s, city_id: e.target.value }))}>
        <option value="">Select City</option>
        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      {societies.length > 0 && (
        <select value={selected.society_id} onChange={e => setSelected(s => ({ ...s, society_id: e.target.value }))}>
          <option value="">Select Society</option>
          {societies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}

      {phases.length > 0 && (
        <select value={selected.phase_id} onChange={e => setSelected(s => ({ ...s, phase_id: e.target.value }))}>
          <option value="">Select Phase</option>
          {phases.map(p => <option key={p.id} value={p.id}>{p.phase_name} {p.status !== 'active' ? `(${p.status})` : ''}</option>)}
        </select>
      )}
    </div>
  );
}