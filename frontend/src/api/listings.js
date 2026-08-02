import api from './axios';

export async function searchListings(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const response = await api.get(`/listings/search?${params.toString()}`);
  return response.data;
}

export async function getListingById(id) {
  const response = await api.get(`/listings/${id}`);
  return response.data;
}

export async function createListing(data) {
  const response = await api.post('/listings', data);
  return response.data;
}

export async function getMyListings() {
  const response = await api.get('/listings/my-listings');
  return response.data;
}

export async function updateListing(id, data) {
  const response = await api.put(`/listings/${id}`, data);
  return response.data;
}

export async function deleteListing(id) {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
}