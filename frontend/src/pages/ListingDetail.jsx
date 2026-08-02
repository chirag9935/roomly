import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getListingById } from '../api/listings';
import { useAuth } from '../context/AuthContext';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!listing) return null;

  const isOwnerOfThisListing = user && user.id === listing.owner_id;
  const canInquire = user && user.role === 'seeker';

  return (
    <div>
      <h2>{listing.title}</h2>
      <p>{listing.area}, {listing.city}</p>
      <p>₹{listing.rent}/month</p>
      <p>Occupancy: {listing.occupancy_type}</p>
      <p>Gender Preference: {listing.gender_preference}</p>
      <p>Status: {listing.status}</p>
      {listing.description && <p>{listing.description}</p>}
      {listing.house_rules && <p><strong>House Rules:</strong> {listing.house_rules}</p>}

      {listing.amenities?.length > 0 && (
        <div>
          <strong>Amenities:</strong>
          <ul>
            {listing.amenities.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      )}

      {isOwnerOfThisListing && (
        <Link to={`/edit-listing/${listing.id}`}>Edit This Listing</Link>
      )}

      {canInquire && !isOwnerOfThisListing && (
        <Link to={`/send-inquiry/${listing.id}`}>Send Inquiry</Link>
      )}

      {!user && <p>Log in as a seeker to send an inquiry.</p>}
    </div>
  );
}

export default ListingDetail;