import { useState, useEffect } from 'react';
import { getSentInquiries } from '../api/inquiries';

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const data = await getSentInquiries();
        setInquiries(data.inquiries);
      } catch (err) {
        setError('Failed to load your inquiries');
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Inquiries</h2>
      {inquiries.length === 0 && <p>You haven't sent any inquiries yet.</p>}
      {inquiries.map((inq) => (
        <div key={inq.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{inq.listing_title}</h3>
          <p>{inq.area}, {inq.city}</p>
          <p>Your message: {inq.message}</p>
          <p>Status: {inq.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyInquiries;