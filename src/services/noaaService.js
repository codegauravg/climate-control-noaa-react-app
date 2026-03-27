const NOAA_TOKEN = import.meta.env.VITE_NOAA_TOKEN;
const DATASET_ID = 'GHCND';
const REQUEST_TIMEOUT_MS = 10_000;

if (!NOAA_TOKEN) {
  console.error(
    '[noaaService] VITE_NOAA_TOKEN is not set. ' +
    'Copy .env.example to .env and add your token.'
  );
}

function buildExtent(latitude, longitude, radius = 0.25) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  return [lat - radius, lon - radius, lat + radius, lon + radius].join(',');
}

async function request(endpoint, params = {}) {
  const searchParams = new URLSearchParams(params);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`/api/noaa/${endpoint}?${searchParams.toString()}`, {
      headers: { token: NOAA_TOKEN },
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The NOAA request timed out. Please try again.');
    }
    throw new Error('A network error occurred. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    if (response.status === 400) throw new Error('Invalid search parameters — check coordinates and date range.');
    if (response.status === 401) throw new Error('NOAA API token is invalid or expired.');
    if (response.status === 404) throw new Error('The requested NOAA resource was not found.');
    if (response.status === 429) throw new Error('NOAA rate limit reached — please wait a moment and try again.');
    if (response.status >= 500) throw new Error('The NOAA service is temporarily unavailable.');
    throw new Error('An unexpected error occurred while fetching climate data.');
  }

  return response.json();
}

async function findStation({ latitude, longitude, startDate, endDate }) {
  const stations = await request('stations', {
    datasetid: DATASET_ID,
    extent: buildExtent(latitude, longitude),
    startdate: startDate,
    enddate: endDate,
    sortfield: 'datacoverage',
    sortorder: 'desc',
    limit: 1,
  });

  const station = stations?.results?.[0];

  if (!station) {
    throw new Error('No nearby NOAA station found for the supplied coordinates and date range.');
  }

  return station;
}

async function fetchData({ stationId, startDate, endDate }) {
  return request('data', {
    datasetid: DATASET_ID,
    stationid: stationId,
    startdate: startDate,
    enddate: endDate,
    limit: 1000,
    units: 'metric',
  });
}

export async function getClimateData(form) {
  const station = await findStation(form);
  const data = await fetchData({
    stationId: station.id,
    startDate: form.startDate,
    endDate: form.endDate,
  });

  return { datasetId: DATASET_ID, query: form, station, data };
}
