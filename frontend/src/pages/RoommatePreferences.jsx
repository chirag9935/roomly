import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setPreferences, getMyPreferences } from '../api/roommate';
import styles from './RoommatePreferences.module.css';

function RoommatePreferences() {
  const [formData, setFormData] = useState({
    budgetMin: '', budgetMax: '', preferredCity: '',
    sleepSchedule: 'flexible', foodHabit: 'no_preference',
    cleanlinessLevel: 'moderate', bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchExisting() {
      try {
        const data = await getMyPreferences();
        const p = data.preferences;
        setFormData({
          budgetMin: p.budget_min,
          budgetMax: p.budget_max,
          preferredCity: p.preferred_city,
          sleepSchedule: p.sleep_schedule,
          foodHabit: p.food_habit,
          cleanlinessLevel: p.cleanliness_level,
          bio: p.bio || ''
        });
      } catch (error) {
        if (error?.response?.status !== 404) console.error(error);
        // 404 means no preferences yet — keep defaults
      } finally {
        setInitialLoading(false);
      }
    }
    fetchExisting();
  }, []);

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
        budgetMin: Number(formData.budgetMin),
        budgetMax: Number(formData.budgetMax)
      };
      await setPreferences(payload);
      navigate('/roommate-matches');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) return (
    <div className={styles.loadingState}>
      <div className={`${styles.skeletonTitle} skeleton`} />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`${styles.skeletonBlock} skeleton`} />
      ))}
    </div>
  );

  return (
    <div className={styles.page}>
      <Link to="/roommate-matches" className={styles.back}>← Roommate matches</Link>

      <div className={styles.header}>
        <h1 className={styles.title}>My roommate preferences</h1>
        <p className={styles.subtitle}>
          Tell us about your lifestyle and budget. We use these to surface compatible people.
        </p>
      </div>

      <div className={styles.formCard}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* ── Budget & location ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Budget &amp; location</h2>

            <div className={styles.row2}>
              <div className="form-group">
                <label className="form-label" htmlFor="rp-budgetMin">Min budget (₹/mo)</label>
                <input
                  id="rp-budgetMin"
                  className="form-input"
                  type="number"
                  name="budgetMin"
                  placeholder="5000"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="rp-budgetMax">Max budget (₹/mo)</label>
                <input
                  id="rp-budgetMax"
                  className="form-input"
                  type="number"
                  name="budgetMax"
                  placeholder="15000"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rp-city">Preferred city</label>
              <input
                id="rp-city"
                className="form-input"
                type="text"
                name="preferredCity"
                placeholder="Bangalore"
                value={formData.preferredCity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ── Lifestyle ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>Lifestyle</h2>

            {/* Sleep schedule */}
            <div className="form-group">
              <span className="form-label">Sleep schedule</span>
              <div className={styles.optionGrid} role="radiogroup" aria-label="Sleep schedule">
                {[
                  { value: 'early_bird', emoji: '🌅', label: 'Early bird' },
                  { value: 'night_owl',  emoji: '🦉', label: 'Night owl' },
                  { value: 'flexible',   emoji: '🔄', label: 'Flexible' },
                ].map(({ value, emoji, label }) => (
                  <label key={value} className={styles.optionCard}>
                    <input
                      type="radio"
                      name="sleepSchedule"
                      value={value}
                      checked={formData.sleepSchedule === value}
                      onChange={handleChange}
                    />
                    <span className={styles.optionEmoji}>{emoji}</span>
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Food habit */}
            <div className="form-group">
              <span className="form-label">Food habit</span>
              <div className={styles.optionGrid} role="radiogroup" aria-label="Food habit">
                {[
                  { value: 'veg',           emoji: '🥦', label: 'Vegetarian' },
                  { value: 'non_veg',        emoji: '🍗', label: 'Non-vegetarian' },
                  { value: 'no_preference',  emoji: '🍽️', label: 'No preference' },
                ].map(({ value, emoji, label }) => (
                  <label key={value} className={styles.optionCard}>
                    <input
                      type="radio"
                      name="foodHabit"
                      value={value}
                      checked={formData.foodHabit === value}
                      onChange={handleChange}
                    />
                    <span className={styles.optionEmoji}>{emoji}</span>
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Cleanliness */}
            <div className="form-group">
              <span className="form-label">Cleanliness level</span>
              <div className={styles.optionGrid} role="radiogroup" aria-label="Cleanliness level">
                {[
                  { value: 'very_tidy', emoji: '✨', label: 'Very tidy' },
                  { value: 'moderate',  emoji: '🧹', label: 'Moderate' },
                  { value: 'relaxed',   emoji: '😌', label: 'Relaxed' },
                ].map(({ value, emoji, label }) => (
                  <label key={value} className={styles.optionCard}>
                    <input
                      type="radio"
                      name="cleanlinessLevel"
                      value={value}
                      checked={formData.cleanlinessLevel === value}
                      onChange={handleChange}
                    />
                    <span className={styles.optionEmoji}>{emoji}</span>
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── About you ── */}
          <div className={styles.formSection}>
            <h2 className={styles.formSectionTitle}>About you</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="rp-bio">Short bio</label>
              <textarea
                id="rp-bio"
                className="form-textarea"
                name="bio"
                placeholder="Tell potential roommates a bit about yourself — your work, your routine, what you're like to live with…"
                value={formData.bio}
                onChange={handleChange}
                style={{ minHeight: '100px' }}
              />
            </div>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className={styles.actions}>
            <button
              id="save-preferences-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save preferences'}
            </button>
            <Link to="/roommate-matches" className="btn btn-subtle">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoommatePreferences;