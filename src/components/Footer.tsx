import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sitebox Wanaka</h3>
            <p className="text-charcoal-300 text-sm leading-relaxed">
              Secure, weatherproof storage trailers delivered to your driveway or building site in Wanaka.
              Perfect for renovations, building projects, and short-term storage needs.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-charcoal-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-charcoal-300 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/renovation-storage-wanaka" className="text-charcoal-300 hover:text-white transition-colors text-sm">
                  Renovation Storage
                </Link>
              </li>
              <li>
                <Link to="/site-storage-wanaka" className="text-charcoal-300 hover:text-white transition-colors text-sm">
                  Builders & Tradies
                </Link>
              </li>
              <li>
                <Link to="/service-areas" className="text-charcoal-300 hover:text-white transition-colors text-sm">
                  Service Areas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-ocean-400 flex-shrink-0 mt-0.5" />
                <span className="text-charcoal-300">
                  123 Brownston Street<br />
                  Wanaka 9305<br />
                  New Zealand
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="h-5 w-5 text-ocean-400 flex-shrink-0" />
                <a href="tel:+6401234567890" className="text-charcoal-300 hover:text-white transition-colors">
                  0123 456 7890
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="h-5 w-5 text-ocean-400 flex-shrink-0" />
                <a href="mailto:info@siteboxwanaka.co.nz" className="text-charcoal-300 hover:text-white transition-colors">
                  info@siteboxwanaka.co.nz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-700 pt-8 text-center">
          <p className="text-charcoal-400 text-sm">
            &copy; {currentYear} Sitebox Wanaka. All rights reserved.
            Delivering secure storage solutions across Wanaka, Lake Hawea, Albert Town, and Cardrona.
          </p>
        </div>
      </div>
    </footer>
  );
}
