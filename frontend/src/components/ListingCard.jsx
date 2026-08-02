import { Link } from 'react-router';

function ListingCard({ listing }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{listing.title}</h3>
      <p>{listing.area}, {listing.city}</p>
      <p>₹{listing.rent}/month · {listing.occupancy_type}</p>
      <p>Status: {listing.status}</p>
      <Link to={`/listings/${listing.id}`}>View Details</Link>
    </div>
  );
}

export default ListingCard;