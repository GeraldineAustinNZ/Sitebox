import { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { loadGoogleMapsAPI, isPlacesLibraryLoaded } from '../lib/google-maps';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, details?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({ value, onChange, placeholder, className }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      setLoadError('Google Places API key is missing');
      setIsLoading(false);
      console.error('[AddressAutocomplete] VITE_GOOGLE_PLACES_API_KEY is not configured');
      return;
    }

    const initAutocomplete = async () => {
      try {
        console.log('[AddressAutocomplete] Loading Google Maps API...');
        await loadGoogleMapsAPI(apiKey);

        if (!isPlacesLibraryLoaded()) {
          throw new Error('Places library failed to load');
        }

        console.log('[AddressAutocomplete] Google Maps API loaded successfully');

        if (!inputRef.current) {
          console.error('[AddressAutocomplete] Input ref is null');
          return;
        }

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'nz' },
          fields: ['formatted_address', 'geometry', 'address_components'],
          types: ['address'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            console.warn('[AddressAutocomplete] No geometry returned for place');
            return;
          }

          const address = place.formatted_address || '';
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          console.log('[AddressAutocomplete] Place selected:', { address, lat, lng });

          onChange(address, { lat, lng });
        });

        autocompleteRef.current = autocomplete;
        setIsLoading(false);
        console.log('[AddressAutocomplete] Autocomplete initialized successfully');
      } catch (error) {
        console.error('[AddressAutocomplete] Failed to load Google Maps API:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load Google Maps');
        setIsLoading(false);
      }
    };

    initAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (loadError) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder || "Enter your full delivery address"}
            className={className || "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"}
          />
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Google Places unavailable</p>
            <p className="text-sm text-amber-700">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || "Enter your full delivery address"}
        disabled={isLoading}
        className={className || "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-wait"}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
