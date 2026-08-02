import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../api/roommate';
import styles from './RoommateMatches.module.css';

const SLEEP_LABELS = {
  early_bird: '🌅 Early bird',
  night_owl:  '🦉 Night owl',
  flexible:   '🔄 Flexible hours',
};

const CLEAN_LABELS = {
  very_tidy:  '✨ Very tidy',
  moderate:   '🧹 Moderately clean',
  relaxed:    '😌 Relaxed about it',
};

function SkeletonMatchCard() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className={`${styles.skeletonAvatar} skeleton`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div className={`${styles.skeletonName} skeleton`} />
          <div className={`${styles.skeletonMeta} skeleton`} />
        </div>
      </div>
      {[70, 55, 80].map((w, i) => (
        <div key={i} className={`${styles.skeletonLine} skeleton`} style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

function RoommateMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMatches() {
      try {
        const data = await getMatches();
        setMatches(data.matches);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1 className={styles.pageTitle}>Roommate matches</h1>
          <p className={styles.pageSubtitle}>
            People whose preferences align with yours — budget, city, lifestyle, and habits.
          </p>
        </div>
        <Link to="/roommate-preferences" className="btn btn-ghost" id="edit-preferences-btn">
          Edit my preferences
        </Link>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      {/* Loading */}
      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonMatchCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && matches.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🤝</div>
          <p>No matches yet. Try adjusting your preferences, or check back as more seekers join.</p>
          <Link to="/roommate-preferences" className="btn btn-ghost" style={{ marginTop: 16 }}>
            Update preferences
          </Link>
        </div>
      )}

      {/* Match cards */}
      {!loading && matches.length > 0 && (
        <div className={styles.grid}>
          {matches.map((match) => (
            <article key={match.id} className={styles.matchCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar} aria-hidden="true">👤</div>
                <div className={styles.nameBlock}>
                  <div className={styles.matchName}>{match.name}</div>
                  {match.preferred_city && (
                    <div className={styles.matchCity}>📍 {match.preferred_city}</div>
                  )}
                </div>
              </div>

              <div>
                <span className={styles.budgetLabel}>Budget range</span>
                <div className={styles.budget}>
                  ₹{Number(match.budget_min).toLocaleString('en-IN')} – ₹{Number(match.budget_max).toLocaleString('en-IN')}
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--graphite)', marginLeft: 4 }}>/mo</span>
                </div>
              </div>

              <div className={styles.traits}>
                {match.sleep_schedule && (
                  <span className={styles.trait}>
                    {SLEEP_LABELS[match.sleep_schedule] || match.sleep_schedule}
                  </span>
                )}
                {match.cleanliness_level && (
                  <span className={styles.trait}>
                    {CLEAN_LABELS[match.cleanliness_level] || match.cleanliness_level}
                  </span>
                )}
              </div>

              {match.bio && (
                <p className={styles.bio}>"{match.bio}"</p>
              )}

              <div className={styles.contact}>
                ✉️&nbsp;
                <a href={`mailto:${match.email}`} className={styles.contactEmail}>
                  {match.email}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoommateMatches;