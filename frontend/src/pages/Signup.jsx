import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupUser } from '../api/auth';
import styles from './Auth.module.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'seeker', phone: '', gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await signupUser(formData);
      login(data.user); // token is set as an httpOnly cookie by the server
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.brandMark}>
            Roomly
            <span className={styles.brandDot} aria-hidden="true" />
          </Link>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Find a room or list your PG in minutes.</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Name + Email */}
          <div className={styles.formRow}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                className="form-input"
                type="text"
                name="name"
                placeholder="Priya Sharma"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-phone">Phone</label>
              <input
                id="signup-phone"
                className="form-input"
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              className="form-input"
              type="password"
              name="password"
              placeholder="Choose a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-gender">Gender</label>
            <select
              id="signup-gender"
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Role selector */}
          <div className={styles.roleGroup}>
            <span className={styles.roleLabel}>I want to…</span>
            <div className={styles.roleOptions}>
              <label className={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="seeker"
                  checked={formData.role === 'seeker'}
                  onChange={handleChange}
                />
                <span className={styles.roleIcon}>🔍</span>
                <span className={styles.roleTitle}>Find a PG</span>
                <span className={styles.roleDesc}>Browse listings and contact owners</span>
              </label>
              <label className={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={formData.role === 'owner'}
                  onChange={handleChange}
                />
                <span className={styles.roleIcon}>🏠</span>
                <span className={styles.roleTitle}>List a PG</span>
                <span className={styles.roleDesc}>Post listings and manage inquiries</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="form-error" role="alert">{error}</p>
          )}

          <button
            id="signup-submit-btn"
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;