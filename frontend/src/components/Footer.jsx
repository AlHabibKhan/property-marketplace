import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-bold text-emerald-700">Property Marketplace</p>
            <p className="text-sm text-gray-500 mt-1">
              A listing & lead-connection platform for plots, houses, and apartments in Pakistan.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-emerald-700">Browse</Link>
            <Link to="/list" className="text-gray-600 hover:text-emerald-700">List Property</Link>
            <Link to="/requirements" className="text-gray-600 hover:text-emerald-700">Post Requirement</Link>
            <Link to="/terms" className="text-gray-600 hover:text-emerald-700">Terms</Link>
            <Link to="/privacy" className="text-gray-600 hover:text-emerald-700">Privacy</Link>
            <Link to="/disclaimer" className="text-gray-600 hover:text-emerald-700">Disclaimer</Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>
            Property Marketplace is not a real estate agent, broker, or legal adviser. Listings are user-submitted and not
            independently verified. Buying or selling carries risk — always perform your own due diligence. Read our{' '}
            <Link to="/disclaimer" className="text-gray-500 underline">Disclaimer</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}