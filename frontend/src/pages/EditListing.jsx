import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById, updateListing } from '../api/listings';
import styles from './ListingForm.module.css';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await getListingById(id);
        const l = data.listing;
        setFormData({
          title: l.title,
          description: l.description || '',
          city: l.city,
          area: l.area,
          rent: l.rent,
          occupancy_type: l.occupancy_type,
          gender_preference: l.gender_preference,
          amenities: (l.amenities || []).join(', '),
          house_rules: l.house_rules || '',
          status: l.status
        });
      } catch (error) {
        console.error(error);
        setError('Failed to load listing');
      }
    }
    fetchListing();
  }, [id]);

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
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter((a) => a.length > 0)
      };
      await updateListing(id, payload);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  }

  if (!formData) return (
    <div className={styles.page}>
      <div className={styles.loadingState}>
        <div className="skeleton" style={{ width: '100%', height: 400, borderRadius: 4 }} />
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <Link to={`/listings/${id}`} className={styles.back}>← Back to listing</Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Edit listing</h1>
        <p className={styles.subtitle}>Update your listing details or change its availability status.</p>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* ── Location & basics ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Location &amp; basics</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="el-title">Listing title</label>
              <input
                id="el-title"
                className="form-input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.row2}>
              <div className="form-group">
                <label className="form-label" htmlFor="el-city">City</label>
                <input
                  id="el-city"
                  className="form-input"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="el-area">Area / neighbourhood</label>
                <input
                  id="el-area"
                  className="form-input"
                  type="text"
                  name="area"
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
                <label className="form-label" htmlFor="el-rent">Rent per month (₹)</label>
                <input
                  id="el-rent"
                  className="form-input"
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="el-occupancy">Occupancy type</label>
                <select
                  id="el-occupancy"
                  className="form-select"
                  name="occupancy_type"
                  value={formData.occupancy_type}
                  onChange={handleChange}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="dormitory">Dormitory</option>
                </select>
              </div>
            </div>

            <div className={styles.row2}>
              <div className="form-group">
                <label className="form-label" htmlFor="el-gender">Gender preference</label>
                <select
                  id="el-gender"
                  className="form-select"
                  name="gender_preference"
                  value={formData.gender_preference}
                  onChange={handleChange}
                >
                  <option value="any">Any (no preference)</option>
                  <option value="male">Male only</option>
                  <option value="female">Female only</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="el-status">Listing status</label>
                <select
                  id="el-status"
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active — available</option>
                  <option value="under_inquiry">Under Inquiry</option>
                  <option value="booked">Booked</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Description & rules ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Description &amp; rules</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="el-description">About this PG</label>
              <textarea
                id="el-description"
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ minHeight: '120px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="el-amenities">Amenities</label>
              <input
                id="el-amenities"
                className="form-input"
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
              />
              <p className={styles.hint}>Comma-separated. E.g. wifi, laundry, AC</p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="el-rules">House rules</label>
              <textarea
                id="el-rules"
                className="form-textarea"
                name="house_rules"
                value={formData.house_rules}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className={styles.actions}>
            <button
              id="save-listing-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
            <Link to={`/listings/${id}`} className="btn btn-subtle">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListing;