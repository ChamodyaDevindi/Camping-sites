import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reviews';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const addReview = (campsiteId, reviewData) => {
  return axios.post(API_URL + `/${campsiteId}`, reviewData, { headers: getAuthHeader() });
};

const getCampsiteReviews = (campsiteId) => {
  return axios.get(API_URL + `/campsite/${campsiteId}`);
};

const getUserReviews = () => {
  return axios.get(API_URL + '/my', { headers: getAuthHeader() });
};

const ReviewService = {
  addReview,
  getCampsiteReviews,
  getUserReviews,
};

export default ReviewService;
