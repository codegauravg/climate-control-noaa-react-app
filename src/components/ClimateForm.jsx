export default function ClimateForm({ form, onChange, onSubmit, loading }) {
  return (
    <section className="card">
      <h2>Climate Query</h2>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          <span>Latitude</span>
          <input
            name="latitude"
            type="text"
            value={form.latitude}
            onChange={onChange}
            placeholder="e.g. 37.7749"
          />
        </label>

        <label>
          <span>Longitude</span>
          <input
            name="longitude"
            type="text"
            value={form.longitude}
            onChange={onChange}
            placeholder="e.g. -122.4194"
          />
        </label>

        <label>
          <span>Start date</span>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={onChange}
          />
        </label>

        <label>
          <span>End date</span>
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={onChange}
          />
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Loading climate data...' : 'Fetch climate data'}
        </button>
      </form>
    </section>
  );
}
