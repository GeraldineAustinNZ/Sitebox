import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AvailabilityWidget } from '../components/AvailabilityWidget';
import { Truck, Lock, Clock, DollarSign, MapPin, Check } from 'lucide-react';

export function HomePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Sitebox Wanaka',
    image: 'https://placehold.co/1200x630/2d3238/ffffff?text=Sitebox+Wanaka',
    '@id': 'https://siteboxwanaka.co.nz',
    url: 'https://siteboxwanaka.co.nz',
    telephone: '+6401234567890',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Brownston Street',
      addressLocality: 'Wanaka',
      postalCode: '9305',
      addressCountry: 'NZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -44.7006,
      longitude: 169.1321,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    sameAs: [],
    priceRange: '$$',
  };

  return (
    <>
      <SEO
        title="Delivered Secure Storage in Wanaka"
        description="Sitebox Wanaka provides secure, weatherproof storage trailers delivered to your driveway or building site. Perfect for renovations, building projects, and short-term storage in Wanaka."
        keywords="Wanaka storage, storage Wanaka, short term storage Wanaka, renovation storage Wanaka, secure storage Wanaka, site storage Wanaka, trailer hire Wanaka"
        schema={schema}
      />

      <main>
        <section className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6">
                  Delivered Secure Storage in Wanaka
                </h1>
                <p className="text-lg sm:text-xl text-charcoal-200 mb-3 sm:mb-4">
                  Weatherproof storage trailers delivered directly to your driveway or building site.
                  No double handling, no hassle.
                </p>
                <p className="text-base sm:text-lg text-charcoal-300 mb-6 sm:mb-8">
                  Perfect for renovations, building projects, and short-term storage needs across Wanaka,
                  Lake Hawea, Albert Town, and Cardrona.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/pricing"
                    className="w-full sm:w-auto bg-white text-charcoal-900 px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] rounded-lg text-base sm:text-lg font-medium hover:bg-charcoal-100 transition-colors text-center flex items-center justify-center"
                  >
                    View Pricing
                  </Link>
                </div>
                <p className="text-sm text-ocean-300 mt-4 font-medium">
                  Only 3 storage trailers available - book early to secure yours
                </p>
              </div>
              <div>
                <AvailabilityWidget />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-charcoal-900 mb-8 sm:mb-12">
              How Sitebox Wanaka Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              <div className="text-center">
                <div className="bg-ocean-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-10 w-10 text-ocean-600" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">1. We Deliver</h3>
                <p className="text-charcoal-600 leading-relaxed">
                  We deliver a secure, weatherproof storage trailer directly to your driveway or building
                  site in Wanaka. Load it at your convenience.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-sage-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-10 w-10 text-sage-600" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">2. You Store</h3>
                <p className="text-charcoal-600 leading-relaxed">
                  Keep the trailer on-site for as long as you need. Access your belongings anytime
                  without driving to a storage facility.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-ocean-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-ocean-600" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">3. We Collect</h3>
                <p className="text-charcoal-600 leading-relaxed">
                  When you're done, we collect the trailer from your location. No driving,
                  no unloading at a storage unit.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-charcoal-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mb-4 sm:mb-6">
                  Why Choose Mobile Storage in Wanaka?
                </h2>
                <p className="text-base sm:text-lg text-charcoal-700 mb-4 sm:mb-6">
                  Traditional storage units in Wanaka require multiple trips and double handling of your
                  belongings. Sitebox Wanaka brings secure storage to you, saving time and effort.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-charcoal-900">No Double Handling</h3>
                      <p className="text-charcoal-600">
                        Load once, unload once. The trailer stays where you need it.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-charcoal-900">On-Site Convenience</h3>
                      <p className="text-charcoal-600">
                        Access your belongings 24/7 right from your driveway or building site.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-charcoal-900">Secure & Weatherproof</h3>
                      <p className="text-charcoal-600">
                        Enclosed trailers with secure locking keep your items safe from weather and theft.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-charcoal-900">Flexible Short-Term Storage</h3>
                      <p className="text-charcoal-600">
                        From 1 week to 8+ weeks, ideal for renovations and building projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 lg:mt-0">
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=Secure+Lock"
                  alt="Secure storage Wanaka trailer with lock"
                  className="rounded-lg shadow-md w-full"
                />
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=Weatherproof"
                  alt="Weatherproof storage trailer Wanaka"
                  className="rounded-lg shadow-md w-full"
                />
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=Spacious+Interior"
                  alt="Short term storage Wanaka trailer interior"
                  className="rounded-lg shadow-md w-full"
                />
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=Easy+Access"
                  alt="Renovation storage Wanaka easy access"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-charcoal-900 mb-3 sm:mb-4">
              Transparent Pricing for Wanaka Storage
            </h2>
            <p className="text-center text-base sm:text-lg text-charcoal-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Simple, straightforward pricing with no hidden fees. Get secure storage delivered
              to your door from just $260 per week.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-charcoal-50 p-6 sm:p-8 rounded-lg">
                <DollarSign className="h-10 w-10 sm:h-12 sm:w-12 text-ocean-600 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 mb-2">Delivery & Pickup</h3>
                <p className="text-2xl sm:text-3xl font-bold text-ocean-600 mb-2">$90</p>
                <p className="text-sm sm:text-base text-charcoal-600">Each way in Wanaka township</p>
              </div>
              <div className="bg-ocean-50 p-6 sm:p-8 rounded-lg border-2 border-ocean-600 sm:col-span-2 md:col-span-1">
                <div className="bg-ocean-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 sm:mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 mb-2">Weekly Storage</h3>
                <p className="text-2xl sm:text-3xl font-bold text-ocean-600 mb-2">From $260</p>
                <p className="text-sm sm:text-base text-charcoal-600">1-4 weeks, then $210/week</p>
              </div>
              <div className="bg-charcoal-50 p-6 sm:p-8 rounded-lg">
                <div className="bg-sage-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 sm:mb-4">
                  TRADE RATE
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 mb-2">Builders & Tradies</h3>
                <p className="text-2xl sm:text-3xl font-bold text-sage-600 mb-2">$220/wk</p>
                <p className="text-sm sm:text-base text-charcoal-600">4-week minimum for trade accounts</p>
              </div>
            </div>
            <div className="text-center mt-6 sm:mt-8">
              <Link
                to="/pricing"
                className="inline-block w-full sm:w-auto bg-ocean-600 text-white px-6 sm:px-8 py-3 min-h-[48px] rounded-lg font-medium hover:bg-ocean-700 transition-colors text-base flex items-center justify-center"
              >
                View Full Pricing
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-charcoal-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                  Serving Wanaka and Surrounding Areas
                </h2>
                <p className="text-base sm:text-lg text-charcoal-200 mb-4 sm:mb-6 leading-relaxed">
                  We deliver secure storage trailers throughout the Wanaka region, including Lake Hawea,
                  Albert Town, and Cardrona. Whether you're renovating a home, managing a building site,
                  or need temporary storage between properties, we bring the storage to you.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-ocean-400" />
                    <span className="text-charcoal-200">Wanaka Township</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-ocean-400" />
                    <span className="text-charcoal-200">Lake Hawea</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-ocean-400" />
                    <span className="text-charcoal-200">Albert Town</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-ocean-400" />
                    <span className="text-charcoal-200">Cardrona</span>
                  </div>
                </div>
                <Link
                  to="/service-areas"
                  className="inline-block mt-6 text-ocean-400 font-medium hover:text-ocean-300 transition-colors"
                >
                  View All Service Areas →
                </Link>
              </div>
              <div>
                <img
                  src="https://placehold.co/600x400/3d444d/ffffff?text=Wanaka+Map"
                  alt="Sitebox Wanaka service areas map"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
