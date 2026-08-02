import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createInquiry } from '../api/inquiries';
import styles from './Inquiries.module.css';

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
    <div className={styles.page}>
      <Link to={`/listings/${listingId}`} className={styles.back}>← Back to listing</Link>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Send an inquiry</h1>
          <p className={styles.pageSubtitle}>
            Introduce yourself and ask the owner anything you'd like to know about this listing.
          </p>
        </div>
      </div>

      <div className={styles.sendCard}>
        <form className={styles.sendForm} onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="inquiry-message">Your message</label>
            <textarea
              id="inquiry-message"
              className="form-textarea"
              placeholder="Hi, I'm interested in this listing. I'm a working professional looking for a room from next month…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ minHeight: '140px' }}
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className={styles.sendActions}>
            <button
              id="send-inquiry-submit-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Send inquiry'}
            </button>
            <Link to={`/listings/${listingId}`} className="btn btn-subtle">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendInquiry;