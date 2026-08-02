import api from './axios';

export async function signupUser(data) {
  const response = await api.post('/auth/signup', data);
  return response.data;
}

export async function loginUser(data) {
  const response = await api.post('/auth/login', data);
  return response.data;
}