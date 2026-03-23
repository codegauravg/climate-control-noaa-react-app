import { useMemo, useState } from 'react';
import ClimateForm from '../components/ClimateForm';
import ClimateResults from '../components/ClimateResults';
import { getClimateData } from '../services/noaaService';

const initialForm = {
  latitude: '37.7749',
  longitude: '-122.4194',
  startDate: '2024-01-01',
  endDate: '2024-01-10'
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const titleMarkup = useMemo(() => {
    return `<strong>Baseline climate app</strong> · NOAA CDO control version`;
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await getClimateData(form);
      setResult(data);
    } catch (submissionError) {
      setError(submissionError.message || 'Something went wrong while fetching climate data.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
        <h1 dangerouslySetInnerHTML={{ __html: titleMarkup }} />
        <p className="subtle-copy">
          Minimal React baseline for NOAA CDO API flow, UI wiring, and raw result rendering.
        </p>
      </section>

      <ClimateForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <ClimateResults loading={loading} error={error} result={result} />
    </main>
  );
}
