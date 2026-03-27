export function formatStationSummary(station) {
  if (!station) {
    return 'Unknown station';
  }

  return `${station.name} (${station.id})`;
}
