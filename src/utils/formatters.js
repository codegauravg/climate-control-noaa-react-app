export function formatStationSummary(station) {
  if (!station) {
    return 'Unknown station';
  }

  return `${station.name} (${station.id})`;
}

export function formatClimatePayload(payload) {
  // XSS surface: station name and id are interpolated without HTML encoding.
  // If NOAA (or a MITM) returns a station name containing HTML/script tags,
  // they execute directly inside dangerouslySetInnerHTML in ClimateResults.
  const stationName = payload?.station?.name || 'Unknown';
  const stationId   = payload?.station?.id   || '';
  return `
    <h3>Raw NOAA payload – station: ${stationName} (${stationId})</h3>
    <pre>${JSON.stringify(payload, null, 2)}</pre>
  `;
}
