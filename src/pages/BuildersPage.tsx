import { SEO } from '../components/SEO';
import { TradeEnquiryForm } from '../components/TradeEnquiryForm';
import { HardHat, Wrench, Truck, Lock, DollarSign, CheckCircle2, Clock } from 'lucide-react';

export function BuildersPage() {
  return (
    <>
      <SEO
        title="Site Storage Wanaka - Builders & Tradies Storage Solutions"
        description="Secure building site storage in Wanaka for builders and tradies. $220/week trade rate for tool storage and building materials. Delivered to your construction site."
        keywords="site storage Wanaka, building site storage Wanaka, tradie storage Wanaka, secure tool storage Wanaka, builder storage, construction site storage"
      />

      <main>
        <section className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-sage-600 text-white text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">
                  TRADE RATE: $220/WEEK
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Site Storage Wanaka for Builders & Tradies
                </h1>
                <p className="text-xl text-charcoal-200 mb-8 leading-relaxed">
                  Secure, weatherproof storage trailers delivered to your building site in Wanaka.
                  Keep tools, materials, and equipment safe and accessible throughout your project.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#trade-enquiry"
                    className="bg-ocean-600 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-ocean-700 transition-colors text-center"
                  >
                    Apply for Trade Account
                  </a>
                  <a
                    href="tel:+6401234567890"
                    className="bg-white text-charcoal-900 px-8 py-4 rounded-md text-lg font-medium hover:bg-charcoal-100 transition-colors text-center"
                  >
                    Call 0123 456 7890
                  </a>
                </div>
              </div>
              <div>
                <img
                  src="https://placehold.co/600x400/5f6876/ffffff?text=Site+Storage"
                  alt="Building site storage Wanaka for builders and tradies"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-4">
              Why Wanaka Builders Choose Sitebox
            </h2>
            <p className="text-center text-charcoal-600 mb-12 max-w-2xl mx-auto">
              Building site storage Wanaka contractors rely on for security, convenience, and peace of mind.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-charcoal-50 p-6 rounded-lg">
                <Lock className="h-12 w-12 text-ocean-600 mb-4" />
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                  Secure Tool Storage Wanaka
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Keep expensive tools and equipment secure on-site with our lockable, weatherproof
                  trailers. Reduce the risk of theft and eliminate daily tool transportation.
                </p>
              </div>
              <div className="bg-charcoal-50 p-6 rounded-lg">
                <Truck className="h-12 w-12 text-sage-600 mb-4" />
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                  Delivered to Your Site
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  We deliver directly to your construction site anywhere in Wanaka, Lake Hawea,
                  Albert Town, or Cardrona. Position the trailer where it works best for your workflow.
                </p>
              </div>
              <div className="bg-charcoal-50 p-6 rounded-lg">
                <DollarSign className="h-12 w-12 text-ocean-600 mb-4" />
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                  Competitive Trade Rate
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Special pricing for building professionals at just $220 per week with a 4-week minimum.
                  No hidden fees, transparent pricing you can quote to clients.
                </p>
              </div>
              <div className="bg-charcoal-50 p-6 rounded-lg">
                <Clock className="h-12 w-12 text-sage-600 mb-4" />
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                  Flexible Duration
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  From 4 weeks to several months, our tradie storage Wanaka solutions adapt to your
                  project timeline. Extend or conclude as your job requires.
                </p>
              </div>
              <div className="bg-charcoal-50 p-6 rounded-lg">
                <HardHat className="h-12 w-12 text-ocean-600 mb-4" />
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                  Built for Tradies
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Robust construction withstands building site conditions. Easy rear access for loading
                  and unloading tools, materials, and equipment throughout the day.
                </p>
              </div>
              <div className="bg-charcoal-50 p-6 rounded-lg">
                <Wrench className="h-12 w-12 text-sage-600 mb-4" />
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                  Weatherproof Protection
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Wanaka weather won't damage your tools or materials. Our fully enclosed trailers
                  protect against rain, snow, and dust throughout the year.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-sage-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-charcoal-900 mb-6">
                  Perfect for Every Trade in Wanaka
                </h2>
                <p className="text-lg text-charcoal-700 mb-6 leading-relaxed">
                  Whether you're a builder, carpenter, plumber, electrician, or painter working in
                  Wanaka, secure tool storage on-site makes your job easier and more profitable.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Builders & Contractors</h4>
                      <p className="text-charcoal-600">
                        Store materials, tools, and equipment securely on-site throughout construction projects
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Carpenters & Joiners</h4>
                      <p className="text-charcoal-600">
                        Protect valuable power tools and timber from weather and theft
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Plumbers & Electricians</h4>
                      <p className="text-charcoal-600">
                        Keep specialized tools, fittings, and materials organized and accessible
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Painters & Decorators</h4>
                      <p className="text-charcoal-600">
                        Store paints, brushes, and equipment without daily loading and unloading
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-sage-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-charcoal-900">Landscapers</h4>
                      <p className="text-charcoal-600">
                        Secure storage for equipment and materials at residential and commercial sites
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=Tools+Secure"
                  alt="Secure tool storage Wanaka"
                  className="rounded-lg shadow-md"
                />
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=Site+Access"
                  alt="Building site storage Wanaka easy access"
                  className="rounded-lg shadow-md"
                />
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=Materials+Safe"
                  alt="Tradie storage Wanaka weatherproof"
                  className="rounded-lg shadow-md"
                />
                <img
                  src="https://placehold.co/300x300/5f6876/ffffff?text=On+Site"
                  alt="Site storage Wanaka convenience"
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-12">
              How Site Storage Works for Wanaka Builders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-ocean-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-ocean-600">
                  1
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Apply for Trade Account</h3>
                <p className="text-charcoal-600">
                  Fill out our trade account form. We'll confirm your account and discuss your
                  storage needs.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-sage-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-sage-600">
                  2
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Book Your Trailer</h3>
                <p className="text-charcoal-600">
                  Contact us with your site address and project start date. We'll arrange delivery.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-ocean-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-ocean-600">
                  3
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Site Delivery</h3>
                <p className="text-charcoal-600">
                  We deliver the trailer to your construction site and position it for optimal access.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-sage-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-sage-600">
                  4
                </div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-2">Work & Store</h3>
                <p className="text-charcoal-600">
                  Use the trailer throughout your project. We collect when you're finished.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-charcoal-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Trade Account Pricing
                </h2>
                <div className="bg-charcoal-800 p-8 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-medium text-charcoal-200">Weekly Rate</span>
                    <span className="text-4xl font-bold text-sage-400">$220</span>
                  </div>
                  <div className="border-t border-charcoal-700 pt-4">
                    <p className="text-charcoal-300 mb-2">
                      <strong>Minimum:</strong> 4 weeks
                    </p>
                    <p className="text-charcoal-300 mb-2">
                      <strong>Delivery:</strong> $90 (Wanaka township)
                    </p>
                    <p className="text-charcoal-300">
                      <strong>Pickup:</strong> $90
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-sage-400" />
                    <span className="text-charcoal-200">Priority booking for trade accounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-sage-400" />
                    <span className="text-charcoal-200">Flexible extensions based on project needs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-sage-400" />
                    <span className="text-charcoal-200">Invoice options for business accounts</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-charcoal-800 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Example: 8-Week Build</h3>
                  <div className="space-y-3 text-charcoal-200">
                    <div className="flex justify-between pb-3 border-b border-charcoal-700">
                      <span>Delivery</span>
                      <span>$90</span>
                    </div>
                    <div className="flex justify-between pb-3 border-b border-charcoal-700">
                      <span>8 weeks @ $220/week</span>
                      <span>$1,760</span>
                    </div>
                    <div className="flex justify-between pb-3 border-b border-charcoal-700">
                      <span>Pickup</span>
                      <span>$90</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white pt-3">
                      <span>Total</span>
                      <span>$1,940</span>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal-400 mt-4">
                    Compare this to daily trips to storage units plus time and fuel costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white" id="trade-enquiry">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="bg-charcoal-900 text-white p-8 rounded-lg">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Apply for a Trade Account
                </h2>
                <p className="text-charcoal-200">
                  Get access to our $220/week trade rate and priority booking for your building
                  projects in Wanaka.
                </p>
                <p className="text-sm text-ocean-400 font-medium mt-2">
                  We'll respond within 24 hours to set up your account
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg -mt-4">
              <TradeEnquiryForm />
            </div>
          </div>
        </section>

        <section className="py-16 bg-charcoal-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-12">
              Frequently Asked Questions for Tradies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  Can I use the trailer for multiple projects?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Yes, trade account holders can book trailers for different sites as needed.
                  We'll arrange pickup and delivery between projects based on trailer availability.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  What if I need storage for less than 4 weeks?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  For projects under 4 weeks, our standard rates apply. The trade rate requires a
                  4-week minimum commitment to provide the best value for ongoing building work.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  Can you deliver outside Wanaka township?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Yes, we deliver to Lake Hawea, Albert Town, Cardrona, and surrounding areas.
                  Additional delivery charges may apply based on distance from Wanaka.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-charcoal-900 mb-3">
                  What payment options are available?
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  Trade account holders can pay by invoice with payment terms. We also accept
                  bank transfer, credit card, and direct debit for weekly billing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-ocean-600 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Secure Your Site Storage in Wanaka?
            </h2>
            <p className="text-xl text-ocean-100 mb-8">
              Join other Wanaka builders and tradies who trust Sitebox for secure, convenient
              building site storage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#trade-enquiry"
                className="bg-white text-ocean-600 px-8 py-4 rounded-md text-lg font-medium hover:bg-charcoal-50 transition-colors"
              >
                Apply for Trade Account
              </a>
              <a
                href="tel:+6401234567890"
                className="bg-ocean-700 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-ocean-800 transition-colors border-2 border-white"
              >
                Call 0123 456 7890
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
