# Climate Control App

Minimal React baseline app for NOAA Climate Data Online (CDO).

## Run

```bash
npm install
npm run dev
```

The app uses the NOAA CDO base URL and token header pattern from the attached API notes, including the `/data` and `/stations` endpoints and standard query parameters such as `startdate`, `enddate`, `limit`, and `offset`. The reference notes also state that the token is required and limited to five requests per second and 10,000 requests per day. fileciteturn1file0

## Structure

- `src/components/ClimateForm.jsx`
- `src/components/ClimateResults.jsx`
- `src/services/noaaService.js`
- `src/pages/Home.jsx`
- `src/utils/formatters.js`

## Notes

- This is a control version for baseline testing.
- Input validation is intentionally omitted.
- Raw climate payload rendering is intentionally permissive.
- A Vite dev proxy is included for NOAA API calls.
