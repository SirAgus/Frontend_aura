
import axios from "axios";
import { AuthResponse } from "@/types";

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        // Backend requirement for /auth/token: x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        // Call Next.js BFF
        const response = await axios.post("/api/auth/token", params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        return response.data;
    },

    signup: async (username: string, email: string, password: string): Promise<AuthResponse> => {
        // Backend requirement for /auth/signup: multipart/form-data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        // Call Next.js BFF
        const response = await axios.post("/api/auth/signup", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};
