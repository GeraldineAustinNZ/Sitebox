import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Lock } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Renovation Storage', href: '/renovation-storage-wanaka' },
    { name: 'Builders & Tradies', href: '/site-storage-wanaka' },
    { name: 'Service Areas', href: '/service-areas' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-charcoal-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-charcoal-900">
              Sitebox Wanaka
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-ocean-600 border-b-2 border-ocean-600'
                      : 'text-charcoal-700 hover:text-ocean-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+6401234567890"
              className="flex items-center space-x-2 text-charcoal-700 hover:text-ocean-600 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">0123 456 7890</span>
            </a>
            <Link
              to="/admin/login"
              className="flex items-center space-x-1 text-charcoal-600 hover:text-ocean-600 transition-colors text-sm"
            >
              <Lock className="h-4 w-4" />
              <span>Admin</span>
            </Link>
            <Link
              to="/book"
              className="bg-ocean-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-ocean-700 transition-colors"
            >
              Book Now
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-charcoal-700 hover:text-charcoal-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive(item.href)
                      ? 'text-ocean-600 bg-ocean-50'
                      : 'text-charcoal-700 hover:bg-charcoal-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="tel:+6401234567890"
                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-charcoal-700 hover:bg-charcoal-50"
              >
                <Phone className="h-4 w-4" />
                <span>0123 456 7890</span>
              </a>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-charcoal-600 hover:bg-charcoal-50"
              >
                <Lock className="h-4 w-4" />
                <span>Admin Login</span>
              </Link>
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="block mx-3 mt-2 bg-ocean-600 text-white px-6 py-2 rounded-md text-base font-medium text-center hover:bg-ocean-700"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
