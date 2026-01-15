
import axios from "axios";
import { AuthResponse } from "@/types";

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        // Call Next.js BFF
        const response = await axios.post("/api/auth/token", { username, password });
        return response.data;
    },

    signup: async (username: string, password: string): Promise<AuthResponse> => {
        // Call Next.js BFF
        const response = await axios.post("/api/auth/signup", { username, password });
        return response.data;
    }
};
