import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Home, Package, Paintbrush, Hammer, CheckCircle2, Clock } from 'lucide-react';

export function RenovationStoragePage() {
  return (
    <>
      <SEO
        title="Renovation Storage Wanaka - Home Renovation Storage Solutions"
        description="Secure renovation storage in Wanaka delivered to your driveway. Perfect for kitchen renovations, flooring, bathroom upgrades, and home staging. No double handling required."
        keywords="renovation storage Wanaka, temporary storage Wanaka, home renovation storage, kitchen renovation storage, bathroom renovation Wanaka"
      />

      <main>
        <section className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Renovation Storage Wanaka: Delivered to Your Door
              </h1>
              <p className="text-xl text-charcoal-200 leading-relaxed">
                Renovating your Wanaka home? Keep your furniture and belongings safe and accessible
                with our delivered storage trailers. No driving to storage facilities, no double handling.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-charcoal-900 mb-6">
                  Why Choose Sitebox for Your Wanaka Renovation?
                </h2>
                <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                  Home renovations in Wanaka require careful planning, and furniture storage shouldn't
                  add to the stress. Traditional storage units mean loading everything into a truck,
                  driving across town, unloading into a unit, and repeating the process when your
                  renovation is complete.
                </p>
                <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                  Sitebox Wanaka brings temporary storage directly to your driveway. We deliver a secure,
                  weatherproof trailer before your renovation begins. You load it at your own pace, and
                  it stays on your property throughout the project. When you're finished, we collect it.
                  Simple, convenient, and cost-effective renovation storage Wanaka homeowners trust.
                </p>
                <Link
                  to="/pricing#quote-form"
                  className="inline-block bg-ocean-600 text-white px-8 py-3 rounded-md font-medium hover:bg-ocean-700 transition-colors"
                >
                  Get a Quote for Your Renovation
                </Link>
              </div>
              <div>
                <img
                  src="https://placehold.co/600x400/5f6876/ffffff?text=Renovation+Storage"
                  alt="Renovation storage Wanaka trailer at home"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>

            <div className="bg-charcoal-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-charcoal-900 mb-6 text-center">
                Perfect for Every Type of Home Renovation in Wanaka
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <Home className="h-10 w-10 text-ocean-600 mb-4" />
                  <h4 className="text-xl font-semibold text-charcoal-900 mb-3">Kitchen Renovations</h4>
                  <p className="text-charcoal-600 leading-relaxed">
                    Kitchen renovations are among the most disruptive home projects. Store your
                    appliances, cookware, and furniture safely while contractors work. Access items
                    whenever you need them without trips to a storage facility.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <Paintbrush className="h-10 w-10 text-sage-600 mb-4" />
                  <h4 className="text-xl font-semibold text-charcoal-900 mb-3">Bathroom Upgrades</h4>
                  <p className="text-charcoal-600 leading-relaxed">
                    Protect your belongings from dust and moisture during bathroom renovations.
                    Our weatherproof trailers keep towels, toiletries, and furniture safe while
                    your bathroom is being transformed.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <Hammer className="h-10 w-10 text-ocean-600 mb-4" />
                  <h4 className="text-xl font-semibold text-charcoal-900 mb-3">Flooring Replacement</h4>
                  <p className="text-charcoal-600 leading-relaxed">
                    Flooring projects require emptying entire rooms. Store furniture and belongings
                    in your driveway while new floors are installed. Load everything back inside
                    when the work is complete.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <Package className="h-10 w-10 text-sage-600 mb-4" />
                  <h4 className="text-xl font-semibold text-charcoal-900 mb-3">House Staging</h4>
                  <p className="text-charcoal-600 leading-relaxed">
                    Selling your Wanaka property? Remove excess furniture and personal items to
                    help buyers envision themselves in the space. Temporary storage Wanaka residents
                    use for successful home sales.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <Clock className="h-10 w-10 text-ocean-600 mb-4" />
                  <h4 className="text-xl font-semibold text-charcoal-900 mb-3">Between Tenancy Storage</h4>
                  <p className="text-charcoal-600 leading-relaxed">
                    Gap between tenants? Property managers and landlords use our storage trailers
                    to hold furniture while properties are cleaned, repaired, or shown to
                    prospective tenants.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <CheckCircle2 className="h-10 w-10 text-sage-600 mb-4" />
                  <h4 className="text-xl font-semibold text-charcoal-900 mb-3">Whole Home Renovations</h4>
                  <p className="text-charcoal-600 leading-relaxed">
                    Major renovation requiring multiple rooms to be emptied? Our storage trailers
                    provide the capacity you need right at your property. No need to coordinate
                    multiple storage unit trips.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-ocean-600 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              How Renovation Storage in Wanaka Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white text-ocean-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Your Trailer</h3>
                <p className="text-ocean-100">
                  Contact us with your renovation dates. We'll confirm availability for your
                  timeframe.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white text-ocean-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">We Deliver</h3>
                <p className="text-ocean-100">
                  Before your renovation starts, we deliver the trailer to your Wanaka property
                  and position it where needed.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white text-ocean-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Load & Renovate</h3>
                <p className="text-ocean-100">
                  Load your furniture and belongings at your own pace. The trailer stays throughout
                  your renovation project.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white text-ocean-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">We Collect</h3>
                <p className="text-ocean-100">
                  When your renovation is complete and you've unloaded everything, we collect the
                  trailer from your property.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src="https://placehold.co/600x400/5f6876/ffffff?text=Secure+Trailer"
                  alt="Secure home renovation storage Wanaka"
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-charcoal-900 mb-6">
                  Secure, Weatherproof Protection for Your Belongings
                </h2>
                <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                  Wanaka weather can be unpredictable. Our fully enclosed storage trailers protect
                  your furniture and belongings from rain, snow, wind, and dust throughout your
                  renovation project. Robust locking mechanisms ensure security against theft.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Fully Enclosed & Weatherproof</h4>
                      <p className="text-charcoal-600">
                        Solid construction protects against Wanaka's changing weather conditions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Secure Locking System</h4>
                      <p className="text-charcoal-600">
                        You maintain the only key to your storage trailer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Clean & Well-Maintained</h4>
                      <p className="text-charcoal-600">
                        Every trailer is thoroughly cleaned before delivery to your property
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Spacious Interior</h4>
                      <p className="text-charcoal-600">
                        Ample room for furniture, appliances, and renovation supplies
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-charcoal-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-6">
              Renovation Storage Pricing
            </h2>
            <p className="text-center text-charcoal-600 mb-12 max-w-2xl mx-auto">
              Transparent pricing for temporary storage Wanaka homeowners trust. Most kitchen and
              bathroom renovations are completed within 2-4 weeks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="bg-white p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-charcoal-900 mb-2">2 Weeks</h3>
                <p className="text-3xl font-bold text-ocean-600 mb-2">$500</p>
                <p className="text-sm text-charcoal-600">Plus $90 delivery & $90 pickup</p>
              </div>
              <div className="bg-ocean-50 p-6 rounded-lg text-center border-2 border-ocean-600">
                <div className="bg-ocean-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  MOST POPULAR
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-2">4 Weeks</h3>
                <p className="text-3xl font-bold text-ocean-600 mb-2">$920</p>
                <p className="text-sm text-charcoal-600">Plus $90 delivery & $90 pickup</p>
              </div>
              <div className="bg-white p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-charcoal-900 mb-2">6 Weeks</h3>
                <p className="text-3xl font-bold text-ocean-600 mb-2">$1,340</p>
                <p className="text-sm text-charcoal-600">Plus $90 delivery & $90 pickup</p>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/pricing"
                className="inline-block text-ocean-600 font-medium hover:text-ocean-700 transition-colors"
              >
                View complete pricing details →
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-charcoal-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-12">
              Common Questions About Renovation Storage in Wanaka
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  How far in advance should I book?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  We recommend booking 2-3 weeks before your renovation begins, especially during
                  Wanaka's busy summer season. With only 3 trailers available, early booking ensures
                  you get the storage you need.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  Can I extend my rental if the renovation takes longer?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Yes, extensions are available based on trailer availability. Contact us at least
                  3 days before your scheduled pickup to arrange additional time at our standard
                  weekly rates.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  Where will the trailer be positioned?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  We'll position the trailer wherever works best for your renovation - typically in
                  your driveway or on your property. The trailer requires a flat surface approximately
                  6m x 2.5m.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  What if I need help loading heavy furniture?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  While we don't provide loading services, many of our customers hire local Wanaka
                  movers to help with heavy items. The convenience of loading at your own property
                  makes this much easier than a storage facility.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
