import { useState, useEffect } from 'react';

const PRESETS = ['House', 'Flat', 'Plot', 'Commercial'];
const OTHER = '__other__';

export default function PropertyTypeSelector({ value, onChange, allowAny = false }) {
  const [otherActive, setOtherActive] = useState(false);
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (value === '' || PRESETS.includes(value)) {
      setOtherActive(false);
    } else {
      setOtherActive(true);
      setCustom(value);
    }
  }, [value]);

  const handleSelect = e => {
    const v = e.target.value;
    if (v === OTHER) {
      setOtherActive(true);
      return;
    }
    setOtherActive(false);
    onChange(v);
  };

  const selectCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";
  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div>
      <select
        value={otherActive ? OTHER : (value === '' || value == null) && allowAny ? '' : PRESETS.includes(value) ? value : ''}
        onChange={handleSelect}
        className={selectCls}
      >
        {allowAny && <option value="">Any</option>}
        {PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
        <option value={OTHER}>Other (add your own)…</option>
      </select>
      {otherActive && (
        <div className="mt-2">
          <input
            value={custom}
            onChange={e => { setCustom(e.target.value); onChange(e.target.value); }}
            className={inputCls}
            placeholder="Type property type"
          />
          <p className="text-xs text-gray-400 mt-1">Your custom type will be shown on the listing.</p>
        </div>
      )}
    </div>
  );
}