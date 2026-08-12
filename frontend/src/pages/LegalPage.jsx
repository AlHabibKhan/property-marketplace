import { Link } from 'react-router-dom';

export default function LegalPage({ title, updated, intro, sections }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500 mt-1">Last updated: {updated}</p>

      <p className="text-gray-700 mt-6">{intro}</p>

      <div className="mt-8 space-y-6">
        {sections.map(s => (
          <section key={s.heading}>
            <h2 className="font-semibold text-gray-900">{s.heading}</h2>
            <p className="text-gray-700 text-sm leading-relaxed mt-1">{s.body}</p>
          </section>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-10">
        Questions about this page? <Link to="/requirements" className="text-emerald-600 underline">Contact us</Link>.
      </p>
    </div>
  );
}