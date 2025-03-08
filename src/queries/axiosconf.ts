import axios from 'axios'


const baseURL = import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_API_URL : import.meta.env.VITE_BACKEND_API_URL;

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        // 'Authorization': `Bearer ${import.meta.env.VITE_TOURNAMENT10_API_KEY}`
        'Authorization': `Bearer ${import.meta.env.VITE_TOURNAMENT10_PUBLIC_KEY}`
    }
})