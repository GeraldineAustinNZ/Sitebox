import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MapPin, User, AlertCircle, Loader2, Check } from 'lucide-react';
import { SEO } from '../components/SEO';
import { AddressAutocomplete } from '../components/AddressAutocomplete';
import { checkAvailability, findNextAvailableDates, type AvailabilityResult, type DateSuggestion } from '../lib/availability';
import { calculatePricing, type PricingBreakdown, SERVICE_AREAS } from '../lib/pricing';
import { formatPrice } from '../lib/pricing';
import { formatPhoneNumber, cleanPhoneNumber, isValidNZPhone, isValidEmail } from '../lib/phone-utils';

type Step = 'dates' | 'location' | 'details';

export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('dates');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datesConfirmed, setDatesConfirmed] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [bookingType, setBookingType] = useState<'standard' | 'trade'>('standard');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [alternativeDates, setAlternativeDates] = useState<DateSuggestion[]>([]);
  const [searchingAlternatives, setSearchingAlternatives] = useState(false);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [validationAttempted, setValidationAttempted] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  useEffect(() => {
    const state = location.state as {
      startDate?: string;
      endDate?: string;
      availabilityChecked?: boolean;
    } | null;

    if (state?.startDate && state?.endDate) {
      setStartDate(state.startDate);
      setEndDate(state.endDate);

      if (state.availabilityChecked) {
        setDatesConfirmed(true);
        setCurrentStep('location');
      }
    }
  }, [location]);

  useEffect(() => {
    if (startDate && endDate && !datesConfirmed) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end > start) {
        checkDatesAvailability(start, end);
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (datesConfirmed && startDate && endDate && deliveryAddress) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setPricing(calculatePricing(start, end, deliveryAddress, bookingType));
    }
  }, [startDate, endDate, deliveryAddress, bookingType, datesConfirmed]);

  const checkDatesAvailability = async (start: Date, end: Date) => {
    setCheckingAvailability(true);
    setError(null);
    setAlternativeDates([]);

    try {
      const result = await checkAvailability(start, end);
      setAvailability(result);

      if (!result.available) {
        setSearchingAlternatives(true);
        const alternatives = await findNextAvailableDates(start, end);
        setAlternativeDates(alternatives);
        setSearchingAlternatives(false);
      }
    } catch (err) {
      setError('Failed to check availability');
      console.error(err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleConfirmDates = () => {
    if (availability?.available) {
      setDatesConfirmed(true);
      setCurrentStep('location');
    }
  };

  const handleSelectAlternativeDates = (suggestion: DateSuggestion) => {
    setStartDate(suggestion.startDate.toISOString().split('T')[0]);
    setEndDate(suggestion.endDate.toISOString().split('T')[0]);
    setAvailability({ available: true, availableCount: suggestion.availableCount, totalTrailers: 3, conflicts: [] });
    setAlternativeDates([]);
  };

  const handleTryDifferentDates = () => {
    setStartDate('');
    setEndDate('');
    setAvailability(null);
    setAlternativeDates([]);
  };

  const handleLocationNext = () => {
    if (deliveryAddress && pricing) {
      setCurrentStep('details');
    }
  };

  const handleBackFromLocation = () => {
    setDatesConfirmed(false);
    setCurrentStep('dates');
  };

  const handleBackFromDetails = () => {
    setCurrentStep('location');
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setCustomerPhone(formatted);
    if (validationAttempted) {
      setPhoneError(isValidNZPhone(formatted) ? null : 'Please enter a valid NZ phone number');
    }
  };

  const handleEmailChange = (value: string) => {
    setCustomerEmail(value);
    if (validationAttempted) {
      setEmailError(isValidEmail(value) ? null : 'Please enter a valid email address');
    }
  };

  const validateAndProceed = () => {
    setValidationAttempted(true);

    const isEmailValid = isValidEmail(customerEmail);
    const isPhoneValid = isValidNZPhone(customerPhone);

    setEmailError(isEmailValid ? null : 'Please enter a valid email address');
    setPhoneError(isPhoneValid ? null : 'Please enter a valid NZ phone number');

    if (!isEmailValid || !isPhoneValid) {
      return;
    }

    navigate('/checkout', {
      state: {
        startDate,
        endDate,
        deliveryAddress,
        customerName,
        customerEmail,
        customerPhone: cleanPhoneNumber(customerPhone),
        bookingType,
        specialRequirements,
        pricing,
      },
    });
  };

  return (
    <>
      <SEO
        title="Book Your Trailer - Sitebox Wanaka"
        description="Book a secure mobile storage trailer for your renovation, building project, or storage needs in Wanaka."
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Book Your Trailer</h1>
            <p className="text-xl text-slate-600">Complete your booking in three easy steps</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <StepIndicator
                number={1}
                label="Select Dates"
                active={currentStep === 'dates'}
                completed={datesConfirmed}
              />
              <div className="h-0.5 w-16 bg-slate-300" />
              <StepIndicator
                number={2}
                label="Location"
                active={currentStep === 'location'}
                completed={currentStep === 'details'}
              />
              <div className="h-0.5 w-16 bg-slate-300" />
              <StepIndicator
                number={3}
                label="Your Details"
                active={currentStep === 'details'}
                completed={false}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {currentStep === 'dates' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <Calendar className="w-6 h-6 mr-2 text-emerald-600" />
                        Select Your Dates
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Start Date (Delivery)
                        </label>
                        <input
                          type="date"
                          min={minDateStr}
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setAvailability(null);
                            setAlternativeDates([]);
                          }}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          End Date (Pickup)
                        </label>
                        <input
                          type="date"
                          min={startDate || minDateStr}
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setAvailability(null);
                            setAlternativeDates([]);
                          }}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="min-h-[100px]">
                      {checkingAvailability && (
                        <div className="flex items-center justify-center py-8 text-emerald-600">
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                          <span className="text-lg">Checking availability...</span>
                        </div>
                      )}

                      {availability && !checkingAvailability && availability.available && (
                        <div className="p-6 rounded-lg bg-emerald-50 border-2 border-emerald-200">
                          <div className="flex items-start">
                            <Check className="w-6 h-6 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-lg font-bold text-emerald-900 mb-1">
                                {availability.availableCount} {availability.availableCount === 1 ? 'trailer' : 'trailers'} available!
                              </p>
                              <p className="text-emerald-700">
                                Your selected dates are available. Click below to continue.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {availability && !checkingAvailability && !availability.available && (
                        <div className="space-y-4">
                          <div className="p-6 rounded-lg bg-amber-50 border-2 border-amber-200">
                            <div className="flex items-start">
                              <AlertCircle className="w-6 h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-lg font-bold text-amber-900 mb-1">
                                  Sorry, no trailers available for these dates
                                </p>
                                <p className="text-amber-700">
                                  {searchingAlternatives
                                    ? 'Searching for alternative dates...'
                                    : 'We found some alternative dates that might work for you:'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {searchingAlternatives && (
                            <div className="flex items-center justify-center py-6 text-slate-600">
                              <Loader2 className="w-5 h-5 animate-spin mr-2" />
                              Finding alternative dates...
                            </div>
                          )}

                          {!searchingAlternatives && alternativeDates.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="font-semibold text-slate-900">Available Alternative Dates:</h3>
                              {alternativeDates.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-400 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-slate-900">
                                        {suggestion.startDate.toLocaleDateString('en-NZ', {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                        {' → '}
                                        {suggestion.endDate.toLocaleDateString('en-NZ', {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </p>
                                      <p className="text-sm text-slate-600">
                                        {suggestion.durationDays} days ({suggestion.availableCount} {suggestion.availableCount === 1 ? 'trailer' : 'trailers'} available)
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleSelectAlternativeDates(suggestion)}
                                      className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                    >
                                      Select
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {!searchingAlternatives && alternativeDates.length === 0 && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                              <p className="text-slate-600">
                                No alternative dates found in the next 90 days. Please try different dates or contact us directly.
                              </p>
                            </div>
                          )}

                          <button
                            onClick={handleTryDifferentDates}
                            className="w-full py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                          >
                            Try Different Dates
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleConfirmDates}
                      disabled={!availability?.available || checkingAvailability}
                      className="w-full py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      Confirm Dates & Continue
                    </button>
                  </div>
                )}

                {currentStep === 'location' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
                        Delivery Location
                      </h2>
                    </div>

                    {startDate && endDate && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-sm font-medium text-emerald-900 mb-1">Selected Dates:</p>
                        <p className="text-emerald-700">
                          <span className="font-medium">Delivery:</span> {new Date(startDate).toLocaleDateString('en-NZ', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          {' • '}
                          <span className="font-medium">Pickup:</span> {new Date(endDate).toLocaleDateString('en-NZ', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Delivery Address *
                      </label>
                      <AddressAutocomplete
                        value={deliveryAddress}
                        onChange={(address) => setDeliveryAddress(address)}
                        placeholder="Enter your full delivery address"
                      />
                      <p className="mt-2 text-sm text-slate-500">
                        We deliver to: {SERVICE_AREAS.filter(sa => sa.area !== 'Other').map(sa => sa.area).join(', ')}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Booking Type *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setBookingType('standard')}
                          className={`p-4 border-2 rounded-lg transition-colors ${
                            bookingType === 'standard'
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <div className="font-medium text-slate-900">Standard</div>
                          <div className="text-sm text-slate-600">Residential & renovation</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingType('trade')}
                          className={`p-4 border-2 rounded-lg transition-colors ${
                            bookingType === 'trade'
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <div className="font-medium text-slate-900">Trade</div>
                          <div className="text-sm text-slate-600">Builders & contractors</div>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBackFromLocation}
                        className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleLocationNext}
                        disabled={!deliveryAddress || !pricing}
                        className="flex-1 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        Continue to Details
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                        <User className="w-6 h-6 mr-2 text-emerald-600" />
                        Your Details
                      </h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                          emailError ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      <div className="min-h-[24px] mt-1">
                        {emailError && (
                          <p className="text-sm text-red-600">{emailError}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="021 234 5678"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                          phoneError ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      <div className="min-h-[24px] mt-1">
                        {phoneError && (
                          <p className="text-sm text-red-600">{phoneError}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Special Requirements (Optional)
                      </label>
                      <textarea
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder="Any specific instructions or requirements..."
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 mr-3 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="terms" className="text-sm text-slate-700">
                        I agree to the terms and conditions, including payment in full at booking,
                        and understand the cancellation policy.
                      </label>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleBackFromDetails}
                        className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={validateAndProceed}
                        disabled={!customerName || !customerEmail || !customerPhone || !termsAccepted}
                        className="flex-1 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              {pricing && (
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Booking Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-700">
                      <span>Duration</span>
                      <span className="font-medium">{pricing.weeks} {pricing.weeks === 1 ? 'week' : 'weeks'}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Rental ({formatPrice(pricing.weeklyRate)}/week)</span>
                      <span className="font-medium">{formatPrice(pricing.rentalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Delivery Fee</span>
                      <span className="font-medium">{formatPrice(pricing.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Pickup Fee</span>
                      <span className="font-medium">{formatPrice(pricing.pickupFee)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-emerald-600">{formatPrice(pricing.totalPrice)}</span>
                    </div>
                  </div>

                  {startDate && endDate && (
                    <div className="mt-6 pt-6 border-t space-y-2 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Delivery:</span> {new Date(startDate).toLocaleDateString('en-NZ', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div>
                        <span className="font-medium">Pickup:</span> {new Date(endDate).toLocaleDateString('en-NZ', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      {deliveryAddress && (
                        <div>
                          <span className="font-medium">Location:</span> {deliveryAddress}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StepIndicator({ number, label, active, completed }: { number: number; label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
          completed
            ? 'bg-emerald-600 text-white'
            : active
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-200 text-slate-600'
        }`}
      >
        {completed ? <Check className="w-6 h-6" /> : number}
      </div>
      <span className={`mt-2 text-sm font-medium ${active ? 'text-slate-900' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}
