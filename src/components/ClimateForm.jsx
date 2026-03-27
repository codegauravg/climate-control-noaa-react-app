export default function ClimateForm({ form, errors = {}, onChange, onSubmit, loading }) {
  return (
    <section className="card">
      <h2>Climate Query</h2>
      <form className="form-grid" onSubmit={onSubmit} noValidate>
        <label>
          <span>Latitude</span>
          <input
            name="latitude"
            type="text"
            inputMode="decimal"
            value={form.latitude}
            onChange={onChange}
            placeholder="e.g. 37.7749"
            aria-describedby={errors.latitude ? 'err-latitude' : undefined}
            aria-invalid={!!errors.latitude}
          />
          {errors.latitude && (
            <span id="err-latitude" className="field-error" role="alert">
              {errors.latitude}
            </span>
          )}
        </label>

        <label>
          <span>Longitude</span>
          <input
            name="longitude"
            type="text"
            inputMode="decimal"
            value={form.longitude}
            onChange={onChange}
            placeholder="e.g. -122.4194"
            aria-describedby={errors.longitude ? 'err-longitude' : undefined}
            aria-invalid={!!errors.longitude}
          />
          {errors.longitude && (
            <span id="err-longitude" className="field-error" role="alert">
              {errors.longitude}
            </span>
          )}
        </label>

        <label>
          <span>Start date</span>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={onChange}
            aria-describedby={errors.startDate ? 'err-startDate' : undefined}
            aria-invalid={!!errors.startDate}
          />
          {errors.startDate && (
            <span id="err-startDate" className="field-error" role="alert">
              {errors.startDate}
            </span>
          )}
        </label>

        <label>
          <span>End date</span>
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={onChange}
            aria-describedby={errors.endDate ? 'err-endDate' : undefined}
            aria-invalid={!!errors.endDate}
          />
          {errors.endDate && (
            <span id="err-endDate" className="field-error" role="alert">
              {errors.endDate}
            </span>
          )}
        </label>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Loading climate data...' : 'Fetch climate data'}
        </button>
      </form>
    </section>
  );
}
