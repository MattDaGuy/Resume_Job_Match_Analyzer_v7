
import React, { useState } from 'react';

export default function Home() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeFit = async () => {
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription })
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error('Server error: ' + errorDetails);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid JSON response. Check if your OpenAI API key is working.');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Resume to Job Match Analyzer</h1>
      <textarea placeholder="Paste Resume" rows={10} value={resume} onChange={e => setResume(e.target.value)} />
      <textarea placeholder="Paste Job Description" rows={10} value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
      <button onClick={analyzeFit} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Fit'}</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {results && (
        <div style={{ marginTop: '1rem', backgroundColor: '#e0ffe0', padding: '1rem' }}>
          <h2>Match Analysis</h2>
          <p><strong>Fit Percentage:</strong> {results.fitPercentage}%</p>
          <ul>
            {results.qualifications.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
          <ul>
            {results.concerns.map((c, i) => <li key={i} style={{ color: 'red' }}>{c}</li>)}
          </ul>
          <ul>
            {results.questions.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
