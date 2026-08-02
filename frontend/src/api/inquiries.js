import api from './axios';

export async function createInquiry(data) {
  const response = await api.post('/inquiries', data);
  return response.data;
}

export async function getReceivedInquiries() {
  const response = await api.get('/inquiries/received');
  return response.data;
}

export async function getSentInquiries() {
  const response = await api.get('/inquiries/sent');
  return response.data;
}

export async function updateInquiryStatus(id, status) {
  const response = await api.put(`/inquiries/${id}/status`, { status });
  return response.data;
}