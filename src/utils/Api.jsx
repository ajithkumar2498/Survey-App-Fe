import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });


API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = localStorage.getItem('token');
  }
  return req;
});

export default API;