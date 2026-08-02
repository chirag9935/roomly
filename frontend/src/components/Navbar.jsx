import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>
        {/* Brand */}
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          Roomly
          <span className={styles.brandDot} aria-hidden="true" />
        </Link>

        {/* Hamburger toggle (mobile) */}
        <button
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={styles.hamburgerIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        {/* Nav menu */}
        <div
          id="navbar-menu"
          className={`${styles.navMenu} ${menuOpen ? styles.open : ''}`}
        >
          <ul className={styles.links} role="list">
            <li>
              <NavLink to="/" className={styles.navLink} onClick={closeMenu} end>
                Browse
              </NavLink>
            </li>

            {user?.role === 'owner' && (
              <>
                <li>
                  <NavLink to="/my-listings" className={styles.navLink} onClick={closeMenu}>
                    My Listings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/create-listing" className={styles.navLink} onClick={closeMenu}>
                    Add Listing
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/inquiries" className={styles.navLink} onClick={closeMenu}>
                    Inquiries
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'seeker' && (
              <>
                <li>
                  <NavLink to="/roommate-matches" className={styles.navLink} onClick={closeMenu}>
                    Find Roommate
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/my-inquiries" className={styles.navLink} onClick={closeMenu}>
                    My Inquiries
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* User section or auth buttons */}
          {user ? (
            <div className={styles.userSection}>
              <span className={styles.greeting}>
                Hi, <span className={styles.greetingName}>{user.name}</span>
              </span>
              <button
                className={styles.logoutBtn}
                onClick={() => { handleLogout(); closeMenu(); }}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <Link
                to="/login"
                className="btn btn-ghost btn-sm"
                onClick={closeMenu}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm"
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;