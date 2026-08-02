import { useState, useEffect } from 'react';
import { getSentInquiries } from '../api/inquiries';
import styles from './Inquiries.module.css';

const STATUS_BADGE = {
  pending:   'badge badge-pending',
  responded: 'badge badge-responded',
  closed:    'badge badge-closed',
};
const STATUS_LABEL = { pending: 'Pending', responded: 'Responded', closed: 'Closed' };
const STATUS_CLASS = {
  pending:   styles.statusPending,
  responded: styles.statusResponded,
  closed:    styles.statusClosed,
};

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={`${styles.skeletonTitle} skeleton`} />
      <div className={`${styles.skeletonMeta} skeleton`} />
      <div className={`${styles.skeletonMsg} skeleton`} />
    </div>
  );
}

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const data = await getSentInquiries();
        setInquiries(data.inquiries);
      } catch (error) {
        console.error(error);
        setError('Failed to load your inquiries');
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My inquiries</h1>
          <p className={styles.pageSubtitle}>Listings you've reached out to.</p>
        </div>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      {loading && (
        <div className={styles.list}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && inquiries.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📬</div>
          <p>You haven't sent any inquiries yet. Browse listings and reach out to owners.</p>
        </div>
      )}

      {!loading && inquiries.length > 0 && (
        <div className={styles.list}>
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`${styles.inquiryCard} ${STATUS_CLASS[inq.status] || styles.statusClosed}`}
            >
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.listingTitle}>{inq.listing_title}</h2>
                  <span className={STATUS_BADGE[inq.status] || 'badge badge-closed'}>
                    {STATUS_LABEL[inq.status] || inq.status}
                  </span>
                </div>

                {(inq.area || inq.city) && (
                  <p className={styles.location}>📍 {inq.area}{inq.area && inq.city ? ', ' : ''}{inq.city}</p>
                )}

                <div className={styles.messageBlock}>
                  <div className={styles.messageLabel}>Your message</div>
                  <p className={styles.messageText}>{inq.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInquiries;