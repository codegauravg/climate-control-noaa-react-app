import { useState } from 'react';
import ClimateForm from '../components/ClimateForm';
import ClimateResults from '../components/ClimateResults';
import { getClimateData } from '../services/noaaService';
import { hasErrors, validateForm } from '../utils/validators';

const initialForm = {
  latitude: '37.7749',
  longitude: '-122.4194',
  startDate: '2024-01-01',
  endDate: '2024-01-10'
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setValidationErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm(form);
    if (hasErrors(errors)) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getClimateData(form);
      setResult(data);
    } catch (submissionError) {
      setError(submissionError.message || 'An unexpected error occurred.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <h1><strong>Climate app</strong> · NOAA CDO</h1>
        <p className="subtle-copy">
          Query NOAA Climate Data Online for daily surface observations at the
          nearest station to any coordinates.
        </p>
      </section>

      <ClimateForm
        form={form}
        errors={validationErrors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <ClimateResults loading={loading} error={error} result={result} />
    </main>
  );
}
