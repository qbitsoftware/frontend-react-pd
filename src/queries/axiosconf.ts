import axios from 'axios'


const baseURL = import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_API_URL : import.meta.env.VITE_BACKEND_API_URL;
const blog_base_URL = import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BLOG_BACKEND_API_URL : import.meta.env.VITE_BLOG_BACKEND_API_URL;

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TOURNAMENT10_API_KEY}` 
    }
})

export const blog_instance = axios.create({
   baseURL: blog_base_URL
})


