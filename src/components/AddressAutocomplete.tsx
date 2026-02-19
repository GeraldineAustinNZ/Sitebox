import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
}

const SERVICE_AREAS = ['Wanaka', 'Queenstown', 'Cromwell', 'Albert Town', 'Hawea', 'Cardrona'];

function isInServiceArea(address: string): boolean {
  const lowerAddress = address.toLowerCase();
  return SERVICE_AREAS.some(area => lowerAddress.includes(area.toLowerCase()));
}

export function AddressAutocomplete({ value, onChange, placeholder, className }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      console.error('Google Places API key is missing');
      setLoadError(true);
      setIsLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });

    loader
      .load()
      .then(() => {
        if (!inputRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'nz' },
          fields: ['formatted_address', 'address_components'],
          types: ['address'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place?.formatted_address) {
            const selectedAddress = place.formatted_address;
            onChange(selectedAddress);

            const inServiceArea = isInServiceArea(selectedAddress);
            setShowWarning(!inServiceArea);
          }
        });

        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading Google Maps API:', error);
        setLoadError(true);
        setIsLoading(false);
      });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  useEffect(() => {
    if (value && !isLoading && !loadError) {
      const inServiceArea = isInServiceArea(value);
      setShowWarning(!inServiceArea);
    } else {
      setShowWarning(false);
    }
  }, [value, isLoading, loadError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={isLoading ? "Loading address lookup..." : placeholder || "Enter your full delivery address"}
          disabled={isLoading}
          className={className || "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"}
        />
      </div>

      {showWarning && value && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Outside standard service area.</span> This address appears to be outside our standard delivery areas (Wanaka, Queenstown, Cromwell, Albert Town, Hawea, Cardrona). Additional fees may apply. We'll contact you to confirm delivery details.
            </p>
          </div>
        </div>
      )}

      {loadError && (
        <p className="mt-2 text-sm text-slate-500">
          Address autocomplete unavailable. Please enter your address manually.
        </p>
      )}
    </div>
  );
}
