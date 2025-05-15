import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const getTasks = () => API.get('/tasks');
export const createTask = (task) => API.post('/tasks', task);
export const updateTask = (id, task) => API.put(`/tasks/${id}`, task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
