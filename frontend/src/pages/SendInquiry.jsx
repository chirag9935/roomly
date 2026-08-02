import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { createInquiry } from '../api/inquiries';

function SendInquiry() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createInquiry({ listingId: Number(listingId), message });
      navigate('/my-inquiries');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Send Inquiry</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Ask a question or express interest in this listing..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Inquiry'}</button>
      </form>
    </div>
  );
}

export default SendInquiry;