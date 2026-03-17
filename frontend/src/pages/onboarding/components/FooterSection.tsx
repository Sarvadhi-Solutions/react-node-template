import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

const currentYear = new Date().getFullYear();

export function FooterSection() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-indigo-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-indigo-400" strokeWidth={1.5} />
              <span className="font-semibold text-lg">React Boilerplate</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A production-ready template for building enterprise applications with React, TypeScript, and modern tooling.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Powered by */}
          <div>
            <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">
              Built By
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Powered by Sarvadhi Solutions Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <p className="text-center text-xs text-gray-500">
            &copy; {currentYear} Sarvadhi Solutions Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
