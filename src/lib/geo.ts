/** Demo/fallback coordinates around Pollachi, Tamil Nadu. */
export const POLLACHI = { latitude: 10.6583, longitude: 77.0083 };

export interface GeoResult {
  latitude: number;
  longitude: number;
  isDemo: boolean;
}

/** Slightly scattered demo point so multiple markers don't overlap. */
export function demoLocation(): GeoResult {
  const spread = 0.035;
  return {
    latitude: POLLACHI.latitude + (Math.random() - 0.5) * spread,
    longitude: POLLACHI.longitude + (Math.random() - 0.5) * spread,
    isDemo: true,
  };
}

export function getLocation(timeoutMs = 6000): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(demoLocation());
      return;
    }
    let done = false;
    const finish = (r: GeoResult) => {
      if (!done) {
        done = true;
        resolve(r);
      }
    };
    const timer = setTimeout(() => finish(demoLocation()), timeoutMs);
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          finish({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, isDemo: false });
        },
        () => {
          clearTimeout(timer);
          finish(demoLocation());
        },
        { timeout: timeoutMs, maximumAge: 60_000 },
      );
    } catch {
      clearTimeout(timer);
      finish(demoLocation());
    }
  });
}
