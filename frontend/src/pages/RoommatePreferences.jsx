import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { setPreferences, getMyPreferences } from '../api/roommate';

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
      } catch (err) {
        // 404 just means no preferences set yet — that's fine, keep defaults
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

  if (initialLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Roommate Preferences</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="budgetMin" placeholder="Min Budget" value={formData.budgetMin} onChange={handleChange} required />
        <input type="number" name="budgetMax" placeholder="Max Budget" value={formData.budgetMax} onChange={handleChange} required />
        <input type="text" name="preferredCity" placeholder="Preferred City" value={formData.preferredCity} onChange={handleChange} required />

        <select name="sleepSchedule" value={formData.sleepSchedule} onChange={handleChange}>
          <option value="early_bird">Early Bird</option>
          <option value="night_owl">Night Owl</option>
          <option value="flexible">Flexible</option>
        </select>

        <select name="foodHabit" value={formData.foodHabit} onChange={handleChange}>
          <option value="veg">Vegetarian</option>
          <option value="non_veg">Non-Vegetarian</option>
          <option value="no_preference">No Preference</option>
        </select>

        <select name="cleanlinessLevel" value={formData.cleanlinessLevel} onChange={handleChange}>
          <option value="very_tidy">Very Tidy</option>
          <option value="moderate">Moderate</option>
          <option value="relaxed">Relaxed</option>
        </select>

        <textarea name="bio" placeholder="Tell potential roommates about yourself" value={formData.bio} onChange={handleChange} />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Preferences'}</button>
      </form>
    </div>
  );
}

export default RoommatePreferences;