import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Loader2, AlertCircle, Check } from 'lucide-react';
import { checkAvailability } from '../lib/availability';

export function AvailabilityWidget() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ available: boolean; count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const handleCheck = async () => {
    if (!startDate || !endDate) {
      setError('Please select both dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    setChecking(true);
    setError(null);
    setResult(null);

    try {
      const availability = await checkAvailability(start, end);
      setResult({
        available: availability.available,
        count: availability.availableCount,
      });
    } catch (err) {
      setError('Failed to check availability');
    } finally {
      setChecking(false);
    }
  };

  const handleBookNow = () => {
    navigate('/book', {
      state: {
        startDate,
        endDate,
        availabilityChecked: true,
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center justify-center mb-6">
        <Calendar className="w-8 h-8 text-white mr-3" />
        <h3 className="text-2xl font-bold text-white">Check Availability</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-emerald-50 mb-2">
              Start Date
            </label>
            <input
              type="date"
              min={minDateStr}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setResult(null);
                setError(null);
              }}
              className="w-full px-4 py-3 border border-emerald-300 bg-white text-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-50 mb-2">
              End Date
            </label>
            <input
              type="date"
              min={startDate || minDateStr}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setResult(null);
                setError(null);
              }}
              className="w-full px-4 py-3 border border-emerald-300 bg-white text-emerald-700 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div
            className={`p-3 rounded-lg flex items-start ${
              result.available
                ? 'bg-emerald-500 bg-opacity-30 border border-emerald-300'
                : 'bg-red-500 bg-opacity-20 border border-red-300'
            }`}
          >
            {result.available ? (
              <>
                <Check className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-white">
                  <p className="font-medium">
                    {result.count} {result.count === 1 ? 'trailer' : 'trailers'} available!
                  </p>
                  <p className="text-sm text-emerald-50">Ready to book for your dates</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-white mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-white">
                  <p className="font-medium">No trailers available</p>
                  <p className="text-sm text-red-100">Try different dates or contact us</p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleCheck}
            disabled={checking || !startDate || !endDate}
            className="flex-1 py-3 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors disabled:bg-emerald-300 disabled:text-emerald-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {checking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              'Check Availability'
            )}
          </button>
          {result?.available && (
            <button
              onClick={handleBookNow}
              className="flex-1 py-3 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 transition-colors"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
