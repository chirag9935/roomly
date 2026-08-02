import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getListingById, updateListing } from '../api/listings';

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
      } catch (err) {
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

  if (!formData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Listing</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" value={formData.description} onChange={handleChange} />
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        <input type="text" name="area" value={formData.area} onChange={handleChange} required />
        <input type="number" name="rent" value={formData.rent} onChange={handleChange} required />

        <select name="occupancy_type" value={formData.occupancy_type} onChange={handleChange}>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
          <option value="dormitory">Dormitory</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="under_inquiry">Under Inquiry</option>
          <option value="booked">Booked</option>
          <option value="closed">Closed</option>
        </select>

        <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} />
        <textarea name="house_rules" value={formData.house_rules} onChange={handleChange} />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

export default EditListing;