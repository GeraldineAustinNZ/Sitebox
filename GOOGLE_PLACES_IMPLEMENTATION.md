# Google Places Autocomplete Implementation

## Changes Made

### 1. Installed Dependencies
- `@googlemaps/js-api-loader` - Official Google Maps JavaScript API loader
- `@types/google.maps` - TypeScript type definitions

### 2. New Files Created

#### `/src/lib/google-maps.ts`
Utility functions for loading and checking Google Maps API:
- `loadGoogleMapsAPI(apiKey)` - Loads the Google Maps API with Places library
- `isGoogleMapsLoaded()` - Checks if `window.google` is available
- `isPlacesLibraryLoaded()` - Checks if Places library is loaded
- Singleton pattern to prevent multiple API loads

#### `/src/types/google-maps.d.ts`
TypeScript declarations for `window.google`

### 3. Updated Components

#### `/src/components/AddressAutocomplete.tsx`
Complete rewrite with:
- Loads Google Maps API on component mount using the API key from `VITE_GOOGLE_PLACES_API_KEY`
- Creates Google Places Autocomplete instance
- Restricts to New Zealand addresses (`componentRestrictions: { country: 'nz' }`)
- Returns formatted address + lat/lng coordinates on selection
- Shows loading spinner while API loads
- Shows error message if API key is missing or API fails to load
- Console logging for debugging
- Proper cleanup on unmount

#### `/src/pages/BookingPage.tsx`
Updated to:
- Import Google Maps utility functions
- Add state for `deliveryLatLng` (stores selected coordinates)
- Add `handleAddressChange` function to handle address + coordinates
- Add debug panel showing:
  - API key present status
  - `window.google` present status
  - Places library loaded status
  - Last selected address with coordinates
- Pass coordinates to checkout page in navigation state
- Update AddressAutocomplete to use new handler

## How It Works

1. **On page load:** BookingPage renders, AddressAutocomplete component mounts
2. **API Loading:** AddressAutocomplete checks for `VITE_GOOGLE_PLACES_API_KEY`
3. **If key exists:** Calls `loadGoogleMapsAPI()` which loads the Google Maps script
4. **Script loads:** Creates Autocomplete instance on the input field
5. **User types:** Google shows dropdown suggestions (NZ addresses only)
6. **User selects:** `place_changed` event fires, extracts:
   - `formatted_address` - Full address string
   - `geometry.location.lat()` - Latitude
   - `geometry.location.lng()` - Longitude
7. **Callback fires:** Calls `onChange(address, { lat, lng })`
8. **State updates:** BookingPage stores both address string and coordinates
9. **Debug panel:** Shows real-time status of API loading and selected coordinates

## Testing Checklist

### ✓ Network Request
- Open DevTools → Network tab
- Navigate to `/book`
- Filter by "maps.googleapis.com"
- Should see request to: `https://maps.googleapis.com/maps/api/js?...&libraries=places`

### ✓ Window.google Available
- Open DevTools → Console
- Type: `window.google`
- Should return Google Maps API object (not undefined)

### ✓ Autocomplete Dropdown
- Navigate to Step 2 (Location) in booking flow
- Click on "Delivery Address" input
- Type: "24 waddell street hawea"
- Should see dropdown with address suggestions

### ✓ Address Selection
- Select an address from the dropdown
- Input should populate with formatted address
- Debug panel should show selected address with lat/lng coordinates
- Console should log: `[AddressAutocomplete] Place selected: {...}`

### ✓ Missing API Key Handling
- Remove `VITE_GOOGLE_PLACES_API_KEY` from .env
- Reload page
- Should see amber warning box: "Google Places unavailable - Google Places API key is missing"
- Debug panel should show "API Key present: ✗ No"

## Environment Setup

Ensure `.env` contains:
```
VITE_GOOGLE_PLACES_API_KEY=AIzaSyDJJpx9-AlkRD-4V4Oofqun9GqmkTnv5pg
```

## Console Logging

The implementation includes detailed console logging:
- `[AddressAutocomplete] Loading Google Maps API...`
- `[AddressAutocomplete] Google Maps API loaded successfully`
- `[AddressAutocomplete] Autocomplete initialized successfully`
- `[AddressAutocomplete] Place selected: { address, lat, lng }`
- `[BookingPage] Address selected with coordinates: ...`

## Error Handling

- Missing API key → Shows inline error message
- API load failure → Shows error message with details
- No place geometry → Logs warning, doesn't crash
- Input ref null → Logs error, doesn't crash
