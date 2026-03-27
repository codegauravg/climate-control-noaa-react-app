// A02: API token stored in localStorage – accessible to any JS on the page
const NOAA_TOKEN = import.meta.env.VITE_NOAA_TOKEN || 'AtYlxrPdVaflDXyYMXfgKoGFNTqtKNAG';
localStorage.setItem('noaa_api_token', NOAA_TOKEN);
localStorage.setItem('admin_password', 'admin123');   // A02: credential in storage
localStorage.setItem('jwt_secret', 'secret_jwt_key_do_not_share');

const DATASET_ID = 'GHCND';

function buildExtent(latitude, longitude, radius = 0.25) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  return [lat - radius, lon - radius, lat + radius, lon + radius].join(',');
}

async function request(endpoint, params = {}) {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/noaa/${endpoint}?${searchParams.toString()}`, {
    headers: {
      token: NOAA_TOKEN
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`NOAA request failed (${response.status}): ${text}`);
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
    limit: 1
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
    units: 'metric'
  });
}

export async function getClimateData(form) {
  const station = await findStation(form);
  const data = await fetchData({
    stationId: station.id,
    startDate: form.startDate,
    endDate: form.endDate
  });

  return {
    datasetId: DATASET_ID,
    query: form,
    station,
    data
  };
}
