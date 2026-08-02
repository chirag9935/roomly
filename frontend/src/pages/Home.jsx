import { useState, useEffect } from 'react';
import { searchListings } from '../api/listings';
import ListingCard from '../components/ListingCard';
import ErrorState from '../components/ErrorState';
import styles from './Home.module.css';

/* Skeleton card shown while loading */
function SkeletonCard() {
    return (
        <div className={styles.skeletonCard} aria-hidden="true">
            <div className={`${styles.skeletonImage} skeleton`} />
            <div className={`${styles.skeletonTitle} skeleton`} />
            <div className={`${styles.skeletonMeta} skeleton`} />
            <div className={`${styles.skeletonFooter} skeleton`} />
        </div>
    );
}

const INITIAL_FILTERS = { city: '', minRent: '', maxRent: '', occupancyType: '', genderPreference: '' };

function Home() {
    const [listings, setListings] = useState([]);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function fetchListings(activeFilters) {
        setLoading(true);
        setError('');
        try {
            const data = await searchListings(activeFilters);
            setListings(data.listings);
        } catch (err) {
            console.error(err);
            // Surface the real reason when the API gives us one (e.g. a
            // validation message) instead of always showing the same
            // generic line — much easier to diagnose than a flat "failed".
            setError(err.response?.data?.message || 'We couldn\u2019t reach the server. Check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchListings(INITIAL_FILTERS);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleFilterChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    function handleSearch(e) {
        e.preventDefault();
        fetchListings(filters);
    }

    return (
        <>
            {/* Hero */}
            <section className={styles.hero}>
                <span className={styles.heroEyebrow}>PG &amp; Hostel Sharing</span>
                <h1 className={styles.heroTitle}>
                    Find a room.<br />Find your people.
                </h1>
                <p className={styles.heroSub}>
                    Browse verified PG and hostel listings across Indian cities. Filter by budget, location, and room type — then connect directly with owners.
                </p>
            </section>

            {/* Filter bar */}
            <form
                className={styles.filterBar}
                onSubmit={handleSearch}
                role="search"
                aria-label="Search listings"
            >
                <div className={styles.filterGrid}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-city" className={styles.filterLabel}>City</label>
                        <input
                            id="filter-city"
                            className="form-input"
                            type="text"
                            name="city"
                            placeholder="e.g. Bangalore, Pune…"
                            value={filters.city}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-minRent" className={styles.filterLabel}>Min rent (₹)</label>
                        <input
                            id="filter-minRent"
                            className="form-input"
                            type="number"
                            name="minRent"
                            placeholder="0"
                            value={filters.minRent}
                            onChange={handleFilterChange}
                            min="0"
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-maxRent" className={styles.filterLabel}>Max rent (₹)</label>
                        <input
                            id="filter-maxRent"
                            className="form-input"
                            type="number"
                            name="maxRent"
                            placeholder="Any"
                            value={filters.maxRent}
                            onChange={handleFilterChange}
                            min="0"
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label htmlFor="filter-occupancy" className={styles.filterLabel}>Room type</label>
                        <select
                            id="filter-occupancy"
                            className="form-select"
                            name="occupancyType"
                            value={filters.occupancyType}
                            onChange={handleFilterChange}
                        >
                            <option value="">Any type</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="triple">Triple</option>
                            <option value="dormitory">Dormitory</option>
                        </select>
                    </div>

                    <div className={styles.searchBtn}>
                        <button type="submit" className="btn btn-primary" id="search-listings-btn">
                            Search
                        </button>
                    </div>
                </div>
            </form>

            {/* Results */}
            <main className={styles.content}>
                {/* Results count */}
                {!loading && !error && (
                    <div className={styles.resultsHeader}>
                        <p className={styles.resultsCount}>
                            {listings.length === 0
                                ? 'No listings found'
                                : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
                        </p>
                    </div>
                )}

                {/* Error state — replaces the old flat red banner */}
                {error && (
                    <ErrorState
                        title="Couldn't load listings"
                        message={error}
                        onRetry={() => fetchListings(filters)}
                    />
                )}

                {/* Loading skeletons */}
                {loading && (
                    <div className={styles.grid} aria-live="polite" aria-label="Loading listings">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && listings.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <p>No listings match your filters yet — try widening the rent range or choosing a different city.</p>
                    </div>
                )}

                {/* Listings grid */}
                {!loading && listings.length > 0 && (
                    <div className={styles.grid}>
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                )}
            </main>
        </>
        );
    }

export default Home;