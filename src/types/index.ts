
// Auth
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_id?: number; // Login
    id?: number; // Signup
    username?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    default_voice_id?: string;
    api_key?: string;
    created_at: string;
}

// Voices
export interface Voice {
    name: string; // ID sanitizado
    language: string;
    region?: string;
    gender?: string;
    description?: string;
    model?: string;
}

export interface VoiceUploadResponse {
    status: string;
    voice_id: string;
}

// Chat & Threads
export interface ChatResponse {
    response: string;
    model: string;
}

export interface Thread {
    id: number;
    title: string;
    user_id: number;
    created_at?: string;
}

export interface Message {
    id?: number;
    thread_id?: number;
    role: "user" | "assistant";
    content: string;
    audio_id?: string;
    created_at?: string;
}

// Payloads
export interface TTSPayload {
    text: string;
    voice_id?: string;
    audio_prompt?: File;
    language?: string;
    temperature?: number;
    ambience_id?: string;
}

export interface ChatPayload {
    prompt: string;
    system_prompt?: string;
    max_tokens?: number;
    temperature?: number;
}

export interface HistoryItem {
    id: string;
    text: string;
    voice_used: string;
    timestamp: string;
    audio_url?: string;
    filename?: string;
    mode?: string;
    language_id?: string;
    temperature?: number;
    exaggeration?: number;
    cfg?: number;
    repetition_penalty?: number;
    top_p?: number;
}
