import axios from 'axios';

const API_URL = 'http://localhost:8080/api/favorites';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const toggleFavorite = (campsiteId) => {
  return axios.post(API_URL + `/toggle/${campsiteId}`, {}, { headers: getAuthHeader() });
};

const getUserFavorites = () => {
  return axios.get(API_URL + '/my', { headers: getAuthHeader() });
};

const getFavoriteStatus = (campsiteId) => {
  return axios.get(API_URL + `/status/${campsiteId}`, { headers: getAuthHeader() });
};

const FavoriteService = {
  toggleFavorite,
  getUserFavorites,
  getFavoriteStatus,
};

export default FavoriteService;
