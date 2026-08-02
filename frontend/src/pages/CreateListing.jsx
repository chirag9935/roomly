import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createListing } from '../api/listings';

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
    <div>
      <h2>Create Listing</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input type="text" name="area" placeholder="Area" value={formData.area} onChange={handleChange} required />
        <input type="number" name="rent" placeholder="Rent (₹/month)" value={formData.rent} onChange={handleChange} required />

        <select name="occupancyType" value={formData.occupancyType} onChange={handleChange}>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
          <option value="dormitory">Dormitory</option>
        </select>

        <select name="genderPreference" value={formData.genderPreference} onChange={handleChange}>
          <option value="any">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input type="text" name="amenities" placeholder="Amenities (comma separated: wifi, laundry, ac)" value={formData.amenities} onChange={handleChange} />
        <textarea name="houseRules" placeholder="House Rules" value={formData.houseRules} onChange={handleChange} />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;