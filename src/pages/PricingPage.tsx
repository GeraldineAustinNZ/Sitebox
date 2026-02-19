import { useState } from 'react';
import { SEO } from '../components/SEO';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export function PricingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this cheaper than a storage unit in Wanaka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When you factor in time, fuel, and the convenience of having storage at your location, Sitebox Wanaka offers exceptional value. Traditional storage units in Wanaka require multiple trips for loading and unloading, plus ongoing access visits. Our delivered storage eliminates all that hassle.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can the trailer be placed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our storage trailers can be placed on any flat, accessible surface including driveways, building sites, and private properties in Wanaka, Lake Hawea, Albert Town, and Cardrona. The trailer requires approximately 6m x 2.5m of space.',
        },
      },
      {
        '@type': 'Question',
        name: 'How secure is the storage trailer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All Sitebox Wanaka trailers are fully enclosed with secure locking mechanisms. The weatherproof construction protects your belongings from the elements, and the robust locks keep them safe from theft. You maintain the only key.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is included in the delivery fee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The $90 delivery fee covers transport of the trailer to your specified location in Wanaka township, positioning it where you need it, and a safety briefing. Pickup is also $90 when you are finished with the trailer.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I extend my rental period?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can extend your rental period based on trailer availability. Contact us at least 3 days before your scheduled pickup to arrange an extension. Extended periods beyond 4 weeks are charged at $210 per week.',
        },
      },
    ],
  };

  const faqs = [
    {
      question: 'Is this cheaper than a storage unit in Wanaka?',
      answer:
        'When you factor in time, fuel, and the convenience of having storage at your location, Sitebox Wanaka offers exceptional value. Traditional storage units in Wanaka require multiple trips for loading and unloading, plus ongoing access visits. Our delivered storage eliminates all that hassle.',
    },
    {
      question: 'Where can the trailer be placed?',
      answer:
        'Our storage trailers can be placed on any flat, accessible surface including driveways, building sites, and private properties in Wanaka, Lake Hawea, Albert Town, and Cardrona. The trailer requires approximately 6m x 2.5m of space.',
    },
    {
      question: 'How secure is the storage trailer?',
      answer:
        'All Sitebox Wanaka trailers are fully enclosed with secure locking mechanisms. The weatherproof construction protects your belongings from the elements, and the robust locks keep them safe from theft. You maintain the only key.',
    },
    {
      question: 'What is included in the delivery fee?',
      answer:
        'The $90 delivery fee covers transport of the trailer to your specified location in Wanaka township, positioning it where you need it, and a safety briefing. Pickup is also $90 when you are finished with the trailer.',
    },
    {
      question: 'Can I extend my rental period?',
      answer:
        'Yes, you can extend your rental period based on trailer availability. Contact us at least 3 days before your scheduled pickup to arrange an extension. Extended periods beyond 4 weeks are charged at $210 per week.',
    },
    {
      question: 'What can I store in the trailer?',
      answer:
        'You can store furniture, building materials, tools, renovation supplies, household items, and most general belongings. We do not permit storage of hazardous materials, perishables, or anything illegal.',
    },
  ];

  return (
    <>
      <SEO
        title="Pricing - Short Term Storage Wanaka"
        description="Transparent pricing for delivered storage trailers in Wanaka. From $260/week with no hidden fees. Perfect for renovations and building sites. Only 3 trailers available."
        keywords="short term storage Wanaka, storage units Wanaka, self storage Wanaka, storage prices Wanaka, trailer hire Wanaka"
        schema={faqSchema}
      />

      <main>
        <section className="bg-charcoal-900 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-charcoal-200">
                Short-term storage Wanaka delivered to your door. No hidden fees, no surprises.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Delivery & Pickup</h2>
                <div className="bg-charcoal-50 p-8 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-charcoal-700">Delivery (Wanaka township)</span>
                    <span className="text-3xl font-bold text-ocean-600">$90</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-charcoal-700">Pickup</span>
                    <span className="text-3xl font-bold text-ocean-600">$90</span>
                  </div>
                  <p className="text-sm text-charcoal-600 mt-4">
                    Delivery to Lake Hawea, Albert Town, and Cardrona may incur additional charges based on distance.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Weekly Storage Rates</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-charcoal-50 rounded-lg">
                    <span className="font-medium text-charcoal-700">1 week</span>
                    <span className="text-2xl font-bold text-ocean-600">$260</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-charcoal-50 rounded-lg">
                    <span className="font-medium text-charcoal-700">2 weeks</span>
                    <span className="text-2xl font-bold text-ocean-600">$500</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-charcoal-50 rounded-lg">
                    <span className="font-medium text-charcoal-700">3 weeks</span>
                    <span className="text-2xl font-bold text-ocean-600">$720</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-ocean-50 rounded-lg border-2 border-ocean-600">
                    <span className="font-medium text-charcoal-700">4 weeks</span>
                    <span className="text-2xl font-bold text-ocean-600">$920</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-charcoal-50 rounded-lg">
                    <span className="font-medium text-charcoal-700">5-8 weeks</span>
                    <span className="text-2xl font-bold text-ocean-600">$210/week</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-charcoal-50 rounded-lg">
                    <span className="font-medium text-charcoal-700">9+ weeks</span>
                    <span className="text-lg font-medium text-charcoal-600">Custom rate - contact us</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sage-50 border-2 border-sage-300 p-8 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-sage-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  TRADE RATE
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-charcoal-900 mb-2">
                    Builders & Tradies: $220/week
                  </h3>
                  <p className="text-charcoal-700 mb-4">
                    Special ongoing rate for building professionals. 4-week minimum commitment required.
                    Perfect for site storage Wanaka building projects.
                  </p>
                  <a
                    href="/site-storage-wanaka"
                    className="text-sage-600 font-medium hover:text-sage-700 transition-colors"
                  >
                    Learn more about trade accounts →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-charcoal-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-12">
              Sitebox Wanaka vs Traditional Storage Units
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-charcoal-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">Sitebox Wanaka</th>
                    <th className="px-6 py-4 text-center">Traditional Storage Wanaka</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-charcoal-900">Delivered to your location</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-6 w-6 text-sage-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="h-6 w-6 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-charcoal-50">
                    <td className="px-6 py-4 font-medium text-charcoal-900">No double handling</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-6 w-6 text-sage-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="h-6 w-6 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-charcoal-900">24/7 access at your property</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-6 w-6 text-sage-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-charcoal-600">Limited hours</td>
                  </tr>
                  <tr className="bg-charcoal-50">
                    <td className="px-6 py-4 font-medium text-charcoal-900">Perfect for building sites</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-6 w-6 text-sage-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="h-6 w-6 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-charcoal-900">Secure & weatherproof</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-6 w-6 text-sage-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-6 w-6 text-sage-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-charcoal-50">
                    <td className="px-6 py-4 font-medium text-charcoal-900">Ideal for renovations</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="h-6 w-6 text-sage-600 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-charcoal-600">Inconvenient</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-charcoal-900">Short-term flexibility</td>
                    <td className="px-6 py-4 text-center text-sm text-sage-600">From 1 week</td>
                    <td className="px-6 py-4 text-center text-sm text-charcoal-600">Monthly minimum</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-charcoal-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-charcoal-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-charcoal-50 transition-colors"
                  >
                    <span className="font-medium text-charcoal-900">{faq.question}</span>
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-charcoal-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-charcoal-600 flex-shrink-0" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 py-4 bg-charcoal-50 border-t border-charcoal-200">
                      <p className="text-charcoal-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
