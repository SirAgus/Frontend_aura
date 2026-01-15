
import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    // Allow any status code to be handled in the route handler without throwing an exception
    validateStatus: () => true,
});

api.interceptors.request.use(async (config) => {
    // server-side only: read cookies
    // Using 'accessToken' to match the standard in route handlers
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
