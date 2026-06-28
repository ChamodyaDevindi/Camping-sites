import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const register = (firstName, lastName, email, password, phoneNumber, role) => {
  return axios.post(API_URL + "signup", {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    role
  });
};

const login = async (email, password) => {
  const response = await axios.post(API_URL + "signin", {
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getUserProfile = () => {
  const user = getCurrentUser();
  const token = user ? user.token : "";
  return axios.get(API_URL + "profile", {
    headers: { Authorization: "Bearer " + token }
  });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getUserProfile,
};

export default AuthService;
