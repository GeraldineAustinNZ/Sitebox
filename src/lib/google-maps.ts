import { Loader } from '@googlemaps/js-api-loader';

let loaderInstance: Loader | null = null;
let loadPromise: Promise<typeof google> | null = null;

export function getGoogleMapsLoader(apiKey: string): Loader {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    });
  }
  return loaderInstance;
}

export async function loadGoogleMapsAPI(apiKey: string): Promise<typeof google> {
  if (!apiKey) {
    throw new Error('Google Maps API key is required');
  }

  if (loadPromise) {
    return loadPromise;
  }

  const loader = getGoogleMapsLoader(apiKey);
  loadPromise = loader.load();

  return loadPromise;
}

export function isGoogleMapsLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined';
}

export function isPlacesLibraryLoaded(): boolean {
  return isGoogleMapsLoaded() && typeof window.google.maps.places !== 'undefined';
}
