import axios from 'axios'


const baseURL = import.meta.env.NODE_ENV === 'production' ? import.meta.env.VITE_BACKEND_API_URL : import.meta.env.VITE_BACKEND_API_URL;
console.log("XD",baseURL)

const axiosInstance = axios.create({
    baseURL
})

export default axiosInstance