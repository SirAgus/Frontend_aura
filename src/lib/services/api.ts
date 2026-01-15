
import axios from 'axios';
import { cookies } from 'next/headers';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    // server-side only: read cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('voice_token')?.value;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
