import { useState, useEffect } from 'react';
import { getMyListings, deleteListing } from '../api/listings';
import ListingCard from '../components/ListingCard';
import { useNavigate } from 'react-router';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyListings();
  }, []);

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

  async function handleDelete(id) {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await deleteListing(id);
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Listings</h2>
      {listings.length === 0 && <p>You haven't posted any listings yet.</p>}
      {listings.map((listing) => (
        <div key={listing.id}>
          <ListingCard listing={listing} />
          <button onClick={() => navigate(`/edit-listing/${listing.id}`)}>Edit</button>
          <button onClick={() => handleDelete(listing.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default MyListings;