import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { MapPin, CheckCircle2, Mountain } from 'lucide-react';

export function ServiceAreasPage() {
  return (
    <>
      <SEO
        title="Service Areas - Storage Solutions Across Wanaka Region"
        description="Sitebox Wanaka delivers secure storage trailers throughout Wanaka, Lake Hawea, Albert Town, and Cardrona. Local storage solutions for the Upper Clutha region."
        keywords="Wanaka storage, Lake Hawea storage, Albert Town storage, Cardrona storage, Upper Clutha storage"
      />

      <main>
        <section className="bg-charcoal-900 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Serving Wanaka and Surrounding Areas
              </h1>
              <p className="text-xl text-charcoal-200">
                Secure, weatherproof storage trailers delivered throughout the Upper Clutha region.
                Local storage solutions for your renovation, building, or temporary storage needs.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-charcoal-900 mb-6">
                  Local Storage Delivered to Your Location
                </h2>
                <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                  Sitebox Wanaka provides delivered storage solutions across the Wanaka region.
                  Whether you're in Wanaka township, Lake Hawea, Albert Town, or Cardrona, we bring
                  secure storage trailers directly to your property or building site.
                </p>
                <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                  Our enclosed storage trailers are perfect for home renovations, building projects,
                  temporary storage between properties, and any situation where you need secure,
                  convenient storage without the hassle of driving to a storage facility.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-sage-600" />
                    <span className="text-charcoal-700">Delivery throughout the Wanaka region</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-sage-600" />
                    <span className="text-charcoal-700">Secure, weatherproof storage trailers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-sage-600" />
                    <span className="text-charcoal-700">Flexible short-term rental periods</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-sage-600" />
                    <span className="text-charcoal-700">Positioned where you need it most</span>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="https://placehold.co/600x400/5f6876/ffffff?text=Wanaka+Region+Map"
                  alt="Sitebox Wanaka service areas including Lake Hawea, Albert Town, and Cardrona"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-charcoal-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-12">
              Our Service Areas
            </h2>
            <div className="space-y-12">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="h-8 w-8 text-ocean-600" />
                      <h3 className="text-3xl font-bold text-charcoal-900">Wanaka</h3>
                    </div>
                    <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                      As our home base, Wanaka township receives our standard delivery rate of $90.
                      We serve all areas of Wanaka including Beacon Point, Penrith Park, Three Parks,
                      and Northlake. Storage Wanaka residents trust for renovations, building projects,
                      and temporary storage needs.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Standard delivery: $90</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">All Wanaka suburbs covered</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Same-day positioning available</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 italic">
                      Popular for: Kitchen renovations, bathroom upgrades, flooring projects, building
                      sites, and temporary storage during property sales.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-ocean-600 to-ocean-700 p-8 lg:p-12 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Mountain className="h-24 w-24 mx-auto mb-4 opacity-75" />
                      <p className="text-2xl font-bold mb-2">Wanaka Storage</p>
                      <p className="text-ocean-100">Central Otago's Premier Storage Solution</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-sage-600 to-sage-700 p-8 lg:p-12 flex items-center justify-center order-2 lg:order-1">
                    <div className="text-white text-center">
                      <Mountain className="h-24 w-24 mx-auto mb-4 opacity-75" />
                      <p className="text-2xl font-bold mb-2">Lake Hawea Storage</p>
                      <p className="text-sage-100">Lakeside Living Storage Solutions</p>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 order-1 lg:order-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="h-8 w-8 text-sage-600" />
                      <h3 className="text-3xl font-bold text-charcoal-900">Lake Hawea</h3>
                    </div>
                    <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                      Just 15 minutes from Wanaka, Lake Hawea receives the same excellent service and
                      competitive delivery rates. We deliver to both the lakefront areas and the wider
                      Lake Hawea community. Lake Hawea storage solutions for renovations and building
                      projects throughout the area.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Delivery from $90 (may vary by location)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Lakefront and township delivery</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Perfect for holiday home storage</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 italic">
                      Popular for: Holiday home renovations, between-season storage, building projects,
                      and temporary storage for lake properties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="h-8 w-8 text-ocean-600" />
                      <h3 className="text-3xl font-bold text-charcoal-900">Albert Town</h3>
                    </div>
                    <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                      Located between Wanaka and Lake Hawea, Albert Town is well within our service
                      area. This growing community benefits from our convenient delivered storage
                      solutions. Albert Town storage for residential renovations and building projects
                      in this expanding area.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Standard delivery rates apply</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Ideal for new builds and renovations</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Quick delivery from Wanaka base</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 italic">
                      Popular for: New home builds, renovation storage, and temporary storage during
                      construction in this developing area.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-ocean-600 to-ocean-700 p-8 lg:p-12 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Mountain className="h-24 w-24 mx-auto mb-4 opacity-75" />
                      <p className="text-2xl font-bold mb-2">Albert Town Storage</p>
                      <p className="text-ocean-100">Growing Community Storage Solutions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="bg-gradient-to-br from-sage-600 to-sage-700 p-8 lg:p-12 flex items-center justify-center order-2 lg:order-1">
                    <div className="text-white text-center">
                      <Mountain className="h-24 w-24 mx-auto mb-4 opacity-75" />
                      <p className="text-2xl font-bold mb-2">Cardrona Storage</p>
                      <p className="text-sage-100">Alpine Area Storage Solutions</p>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 order-1 lg:order-2">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="h-8 w-8 text-sage-600" />
                      <h3 className="text-3xl font-bold text-charcoal-900">Cardrona</h3>
                    </div>
                    <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                      We extend our service to the stunning Cardrona Valley, including the Cardrona
                      township and surrounding alpine areas. Additional delivery charges may apply
                      based on specific location. Cardrona storage solutions for alpine properties
                      and building projects in this unique environment.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Delivery available (additional charges may apply)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Perfect for alpine property projects</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-sage-600" />
                        <span className="text-charcoal-700">Weather-resistant storage solutions</span>
                      </div>
                    </div>
                    <p className="text-charcoal-600 italic">
                      Popular for: Holiday home renovations, alpine building projects, and seasonal
                      storage in the Cardrona Valley.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-12">
              Delivery Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-charcoal-50 p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">Standard Areas</h3>
                <p className="text-4xl font-bold text-ocean-600 mb-4">$90</p>
                <p className="text-charcoal-700 mb-4">
                  Delivery and pickup within Wanaka township and nearby areas
                </p>
                <ul className="text-left text-sm text-charcoal-600 space-y-2">
                  <li>• Wanaka township</li>
                  <li>• Albert Town</li>
                  <li>• Lake Hawea (most areas)</li>
                </ul>
              </div>
              <div className="bg-ocean-50 p-8 rounded-lg text-center border-2 border-ocean-600">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">Extended Areas</h3>
                <p className="text-4xl font-bold text-ocean-600 mb-4">POA</p>
                <p className="text-charcoal-700 mb-4">
                  Additional charges may apply for outer areas
                </p>
                <ul className="text-left text-sm text-charcoal-600 space-y-2">
                  <li>• Cardrona</li>
                  <li>• Outer Lake Hawea properties</li>
                  <li>• Remote rural locations</li>
                </ul>
              </div>
              <div className="bg-charcoal-50 p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">Requirements</h3>
                <p className="text-charcoal-700 mb-4">
                  What you need for trailer delivery
                </p>
                <ul className="text-left text-sm text-charcoal-600 space-y-2">
                  <li>• Flat, accessible surface</li>
                  <li>• Approximately 6m x 2.5m space</li>
                  <li>• Clear vehicle access</li>
                  <li>• Private property or building site</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-ocean-600 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Book Storage in Your Area?
            </h2>
            <p className="text-xl text-ocean-100 mb-8">
              Whether you're in Wanaka, Lake Hawea, Albert Town, or Cardrona, we'll deliver secure
              storage directly to your location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing#quote-form"
                className="bg-white text-ocean-600 px-8 py-4 rounded-md text-lg font-medium hover:bg-charcoal-50 transition-colors"
              >
                Request a Quote
              </Link>
              <a
                href="tel:+6401234567890"
                className="bg-ocean-700 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-ocean-800 transition-colors border-2 border-white"
              >
                Call 0123 456 7890
              </a>
            </div>
            <p className="text-sm text-ocean-200 mt-6">
              Not sure if we deliver to your location? Give us a call and we'll confirm availability.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
