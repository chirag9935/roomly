import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">PG Hostel Sharing</Link>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Browse</Link>

        {user ? (
          <>
            {user.role === 'owner' && <Link to="/my-listings">My Listings</Link>}
            {user.role === 'owner' && <Link to="/create-listing">Add Listing</Link>}
            {user.role === 'owner' && <Link to="/inquiries">Inquiries</Link>}
            {user.role === 'seeker' && <Link to="/roommate-matches">Find Roommate</Link>}
            {user.role === 'seeker' && <Link to="/my-inquiries">My Inquiries</Link>}
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;