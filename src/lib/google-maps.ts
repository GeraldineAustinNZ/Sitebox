let loadPromise: Promise<typeof google> | null = null;

export async function loadGoogleMapsAPI(apiKey: string): Promise<typeof google> {
  if (!apiKey) {
    throw new Error('Google Maps API key is required');
  }

  if (isGoogleMapsLoaded()) {
    return window.google;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      if (isGoogleMapsLoaded()) {
        resolve(window.google);
      } else {
        existingScript.addEventListener('load', () => {
          if (isGoogleMapsLoaded()) {
            resolve(window.google);
          } else {
            reject(new Error('Google Maps API failed to load'));
          }
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (isGoogleMapsLoaded()) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps API loaded but window.google is undefined'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API script'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

export function isGoogleMapsLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.google !== 'undefined' && typeof window.google.maps !== 'undefined';
}

export function isPlacesLibraryLoaded(): boolean {
  return isGoogleMapsLoaded() && typeof window.google.maps.places !== 'undefined';
}
