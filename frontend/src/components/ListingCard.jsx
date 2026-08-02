import { Link } from 'react-router-dom';
import styles from './ListingCard.module.css';

/* Maps DB status strings → CSS modifier + badge class */
const STATUS_MAP = {
  active:       { bar: styles.statusActive,  badge: 'badge badge-active',  label: 'Active' },
  under_inquiry:{ bar: styles.statusInquiry, badge: 'badge badge-inquiry', label: 'Under Inquiry' },
  booked:       { bar: styles.statusBooked,  badge: 'badge badge-booked',  label: 'Booked' },
  closed:       { bar: styles.statusClosed,  badge: 'badge badge-closed',  label: 'Closed' },
};

const OCCUPANCY_LABELS = {
  single:     'Single',
  double:     'Double',
  triple:     'Triple',
  dormitory:  'Dormitory',
};

function ListingCard({ listing }) {
  const statusInfo = STATUS_MAP[listing.status] || STATUS_MAP.closed;

  return (
    <article className={`${styles.card} ${statusInfo.bar}`}>
      {/* Image placeholder */}
      <div className={styles.imagePlaceholder} aria-hidden="true">
        <span className={styles.imagePlaceholderIcon}>🏠</span>
      </div>

      {/* Header: title + price */}
      <div className={styles.headerRow}>
        <h3 className={styles.title}>{listing.title}</h3>
        <div className={styles.price}>
          ₹{Number(listing.rent).toLocaleString('en-IN')}
          <span className={styles.priceSuffix}>/mo</span>
        </div>
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        <span className={styles.metaItem}>
          📍 {listing.area}, {listing.city}
        </span>
        <span className={styles.metaDot} aria-hidden="true" />
        <span className={styles.metaItem}>
          {OCCUPANCY_LABELS[listing.occupancy_type] || listing.occupancy_type}
        </span>
      </div>

      {/* Footer: badge + link */}
      <div className={styles.footer}>
        <span className={statusInfo.badge}>{statusInfo.label}</span>
        <Link
          to={`/listings/${listing.id}`}
          className={styles.viewLink}
          aria-label={`View details for ${listing.title}`}
        >
          View details
          <span className={styles.viewArrow} aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default ListingCard;