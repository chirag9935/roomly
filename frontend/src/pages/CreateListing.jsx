import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createListing } from '../api/listings';
import styles from './ListingForm.module.css';

function CreateListing() {
  const [formData, setFormData] = useState({
    title: '', description: '', city: '', area: '', rent: '',
    occupancyType: 'single', genderPreference: 'any',
    amenities: '', houseRules: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        amenities: formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a.length > 0),
        photoUrls: []
      };
      const data = await createListing(payload);
      navigate(`/listings/${data.listing.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <Link to="/my-listings" className={styles.back}>← My listings</Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Create a new listing</h1>
        <p className={styles.subtitle}>
          Add your PG details. You can edit or update the status any time after posting.
        </p>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* ── Location & basics ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Location &amp; basics</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="cl-title">Listing title</label>
              <input
                id="cl-title"
                className="form-input"
                type="text"
                name="title"
                placeholder="e.g. Bright single room near IT Park, Whitefield"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row2}>
              <div className="form-group">
                <label className="form-label" htmlFor="cl-city">City</label>
                <input
                  id="cl-city"
                  className="form-input"
                  type="text"
                  name="city"
                  placeholder="Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cl-area">Area / neighbourhood</label>
                <input
                  id="cl-area"
                  className="form-input"
                  type="text"
                  name="area"
                  placeholder="Whitefield"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* ── Room details ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Room details</h2>

            <div className={styles.row2}>
              <div className="form-group">
                <label className="form-label" htmlFor="cl-rent">Rent per month (₹)</label>
                <input
                  id="cl-rent"
                  className="form-input"
                  type="number"
                  name="rent"
                  placeholder="8000"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cl-occupancy">Occupancy type</label>
                <select
                  id="cl-occupancy"
                  className="form-select"
                  name="occupancyType"
                  value={formData.occupancyType}
                  onChange={handleChange}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="dormitory">Dormitory</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cl-gender">Gender preference</label>
              <select
                id="cl-gender"
                className="form-select"
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
              >
                <option value="any">Any (no preference)</option>
                <option value="male">Male only</option>
                <option value="female">Female only</option>
              </select>
            </div>
          </div>

          {/* ── Description & rules ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Description &amp; rules</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="cl-description">About this PG</label>
              <textarea
                id="cl-description"
                className="form-textarea"
                name="description"
                placeholder="Describe the space, the neighbourhood, nearby transport, and what makes this a good place to live…"
                value={formData.description}
                onChange={handleChange}
                style={{ minHeight: '120px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cl-amenities">Amenities</label>
              <input
                id="cl-amenities"
                className="form-input"
                type="text"
                name="amenities"
                placeholder="wifi, laundry, AC, parking, hot water…"
                value={formData.amenities}
                onChange={handleChange}
              />
              <p className={styles.hint}>Comma-separated list. These appear as tags on your listing.</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cl-rules">House rules</label>
              <textarea
                id="cl-rules"
                className="form-textarea"
                name="houseRules"
                placeholder="No smoking indoors, guests by prior notice, quiet hours after 10 pm…"
                value={formData.houseRules}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className={styles.actions}>
            <button
              id="create-listing-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create listing'}
            </button>
            <Link to="/my-listings" className="btn btn-subtle">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;