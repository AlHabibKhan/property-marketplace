import React from 'react';
import { Link } from 'react-router-dom';

const STYLES = {
  seller: { section: 'bg-emerald-700', cta: 'bg-white text-emerald-700 hover:bg-emerald-50', sub: 'text-emerald-100' },
  buyer: { section: 'bg-teal-700', cta: 'bg-white text-teal-700 hover:bg-teal-50', sub: 'text-teal-100' }
};

export default function RoleHero({ role, name, eyebrow, title, subtitle, ctaLabel, ctaTo, ctaSecondary }) {
  const s = STYLES[role] || STYLES.seller;
  return (
    <section className={`${s.section} text-white rounded-xl p-6 md:p-10`}>
      {eyebrow && <p className={`${s.sub} text-sm font-medium mb-1`}>{eyebrow}</p>}
      <h1 className="text-2xl md:text-3xl font-bold">
        {name ? title.replace('{name}', name) : title}
      </h1>
      <p className={`mt-2 ${s.sub}`}>{subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {ctaLabel && ctaTo && (
          <Link
            to={ctaTo}
            className={`${s.cta} font-semibold px-5 py-2.5 rounded-lg transition-colors`}
          >
            {ctaLabel}
          </Link>
        )}
        {ctaSecondary && (
          <Link
            to="/"
            className={`${s.sub} border border-white/60 hover:bg-white/10 font-medium px-5 py-2.5 rounded-lg transition-colors`}
          >
            {ctaSecondary}
          </Link>
        )}
      </div>
    </section>
  );
}