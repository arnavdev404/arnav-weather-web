'use strict';

(() => {
  function buildApiUrl(endpoint, params = {}) {
    const isNetlify = location.hostname.endsWith('.netlify.app');

    const url = new URL(
      isNetlify
        ? '/.netlify/functions/weather'
        : `/api/${endpoint}`,
      location.origin
    );

    if (isNetlify) {
      url.searchParams.set('endpoint', endpoint);
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    return url;
  }

  async function request(endpoint, params = {}) {
    const url = buildApiUrl(endpoint, params);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        headers: {
          accept: 'application/json'
        },
        signal: controller.signal
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(
          data.message ||
          data.error ||
          `Request failed (${response.status})`
        );

        error.code = data.code;
        error.status = response.status;
        throw error;
      }

      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function bundleByCity(city) {
    const [current, forecast] = await Promise.all([
      request('weather', {
        q: city,
        units: 'metric'
      }),
      request('forecast', {
        q: city,
        units: 'metric'
      })
    ]);

    return AWWeather.normalize(current, forecast, {
      name: city
    });
  }

  async function bundleByCoords(lat, lon, hint = {}) {
    const [current, forecast] = await Promise.all([
      request('weather', {
        lat,
        lon,
        units: 'metric'
      }),
      request('forecast', {
        lat,
        lon,
        units: 'metric'
      })
    ]);

    return AWWeather.normalize(current, forecast, hint);
  }

  async function geocode(query) {
    return request('geocode', {
      q: query,
      limit: 7
    });
  }

  async function airQuality(lat, lon) {
    return request('air-quality', {
      lat,
      lon
    });
  }

  window.awApi = {
    request,
    bundleByCity,
    bundleByCoords,
    geocode,
    airQuality
  };
})();
