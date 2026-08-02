import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../api/listings';
import { useAuth } from '../context/AuthContext';
import styles from './ListingDetail.module.css';

const STATUS_BADGE = {
  active:        'badge badge-active',
  under_inquiry: 'badge badge-inquiry',
  booked:        'badge badge-booked',
  closed:        'badge badge-closed',
};

const STATUS_LABEL = {
  active:        'Active',
  under_inquiry: 'Under Inquiry',
  booked:        'Booked',
  closed:        'Closed',
};

function SkeletonDetail() {
  return (
    <div className={styles.skeletonPage}>
      <div className={`${styles.skeletonHero} skeleton`} />
      <div className={`${styles.skeletonTitle} skeleton`} />
      <div className={`${styles.skeletonMeta} skeleton`} />
      {[90, 75, 80, 60].map((w, i) => (
        <div key={i} className={`${styles.skeletonBody} skeleton`} style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await getListingById(id);
        setListing(data.listing);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  if (loading) return <SkeletonDetail />;

  if (error) return (
    <div className={styles.page}>
      <p className="form-error" role="alert">{error}</p>
    </div>
  );

  if (!listing) return null;

  const isOwnerOfThisListing = user && user.id === listing.owner_id;
  const canInquire = user && user.role === 'seeker';
  const badgeClass = STATUS_BADGE[listing.status] || 'badge badge-closed';
  const badgeLabel = STATUS_LABEL[listing.status] || listing.status;

  return (
    <div className={styles.page}>
      {/* Back link */}
      <Link to="/" className={styles.back}>
        ← Back to listings
      </Link>

      {/* Image placeholder */}
      <div className={styles.heroImage} aria-hidden="true">🏠</div>

      <div className={styles.layout}>
        {/* ── Left: main content ── */}
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{listing.title}</h1>
            <span className={badgeClass}>{badgeLabel}</span>
          </div>

          <p className={styles.location}>📍 {listing.area}, {listing.city}</p>

          <div className={styles.metaChips}>
            <span className={styles.chip}>🛏 {listing.occupancy_type}</span>
            {listing.gender_preference && listing.gender_preference !== 'any' && (
              <span className={styles.chip}>👤 {listing.gender_preference} only</span>
            )}
          </div>

          {listing.description && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About this PG</h2>
              <p className={styles.description}>{listing.description}</p>
            </div>
          )}

          {listing.amenities?.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Amenities</h2>
              <ul className={styles.amenitiesList}>
                {listing.amenities.map((a) => (
                  <li key={a} className={styles.amenityItem}>✓ {a}</li>
                ))}
              </ul>
            </div>
          )}

          {listing.house_rules && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>House rules</h2>
              <p className={styles.description}>{listing.house_rules}</p>
            </div>
          )}
        </div>

        {/* ── Right: sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.priceBlock}>
              <span className={styles.priceAmount}>
                ₹{Number(listing.rent).toLocaleString('en-IN')}
              </span>
              <span className={styles.priceLabel}>per month</span>
            </div>

            <div className={styles.sideActions}>
              {isOwnerOfThisListing && (
                <Link
                  to={`/edit-listing/${listing.id}`}
                  className="btn btn-ghost"
                  id="edit-listing-btn"
                >
                  Edit this listing
                </Link>
              )}

              {canInquire && !isOwnerOfThisListing && (
                <Link
                  to={`/send-inquiry/${listing.id}`}
                  className="btn btn-primary"
                  id="send-inquiry-btn"
                >
                  Send inquiry
                </Link>
              )}

              {!user && (
                <p className={styles.ownerNote}>
                  <Link to="/login">Log in</Link> as a seeker to send an inquiry.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ListingDetail;