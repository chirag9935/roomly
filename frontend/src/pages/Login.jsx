import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';
import styles from './Auth.module.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const data = await loginUser(formData);
      login(data.user); // token is set as an httpOnly cookie by the server — nothing to pass here
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Log in to your account to continue.</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
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
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="form-error" role="alert">{error}</p>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        {/* Footer */}
        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;