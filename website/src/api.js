import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

export const getRecipes = () => API.get('/recipes');
export const getRecipeById = (id) => API.get(`/recipes/${id}`);
export const fetchRecipeImage = (id) => API.patch(`/recipes/${id}/image`);

export default API;
