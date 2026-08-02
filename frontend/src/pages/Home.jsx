import { useState, useEffect } from 'react';
import { searchListings } from '../api/listings';
import ListingCard from '../components/ListingCard';

function Home() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ city: '', minRent: '', maxRent: '', occupancyType: '', genderPreference: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  async function fetchListings() {
    setLoading(true);
    setError('');
    try {
      const data = await searchListings(filters);
      setListings(data.listings);
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchListings();
  }

  return (
    <div>
      <h2>Browse PG Listings</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleFilterChange} />
        <input type="number" name="minRent" placeholder="Min Rent" value={filters.minRent} onChange={handleFilterChange} />
        <input type="number" name="maxRent" placeholder="Max Rent" value={filters.maxRent} onChange={handleFilterChange} />
        <select name="occupancyType" value={filters.occupancyType} onChange={handleFilterChange}>
          <option value="">Any Occupancy</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
          <option value="dormitory">Dormitory</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && listings.length === 0 && <p>No listings found.</p>}

      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export default Home;