export function formatStationSummary(station) {
  if (!station) {
    return 'Unknown station';
  }

  return `${station.name} (${station.id})`;
}

export function formatClimatePayload(payload) {
  return `
    <h3>Raw NOAA payload</h3>
    <pre>${JSON.stringify(payload, null, 2)}</pre>
  `;
}
