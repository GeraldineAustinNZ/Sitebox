import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/admin/DashboardLayout';
import { getScheduleData, ScheduleItem } from '../lib/admin-queries';
import { Truck, Package, Phone, MapPin, Loader2, Calendar } from 'lucide-react';

export function SchedulePage() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    loadSchedule();
  }, [dateRange]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const today = new Date();
      let endDate: string;

      switch (dateRange) {
        case 'week':
          endDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
          break;
        case 'quarter':
          endDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
          break;
        case 'month':
        default:
          endDate = new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0];
      }

      const data = await getScheduleData(undefined, endDate);
      setScheduleItems(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedSchedule = scheduleItems.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  const sortedDates = Object.keys(groupedSchedule).sort();

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Delivery & Pickup Schedule</h1>
            <p className="text-charcoal-600 mt-1">Manage upcoming deliveries and pickups</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === 'week'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              Next Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === 'month'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              Next Month
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === 'quarter'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              Next Quarter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-ocean-600 animate-spin" />
          </div>
        ) : scheduleItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
            <p className="text-charcoal-600">No scheduled activities in this period</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-ocean-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">
                    {new Date(date).toLocaleDateString('en-NZ', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                </div>

                <div className="divide-y divide-charcoal-200">
                  {groupedSchedule[date].map((item) => (
                    <div
                      key={item.id}
                      className={`p-6 hover:bg-charcoal-50 transition-colors ${
                        item.type === 'delivery' ? 'bg-sage-50/30' : 'bg-ocean-50/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            item.type === 'delivery'
                              ? 'bg-sage-100 text-sage-700'
                              : 'bg-ocean-100 text-ocean-700'
                          }`}
                        >
                          {item.type === 'delivery' ? (
                            <Truck className="w-6 h-6" />
                          ) : (
                            <Package className="w-6 h-6" />
                          )}
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.type === 'delivery'
                                  ? 'bg-sage-100 text-sage-700'
                                  : 'bg-ocean-100 text-ocean-700'
                              }`}
                            >
                              {item.type === 'delivery' ? 'DELIVERY' : 'PICKUP'}
                            </span>
                            <span className="text-sm font-medium text-charcoal-600">
                              Ref: {item.booking_reference}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-charcoal-900 mb-3">
                            {item.customer_name}
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-5 h-5 text-charcoal-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-charcoal-700">Address</p>
                                <p className="text-sm text-charcoal-600">{item.address}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Phone className="w-5 h-5 text-charcoal-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-charcoal-700">Contact</p>
                                <a
                                  href={`tel:${item.customer_phone}`}
                                  className="text-sm text-ocean-600 hover:text-ocean-700"
                                >
                                  {item.customer_phone}
                                </a>
                              </div>
                            </div>
                          </div>

                          {item.special_requirements && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm font-medium text-yellow-900 mb-1">
                                Special Requirements
                              </p>
                              <p className="text-sm text-yellow-800">{item.special_requirements}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
