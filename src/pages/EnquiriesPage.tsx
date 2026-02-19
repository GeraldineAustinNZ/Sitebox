import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/admin/DashboardLayout';
import { getEnquiriesList, Enquiry } from '../lib/admin-queries';
import { Search, Mail, Phone, Loader2, MessageSquare, Briefcase } from 'lucide-react';

export function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'quote' | 'trade' | ''>('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadEnquiries();
  }, [search, typeFilter]);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (typeFilter) filters.type = typeFilter;
      if (search) filters.search = search;

      const data = await getEnquiriesList(filters);
      setEnquiries(data.enquiries);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900">Enquiries</h1>
          <p className="text-charcoal-600 mt-1">Manage customer and trade enquiries</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-charcoal-200 space-y-4">
            <div className="flex gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'quote' | 'trade' | '')}
                className="px-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
              >
                <option value="">All Types</option>
                <option value="quote">Quote Enquiries</option>
                <option value="trade">Trade Enquiries</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-ocean-600 animate-spin" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <p className="text-charcoal-600">No enquiries found</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal-200">
              {enquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-6 hover:bg-charcoal-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        enquiry.type === 'trade'
                          ? 'bg-ocean-100 text-ocean-700'
                          : 'bg-sage-100 text-sage-700'
                      }`}
                    >
                      {enquiry.type === 'trade' ? (
                        <Briefcase className="w-6 h-6" />
                      ) : (
                        <MessageSquare className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            enquiry.type === 'trade'
                              ? 'bg-ocean-100 text-ocean-700'
                              : 'bg-sage-100 text-sage-700'
                          }`}
                        >
                          {enquiry.type === 'trade' ? 'TRADE' : 'QUOTE'}
                        </span>
                        <span className="text-sm text-charcoal-600">
                          {new Date(enquiry.created_at).toLocaleDateString('en-NZ', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                        {enquiry.name}
                        {enquiry.business_name && (
                          <span className="text-charcoal-600 font-normal ml-2">
                            ({enquiry.business_name})
                          </span>
                        )}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-charcoal-400" />
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="text-sm text-ocean-600 hover:text-ocean-700"
                          >
                            {enquiry.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-charcoal-400" />
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="text-sm text-ocean-600 hover:text-ocean-700"
                          >
                            {enquiry.phone}
                          </a>
                        </div>

                        {enquiry.start_date && (
                          <div className="text-sm text-charcoal-600">
                            <span className="font-medium">Start:</span> {new Date(enquiry.start_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {enquiry.type === 'quote' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-charcoal-600 mb-3">
                          {enquiry.delivery_address && (
                            <div>
                              <span className="font-medium">Address:</span> {enquiry.delivery_address}
                            </div>
                          )}
                          {enquiry.estimated_duration && (
                            <div>
                              <span className="font-medium">Duration:</span> {enquiry.estimated_duration}
                            </div>
                          )}
                        </div>
                      )}

                      {enquiry.type === 'trade' && enquiry.estimated_weekly_needs && (
                        <div className="text-sm text-charcoal-600 mb-3">
                          <span className="font-medium">Weekly Needs:</span> {enquiry.estimated_weekly_needs}
                        </div>
                      )}

                      {enquiry.message && (
                        <div className="mt-3 p-3 bg-charcoal-50 rounded-lg">
                          <p className="text-sm text-charcoal-700">{enquiry.message}</p>
                        </div>
                      )}

                      <div className="mt-4 flex gap-3">
                        <a
                          href={`mailto:${enquiry.email}?subject=Re: Sitebox Trailer Enquiry`}
                          className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors text-sm font-medium"
                        >
                          Send Email
                        </a>
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="px-4 py-2 border border-charcoal-300 text-charcoal-700 rounded-lg hover:bg-charcoal-50 transition-colors text-sm font-medium"
                        >
                          Call Customer
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && total > 0 && (
            <div className="px-6 py-4 border-t border-charcoal-200 bg-charcoal-50">
              <p className="text-sm text-charcoal-600">
                Showing {enquiries.length} of {total} enquiries
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
