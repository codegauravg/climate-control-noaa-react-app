import { formatClimatePayload, formatStationSummary } from '../utils/formatters';

export default function ClimateResults({ loading, error, result }) {
  if (loading) {
    return (
      <section className="card">
        <h2>Results</h2>
        <p>Fetching station and climate records...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card error-card">
        <h2>Results</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="card">
        <h2>Results</h2>
        <p>No data loaded yet.</p>
      </section>
    );
  }

  const stationSummary = formatStationSummary(result.station);
  const rawHtml = formatClimatePayload(result);

  return (
    <section className="card">
      <h2>Results</h2>
      <div className="meta-grid">
        <div>
          <span className="label">Dataset</span>
          <strong>{result.datasetId}</strong>
        </div>
        <div>
          <span className="label">Station</span>
          <strong>{stationSummary}</strong>
        </div>
        <div>
          <span className="label">Record count</span>
          <strong>{result.data?.results?.length || 0}</strong>
        </div>
      </div>

      <div className="raw-render-block" dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </section>
  );
}
