import axios from 'axios';

const API_URL = 'http://localhost:8080/api/campsites';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const getAllCampsites = () => {
  return axios.get(API_URL);
};

const getMyCampsites = () => {
  return axios.get(API_URL + '/my', { headers: getAuthHeader() });
};

const getCampsiteById = (id) => {
  return axios.get(API_URL + `/${id}`);
};

const createCampsite = (campsiteData) => {
  return axios.post(API_URL, campsiteData, { headers: getAuthHeader() });
};

const updateCampsite = (id, campsiteData) => {
  return axios.put(API_URL + `/${id}`, campsiteData, { headers: getAuthHeader() });
};

const deleteCampsite = (id) => {
  return axios.delete(API_URL + `/${id}`, { headers: getAuthHeader() });
};

const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('http://localhost:8080/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

const registerClick = (id) => {
  return axios.post(API_URL + `/${id}/click`);
};

const registerView = (id) => {
  return axios.post(API_URL + `/${id}/view`);
};

const CampsiteService = {
  getAllCampsites,
  getMyCampsites,
  getCampsiteById,
  createCampsite,
  updateCampsite,
  deleteCampsite,
  uploadImage,
  registerClick,
  registerView,
};

export default CampsiteService;
