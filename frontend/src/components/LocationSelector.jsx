import { useState, useEffect } from 'react';
import { fetchCities, fetchSocieties, fetchPhases } from '../api/client';

const OTHER = '__other__';

export default function LocationSelector({ onChange, other = true }) {
  const [cities, setCities] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [phases, setPhases] = useState([]);
  const [selected, setSelected] = useState({ city_id: '', society_id: '', phase_id: '' });
  const [custom, setCustom] = useState({ city: '', society: '', phase: '' });

  const isOtherCity = selected.city_id === OTHER;
  const isOtherSociety = selected.society_id === OTHER;
  const isOtherPhase = selected.phase_id === OTHER;
  const hasCity = selected.city_id !== '';
  const hasSociety = hasCity && selected.society_id !== '';

  useEffect(() => { fetchCities().then(setCities); }, []);

  useEffect(() => {
    if (!isOtherCity && selected.city_id) fetchSocieties(selected.city_id).then(setSocieties);
    else setSocieties([]);
    if (selected.city_id !== OTHER) {
      setSelected(s => ({ ...s, society_id: '', phase_id: '' }));
    }
  }, [selected.city_id]);

  useEffect(() => {
    const soc = societies.find(s => s.id === Number(selected.society_id));
    if (soc?.has_phases && !isOtherSociety) fetchPhases(selected.society_id).then(setPhases);
    else setPhases([]);
  }, [selected.society_id, societies]);

  useEffect(() => {
    const payload = {
      city_id: isOtherCity ? '' : selected.city_id || '',
      city_name: isOtherCity ? custom.city : '',
      society_id: !isOtherCity && !isOtherSociety ? selected.society_id || '' : '',
      society_name: isOtherSociety ? custom.society : '',
      phase_id: !isOtherCity && !isOtherSociety && !isOtherPhase ? selected.phase_id || '' : '',
      phase_name: isOtherPhase ? custom.phase : ''
    };
    onChange(payload);
  }, [selected, custom]);

  const selectCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";
  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";

  const renderOtherInput = (isOther, key, placeholder) =>
    isOther && (
      <div className="mt-2">
        <input
          value={custom[key]}
          onChange={e => setCustom({ ...custom, [key]: e.target.value })}
          className={inputCls}
          placeholder={placeholder}
        />
        <p className="text-xs text-gray-400 mt-1">Will be added to the list for everyone to use.</p>
      </div>
    );

  return (
    <div className="space-y-3">
      <div>
        <select value={selected.city_id} onChange={e => setSelected(s => ({ ...s, city_id: e.target.value }))} className={selectCls}>
          <option value="">Select City</option>
          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          {other && <option value={OTHER}>Other (add your own)…</option>}
        </select>
        {renderOtherInput(isOtherCity, 'city', 'Type city name')}
      </div>

      {hasCity && (
        <div>
          <select value={selected.society_id} onChange={e => setSelected(s => ({ ...s, society_id: e.target.value }))} className={selectCls}>
            <option value="">Select Society</option>
            {societies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            {other && <option value={OTHER}>Other (add your own)…</option>}
          </select>
          {renderOtherInput(isOtherSociety, 'society', 'Type society name')}
        </div>
      )}

      {hasSociety && (
        <div>
          <select value={selected.phase_id} onChange={e => setSelected(s => ({ ...s, phase_id: e.target.value }))} className={selectCls}>
            <option value="">Select Phase / Block</option>
            {phases.map(p => <option key={p.id} value={p.id}>{p.phase_name} {p.status !== 'active' ? `(${p.status})` : ''}</option>)}
            {other && <option value={OTHER}>Other (add your own)…</option>}
          </select>
          {renderOtherInput(isOtherPhase, 'phase', 'Type phase / block name')}
        </div>
      )}
    </div>
  );
}