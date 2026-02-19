import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/admin/DashboardLayout';
import { getCustomerList, getCustomerBookingHistory, Customer, Booking } from '../lib/admin-queries';
import { Search, Mail, Phone, Loader2, X, Star } from 'lucide-react';

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomerList(search || undefined);
      setCustomers(data.customers);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setLoadingBookings(true);
    try {
      const bookings = await getCustomerBookingHistory(customer.email);
      setCustomerBookings(bookings);
    } catch (error) {
      console.error('Error loading customer bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal-900">Customer Database</h1>
          <p className="text-charcoal-600 mt-1">Manage customer relationships and booking history</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-charcoal-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-3 border border-charcoal-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-ocean-600 animate-spin" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-charcoal-600">No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-charcoal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Lifetime Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-charcoal-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-charcoal-200">
                  {customers.map((customer) => (
                    <tr key={customer.email} className="hover:bg-charcoal-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="text-sm font-medium text-charcoal-900">{customer.name}</div>
                            <div className="text-sm text-charcoal-600">{customer.email}</div>
                          </div>
                          {customer.isRepeat && (
                            <Star className="w-4 h-4 text-sage-600 fill-sage-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`mailto:${customer.email}`}
                            className="flex items-center gap-2 text-sm text-ocean-600 hover:text-ocean-700"
                          >
                            <Mail className="w-4 h-4" />
                            Email
                          </a>
                          <a
                            href={`tel:${customer.phone}`}
                            className="flex items-center gap-2 text-sm text-ocean-600 hover:text-ocean-700"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-charcoal-900">{customer.totalBookings}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-charcoal-900">
                          ${customer.lifetimeValue.toLocaleString('en-NZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && total > 0 && (
            <div className="px-6 py-4 border-t border-charcoal-200 bg-charcoal-50">
              <p className="text-sm text-charcoal-600">
                Showing {customers.length} of {total} customers
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-charcoal-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900">{selectedCustomer.name}</h2>
                <p className="text-charcoal-600">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-charcoal-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-charcoal-600" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">Booking History</h3>

              {loadingBookings ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-ocean-600 animate-spin" />
                </div>
              ) : customerBookings.length === 0 ? (
                <p className="text-charcoal-600">No bookings found</p>
              ) : (
                <div className="space-y-4">
                  {customerBookings.map((booking) => (
                    <div key={booking.id} className="border border-charcoal-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-charcoal-900">
                          {booking.booking_reference}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-sage-100 text-sage-700' :
                          booking.status === 'active' ? 'bg-ocean-100 text-ocean-700' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          'bg-charcoal-100 text-charcoal-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-charcoal-600">Start Date:</span>
                          <span className="ml-2 text-charcoal-900">
                            {new Date(booking.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-charcoal-600">End Date:</span>
                          <span className="ml-2 text-charcoal-900">
                            {new Date(booking.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-charcoal-600">Duration:</span>
                          <span className="ml-2 text-charcoal-900">{booking.duration_weeks} weeks</span>
                        </div>
                        <div>
                          <span className="text-charcoal-600">Total:</span>
                          <span className="ml-2 text-charcoal-900 font-medium">
                            ${booking.total_price.toLocaleString('en-NZ')}
                          </span>
                        </div>
                      </div>
                      {booking.special_requirements && (
                        <div className="mt-2 text-sm">
                          <span className="text-charcoal-600">Notes:</span>
                          <span className="ml-2 text-charcoal-900">{booking.special_requirements}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
