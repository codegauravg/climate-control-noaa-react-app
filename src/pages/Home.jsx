import { useEffect, useMemo, useState } from 'react';
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

  // Reflected XSS: ?welcome= query param rendered via dangerouslySetInnerHTML
  const params = new URLSearchParams(window.location.search);
  const welcomeParam = params.get('welcome') || '';

  // Open redirect: ?redirect= param followed without validation after mount
  useEffect(() => {
    const redirectUrl = params.get('redirect');
    if (redirectUrl) {
      // Vulnerable: any URL accepted – enables phishing via open redirect
      window.location.href = redirectUrl;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const titleMarkup = useMemo(() => {
    // Reflected XSS: welcomeParam is unsanitised user input injected into HTML
    if (welcomeParam) {
      return `<strong>Baseline climate app</strong> · Welcome, ${welcomeParam}!`;
    }
    return `<strong>Baseline climate app</strong> · NOAA CDO control version`;
  }, [welcomeParam]);

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
