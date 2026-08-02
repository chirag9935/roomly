import api from './axios';

export async function setPreferences(data) {
  const response = await api.put('/roommate/preferences', data);
  return response.data;
}

export async function getMyPreferences() {
  const response = await api.get('/roommate/preferences');
  return response.data;
}

export async function getMatches() {
  const response = await api.get('/roommate/matches');
  return response.data;
}