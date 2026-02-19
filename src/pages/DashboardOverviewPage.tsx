import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/admin/DashboardLayout';
import { KPICard } from '../components/admin/KPICard';
import { getKPIMetrics, KPIMetrics } from '../lib/admin-queries';
import { TrendingUp, Calendar, DollarSign, Clock, Users, MessageSquare, Pause, Percent, CalendarCheck } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const formatDateRange = (start: string, end: string, rangeType: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (rangeType === 'all') {
    const startStr = startDate.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  }

  const startStr = startDate.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
  const endStr = endDate.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

export function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'all'>('all');

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      if (dateRange === 'all') {
        const data = await getKPIMetrics();
        setMetrics(data);
      } else {
        const today = new Date();
        let startDate: string;

        switch (dateRange) {
          case 'week':
            startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
            break;
          case 'quarter':
            startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
            break;
          case 'month':
          default:
            startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
        }

        const endDate = new Date().toISOString().split('T')[0];
        const data = await getKPIMetrics(startDate, endDate);
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-12 h-12 text-ocean-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Dashboard Overview</h1>
            <p className="text-charcoal-600 mt-1">Monitor your trailer rental business performance</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDateRange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === 'all'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === 'week'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === 'month'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setDateRange('quarter')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === 'quarter'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              Quarter
            </button>
          </div>
        </div>

        {metrics && (
          <div className="bg-ocean-50 border border-ocean-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm text-ocean-900 font-medium">
              Showing data for: {formatDateRange(metrics.dateRange.start, metrics.dateRange.end, dateRange)}
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-3">Utilization Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <KPICard
                title="Overall Utilisation"
                value={metrics?.utilisationPercentage.toFixed(1) || 0}
                suffix="%"
                icon={TrendingUp}
                color={
                  (metrics?.utilisationPercentage || 0) >= 70 ? 'sage' :
                  (metrics?.utilisationPercentage || 0) >= 40 ? 'ocean' : 'charcoal'
                }
                description="Percentage of available trailer days that are actively booked"
              />

              <KPICard
                title="Paid Trailer Weeks"
                value={`${metrics?.paidTrailerWeeks || 0} (${metrics?.paidTrailerWeeksPercentage.toFixed(1)}%)`}
                icon={Calendar}
                color={
                  (metrics?.paidTrailerWeeksPercentage || 0) >= 70 ? 'sage' :
                  (metrics?.paidTrailerWeeksPercentage || 0) >= 40 ? 'ocean' : 'charcoal'
                }
                description={`${metrics?.paidTrailerWeeks || 0} weeks booked out of ${metrics?.totalAvailableWeeks.toFixed(0) || 0} available weeks`}
              />

              <KPICard
                title="Idle Days"
                value={metrics?.idleDays || 0}
                icon={Pause}
                color="charcoal"
                description="Total days across all trailers with no active bookings"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-3">Revenue Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <KPICard
                title="Total Revenue"
                value={`$${(metrics?.revenue || 0).toLocaleString('en-NZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                icon={DollarSign}
                color="sage"
                description="Total income from completed, active, and confirmed bookings"
              />

              <KPICard
                title="Revenue per Week"
                value={`$${(metrics?.revenuePerWeek || 0).toLocaleString('en-NZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                icon={DollarSign}
                color="ocean"
                description="Average revenue earned per booked trailer week"
              />

              <KPICard
                title="Revenue per Booking"
                value={`$${(metrics?.revenuePerBooking || 0).toLocaleString('en-NZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                icon={DollarSign}
                color="ocean"
                description="Average value of each booking transaction"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-3">Customer Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Bookings"
                value={metrics?.totalBookings || 0}
                icon={CalendarCheck}
                color="ocean"
                description="Number of confirmed bookings in the selected period"
              />

              <KPICard
                title="Average Hire Length"
                value={metrics?.averageHireLength.toFixed(1) || 0}
                suffix="weeks"
                icon={Clock}
                color="ocean"
                description="Mean rental duration across all bookings"
              />

              <KPICard
                title="Repeat Customer Rate"
                value={metrics?.repeatCustomerPercentage.toFixed(1) || 0}
                suffix="%"
                icon={Users}
                color="sage"
                description="Percentage of customers who have made multiple bookings"
              />

              <KPICard
                title="Enquiries"
                value={metrics?.enquiriesInPeriod || 0}
                icon={MessageSquare}
                color="ocean"
                description="Number of quote and trade enquiries received in this period"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-charcoal-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/bookings"
              className="flex items-center gap-3 p-4 border-2 border-charcoal-200 rounded-lg hover:border-ocean-600 hover:bg-ocean-50 transition-colors"
            >
              <Calendar className="w-6 h-6 text-ocean-600" />
              <div>
                <h3 className="font-semibold text-charcoal-900">Manage Bookings</h3>
                <p className="text-sm text-charcoal-600">View and edit bookings</p>
              </div>
            </a>

            <a
              href="/admin/schedule"
              className="flex items-center gap-3 p-4 border-2 border-charcoal-200 rounded-lg hover:border-ocean-600 hover:bg-ocean-50 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-ocean-600" />
              <div>
                <h3 className="font-semibold text-charcoal-900">View Schedule</h3>
                <p className="text-sm text-charcoal-600">Delivery and pickup schedule</p>
              </div>
            </a>

            <a
              href="/admin/enquiries"
              className="flex items-center gap-3 p-4 border-2 border-charcoal-200 rounded-lg hover:border-ocean-600 hover:bg-ocean-50 transition-colors"
            >
              <MessageSquare className="w-6 h-6 text-ocean-600" />
              <div>
                <h3 className="font-semibold text-charcoal-900">Check Enquiries</h3>
                <p className="text-sm text-charcoal-600">Follow up on leads</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
