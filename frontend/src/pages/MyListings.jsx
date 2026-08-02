import { useState, useEffect } from 'react';
import { getMyListings, deleteListing } from '../api/listings';
import ListingCard from '../components/ListingCard';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Inquiries.module.css';

function MyListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();



    async function fetchMyListings() {
        setLoading(true);
        try {
            const data = await getMyListings();
            setListings(data.listings);
        } catch (err) {
            setError('Failed to load your listings');
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMyListings();
    }, []);

    async function handleDelete(id) {
        if (!window.confirm('Delete this listing? This cannot be undone.')) return;
        try {
            await deleteListing(id);
            setListings(listings.filter((l) => l.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete listing');
        }
    }

    return (
        <div className={styles.pageWide}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>My listings</h1>
                    <p className={styles.pageSubtitle}>Manage your posted PG listings.</p>
                </div>
                <Link to="/create-listing" className="btn btn-primary" id="create-listing-nav-btn">
                    + Add listing
                </Link>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            {loading && (
                <div className={styles.listingsGrid}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.skeletonCard} aria-hidden="true">
                            <div className={`${styles.skeletonTitle} skeleton`} style={{ height: 120 }} />
                            <div className={`${styles.skeletonMeta} skeleton`} />
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && listings.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">🏠</div>
                    <p>You haven't posted any listings yet.</p>
                    <Link to="/create-listing" className="btn btn-primary" style={{ marginTop: 16 }}>
                        Create your first listing
                    </Link>
                </div>
            )}

            {!loading && listings.length > 0 && (
                <div className={styles.listingsGrid}>
                    {listings.map((listing) => (
                        <div key={listing.id} className={styles.myListingWrapper}>
                            <ListingCard listing={listing} />
                            <div className={styles.myListingActions}>
                                <button
                                    className="btn btn-subtle btn-sm"
                                    onClick={() => navigate(`/edit-listing/${listing.id}`)}
                                    id={`edit-listing-${listing.id}`}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(listing.id)}
                                    id={`delete-listing-${listing.id}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyListings;