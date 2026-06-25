import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reservations';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const createReservation = (data) => {
  return axios.post(API_URL, data, { headers: getAuthHeader() });
};

const getMyReservations = () => {
  return axios.get(API_URL + '/my-bookings', { headers: getAuthHeader() });
};

const getCampsiteReservations = (campsiteId) => {
  return axios.get(API_URL + `/campsite/${campsiteId}`, { headers: getAuthHeader() });
};

const updateReservationStatus = (id, status, rejectionReason) => {
  let url = API_URL + `/${id}/status?status=${status}`;
  if (rejectionReason) {
    url += `&rejectionReason=${encodeURIComponent(rejectionReason)}`;
  }
  return axios.put(url, {}, { headers: getAuthHeader() });
};

const deleteReservation = (id) => {
  return axios.delete(API_URL + `/${id}`, { headers: getAuthHeader() });
};

export default {
  createReservation,
  getMyReservations,
  getCampsiteReservations,
  updateReservationStatus,
  deleteReservation
};
