import { useState, useEffect } from 'react';
import { getReceivedInquiries, updateInquiryStatus } from '../api/inquiries';

function ReceivedInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    try {
      const data = await getReceivedInquiries();
      setInquiries(data.inquiries);
    } catch (err) {
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries(inquiries.map((inq) => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Inquiries Received</h2>
      {inquiries.length === 0 && <p>No inquiries yet.</p>}
      {inquiries.map((inq) => (
        <div key={inq.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{inq.listing_title}</h3>
          <p>From: {inq.seeker_name} ({inq.seeker_email})</p>
          <p>Message: {inq.message}</p>
          <select value={inq.status} onChange={(e) => handleStatusChange(inq.id, e.target.value)}>
            <option value="pending">Pending</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default ReceivedInquiries;