
import axios from "axios";
import { User, Voice, Thread, Message, ChatResponse, TTSPayload, ChatPayload, VoiceUploadResponse } from "@/types";

// User Service
export const userService = {
    getMe: async (): Promise<User> => {
        const res = await axios.get("/api/users/me");
        return res.data.user;
    },
    updateSettings: async (settings: { default_voice_id: string }): Promise<{ status: string }> => {
        const res = await axios.patch("/api/users/me/settings", settings);
        return res.data;
    },
    createApiKey: async (): Promise<{ api_key: string }> => {
        const res = await axios.post("/api/users/me/api-key");
        return res.data;
    }
};

// System Service
export const systemService = {
    getStatus: async () => {
        const res = await axios.get("/api/system");
        return res.data;
    }
};

// Voice Service
export const voiceService = {
    getAll: async (): Promise<Voice[]> => {
        const res = await axios.get("/api/voices");
        return res.data.voices || []; // Backend returns { voices: [...] }
    },
    upload: async (formData: FormData): Promise<VoiceUploadResponse> => {
        const res = await axios.post("/api/voices/upload", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
    update: async (originalName: string, params: URLSearchParams) => {
        const res = await axios.put(`/api/voices/${originalName}?${params.toString()}`);
        return res.data;
    },
    delete: async (id: string) => {
        await axios.delete(`/api/voices/${id}`);
    }
};

// TTS Service
export const ttsService = {
    generate: async (formData: FormData): Promise<Blob> => {
        const res = await axios.post("/api/tts/generate", formData, {
            responseType: 'blob'
        });
        return res.data;
    }
};

// Chat Service
export const chatService = {
    getThreadsByUser: async (userId: number): Promise<Thread[]> => {
        const res = await axios.get(`/api/threads/user/${userId}`);
        return res.data;
    },
    createThread: async (formData: FormData): Promise<Thread> => {
        const res = await axios.post("/api/threads", formData);
        return res.data;
    },
    updateThread: async (id: number, title: string): Promise<{ status: string }> => {
        const res = await axios.patch(`/api/threads/${id}`, { title });
        return res.data;
    },
    deleteThread: async (id: number) => {
        await axios.delete(`/api/threads/${id}`);
    },
    getMessages: async (threadId: number): Promise<Message[]> => {
        const res = await axios.get(`/api/messages/thread/${threadId}`);
        return res.data;
    },
    sendMessage: async (formData: FormData): Promise<Message> => {
        const res = await axios.post("/api/messages", formData);
        return res.data;
    },
    chat: async (formData: FormData): Promise<ChatResponse> => {
        const res = await axios.post("/api/chat", formData);
        return res.data;
    }
};

// History Service (Dashboard)
export const historyService = {
    getAll: async () => {
        const res = await axios.get("/api/history");
        return res.data;
    }
};
