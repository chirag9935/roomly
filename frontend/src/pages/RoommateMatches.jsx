import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getMatches } from '../api/roommate';

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Roommate Matches</h2>
      <Link to="/roommate-preferences">Edit My Preferences</Link>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && matches.length === 0 && (
        <p>No matches found yet. Try adjusting your preferences, or check back later as more people join.</p>
      )}

      {matches.map((match) => (
        <div key={match.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{match.name}</h3>
          <p>Budget: ₹{match.budget_min} - ₹{match.budget_max}</p>
          <p>City: {match.preferred_city}</p>
          <p>Sleep Schedule: {match.sleep_schedule}</p>
          <p>Cleanliness: {match.cleanliness_level}</p>
          {match.bio && <p>{match.bio}</p>}
          <p>Contact: {match.email}</p>
        </div>
      ))}
    </div>
  );
}

export default RoommateMatches;