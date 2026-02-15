import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.10:5000/api';

const API = axios.create({
    baseURL: API_URL,
});

API.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
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
