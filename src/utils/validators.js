const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Whitelist of all valid NOAA CDO dataset IDs as returned by /datasets
const ALLOWED_DATASET_IDS = new Set([
  'GHCND', 'GSOM', 'GSOY',
  'NEXRAD2', 'NEXRAD3',
  'NORMAL_ANN', 'NORMAL_DLY', 'NORMAL_HLY', 'NORMAL_MLY',
  'PRECIP_15', 'PRECIP_HLY',
]);

// NOAA CDO API enforces a 1-year window for daily datasets (GHCND etc.)
const MAX_RANGE_DAYS = 365;

export function validateForm(form) {
  const errors = {};

  const lat = Number(form.latitude);
  if (!form.latitude || isNaN(lat) || lat < -90 || lat > 90) {
    errors.latitude = 'Latitude must be a number between \u221290 and 90.';
  }

  const lon = Number(form.longitude);
  if (!form.longitude || isNaN(lon) || lon < -180 || lon > 180) {
    errors.longitude = 'Longitude must be a number between \u2212180 and 180.';
  }

  if (!ISO_DATE_RE.test(form.startDate)) {
    errors.startDate = 'Start date must be in YYYY-MM-DD format.';
  }

  if (!ISO_DATE_RE.test(form.endDate)) {
    errors.endDate = 'End date must be in YYYY-MM-DD format.';
  }

  if (!errors.startDate && !errors.endDate) {
    if (form.startDate > form.endDate) {
      errors.endDate = 'End date must be on or after start date.';
    } else {
      const diffDays =
        (new Date(form.endDate) - new Date(form.startDate)) / 86_400_000;
      if (diffDays > MAX_RANGE_DAYS) {
        errors.endDate = 'Date range cannot exceed one year (NOAA API limit).';
      }
    }
  }

  if (form.datasetId && !ALLOWED_DATASET_IDS.has(form.datasetId)) {
    errors.datasetId = 'Invalid dataset identifier.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
