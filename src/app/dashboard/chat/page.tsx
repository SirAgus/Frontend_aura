'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Moon, Sun, Globe, LogOut, MessageSquare, Plus, Send,
    Trash2, MoreVertical, Edit2, Settings, Bot, User, Sparkles,
    Loader2, Mic, MicOff, Volume2, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../../components/DashboardSidebar';

import { chatService, userService, voiceService } from '@/lib/services/resources';
import { useAudioQueue } from '@/hooks/useAudioQueue';
import AudioWaves from '../../../components/AudioWaves';

const translations = {
    es: {
        workspace: 'Espacio de Trabajo',
        home: 'Inicio',
        synthesis: 'Síntesis',
        voiceLab: 'Laboratorio de Voz',
        history: 'Historial',
        apiSettings: 'Configuración API',
        newChat: 'NUEVO CHAT',
        typeMessage: 'Escribe un mensaje...',
        systemPrompt: 'SYSTEM PROMPT',
        temperature: 'TEMPERATURA',
        model: 'MODELO',
        noThreads: 'No hay conversaciones.',
        deleteThread: 'Eliminar conversación',
        aiTyping: 'Escribiendo...',
        settings: 'Ajustes de IA',
        chatHistory: 'HISTORIAL',
        online: 'EN LÍNEA',
    },
    en: {
        workspace: 'Workspace',
        home: 'Home',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        newChat: 'NEW CHAT',
        typeMessage: 'Type a message...',
        systemPrompt: 'SYSTEM PROMPT',
        temperature: 'TEMPERATURE',
        model: 'MODEL',
        noThreads: 'No conversations.',
        deleteThread: 'Delete conversation',
        aiTyping: 'Typing...',
        settings: 'AI Settings',
        chatHistory: 'HISTORY',
        online: 'ONLINE',
    }
};

export default function ChatPage() {
    const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');

    // Auth & User
    const [userId, setUserId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Data State
    const [threads, setThreads] = useState<any[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    // AI Params
    const [systemPrompt, setSystemPrompt] = useState("Eres un asistente útil y amable.");
    const [temperature, setTemperature] = useState(0.7);
    const [inputText, setTextInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    const [showSettings, setShowSettings] = useState(false);
    const [editingThreadId, setEditingThreadId] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingMode, setRecordingMode] = useState<'text' | 'voice' | null>(null);
    const recordingModeRef = useRef<'text' | 'voice' | null>(null);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { addToQueue, isPlaying: isAuraSpeaking } = useAudioQueue(token);
    const t = translations[lang];

    useEffect(() => {
        const storedToken = localStorage.getItem('voice_token');
        const storedUserId = localStorage.getItem('voice_user_id');

        if (!storedToken || !storedUserId) {
            router.push('/');
            return;
        }

        setToken(storedToken);
        setUserId(storedUserId);

        fetchThreads(storedUserId, storedToken);
    }, []);

    useEffect(() => {
        if (activeThreadId && token) {
            fetchMessages(activeThreadId);
        } else {
            setMessages([]);
        }
    }, [activeThreadId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVoiceMode) {
                if (isRecording) stopRecording();
                setIsVoiceMode(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVoiceMode, isRecording]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchThreads = async (uid: string, tk: string) => {
        try {
            // Service might need refactoring if it expects number, but prompt used string for user_id in localStorage?
            // user_id in db is int, but here we read from localStorage as string.
            // Let's parse int.
            const userIdNum = parseInt(uid, 10);
            if (isNaN(userIdNum)) return;

            const data = await chatService.getThreadsByUser(userIdNum);
            if (data) {
                setThreads(data.reverse());
                // User requirement: default to "New Message" (null state)
                setActiveThreadId(null);
            }
        } catch (e) {
            console.error("Error fetching threads", e);
        }
    };

    const fetchMessages = async (threadId: number) => {
        try {
            const data = await chatService.getMessages(threadId);
            setMessages(data || []);
        } catch (e) {
            console.error("Error fetching messages", e);
        }
    };

    const handleCreateThread = () => {
        setActiveThreadId(null);
        setMessages([]);
        setTextInput("");
    };

    const handleDeleteThread = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm(t.deleteThread + '?')) return;

        try {
            await chatService.deleteThread(id);
            const newThreads = threads.filter(t => t.id !== id);
            setThreads(newThreads);
            if (activeThreadId === id) {
                setActiveThreadId(null);
            }
        } catch (e) { console.error(e); }
    };

    const handleStartEdit = (e: React.MouseEvent, thread: any) => {
        e.stopPropagation();
        setEditingThreadId(thread.id);
        setEditingTitle(thread.title);
    };

    const handleSaveTitle = async (e: React.KeyboardEvent | React.FocusEvent, id: number) => {
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') return;

        try {
            await chatService.updateThread(id, editingTitle);
            setThreads(threads.map(t => t.id === id ? { ...t, title: editingTitle } : t));
            setEditingThreadId(null);
        } catch (e) { console.error(e); }
    };

    const startRecording = async (mode: 'text' | 'voice') => {
        if (isRecording) {
            stopRecording();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                // Use the Ref here to avoid stale closures
                handleSendMessage(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingMode(mode);
            recordingModeRef.current = mode; // Sync Ref
            if (mode === 'voice') {
                setIsVoiceMode(true);
            }
            console.log("Recording started in mode:", mode);
        } catch (err: any) {
            console.error("Error accessing mic:", err);
            alert("Error al iniciar la grabación: " + err.message);
            setIsRecording(false);
            setRecordingMode(null);
            recordingModeRef.current = null;
            setIsVoiceMode(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleSendMessage = async (audioBlob?: Blob) => {
        if (!inputText.trim() && !audioBlob) return;

        let currentThreadId = activeThreadId;

        const currentText = inputText;
        if (!audioBlob) setTextInput("");
        setLoading(true);
        setIsWaiting(true);

        try {
            // 0. Create thread if none active
            if (!currentThreadId) {
                const formData = new FormData();
                const initialTitle = audioBlob ? "Conversación de Voz" : (currentText.slice(0, 30) + '...');
                formData.append('title', initialTitle);
                formData.append('user_id', userId || '');
                const newThread = await chatService.createThread(formData);
                if (!newThread) throw new Error("Could not create thread");
                currentThreadId = newThread.id;
                setThreads([newThread, ...threads]);
                setActiveThreadId(currentThreadId);
            }

            const optimisticMsg = {
                role: 'user',
                content: audioBlob ? "🎤 [Audio enviado]" : currentText,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMsg]);

            // 1. Sending to AI (Backend handles persistence of user message)

            // 2. Call AI (Streaming)
            const chatData = new FormData();
            const endpoint = audioBlob ? '/api/chat/voice' : '/api/chat';

            if (audioBlob) {
                chatData.append('audio', audioBlob, 'user_voice.wav');
                // Flag to tell backend if we want voice response or just text
                // Use Ref to get current value reliably
                chatData.append('voice_response', recordingModeRef.current === 'voice' ? 'true' : 'false');
            } else {
                chatData.append('prompt', currentText);
            }

            chatData.append('thread_id', currentThreadId!.toString()); // Extra context for backend
            chatData.append('system_prompt', systemPrompt);
            chatData.append('temperature', temperature.toString());
            chatData.append('max_tokens', '500');

            const response = await fetch(endpoint, {
                method: 'POST',
                body: chatData,
            });

            if (!response.ok) throw new Error('AI Error');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let aiText = "";

            // Add an empty assistant message to be filled
            setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }]);

            if (reader) {
                setIsWaiting(false);
                let fullStreamText = "";
                let lastProcessedIndex = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunkStr = decoder.decode(value, { stream: true });
                    fullStreamText += chunkStr;

                    // 1. Process User Transcription Markers
                    const transRegex = /\|\|USER_TRANSCRIPTION:([\s\S]*?)\|\|/g;
                    let transMatch;
                    while ((transMatch = transRegex.exec(fullStreamText)) !== null) {
                        if (transMatch.index >= lastProcessedIndex) {
                            const transcription = transMatch[1];
                            setMessages(prev => {
                                const newMsgs = [...prev];
                                for (let i = newMsgs.length - 1; i >= 0; i--) {
                                    if (newMsgs[i].role === 'user') {
                                        newMsgs[i].content = "🎤 " + transcription;
                                        break;
                                    }
                                }
                                return newMsgs;
                            });
                        }
                    }

                    // 2. Process Voice Chunk Markers (Sequential Playback)
                    const voiceRegex = /\|\|(VOICE_STREAM|VOICE_CHUNK):([\s\S]*?)\|\|/g;
                    let vMatch;
                    while ((vMatch = voiceRegex.exec(fullStreamText)) !== null) {
                        if (vMatch.index >= lastProcessedIndex) {
                            const audioUrl = vMatch[2];
                            console.log("Audio marker detected:", audioUrl);

                            // Use Ref to avoid stale closure issues
                            // Eliminar la verificación de modo. Si el backend manda audio, lo reproducimos.
                            // Esto corrige el bug donde si el estado cambiaba o se perdía, el audio se ignoraba.
                            addToQueue(audioUrl);
                            console.log("Added to audio queue (Auto mode)");

                            lastProcessedIndex = voiceRegex.lastIndex;
                        }
                    }

                    // 3. UI Display Logic: Clean markers and partials
                    let displayBody = fullStreamText
                        .replace(/\|\|USER_TRANSCRIPTION:[\s\S]*?\|\|/g, "")
                        .replace(/\|\|(VOICE_STREAM|VOICE_CHUNK):[\s\S]*?\|\|/g, "");

                    // Strip any partial markers at the end to avoid flickering
                    displayBody = displayBody.replace(/\|\|[A-Z_]*:?[\s\S]*$/, "");

                    aiText = displayBody;

                    setMessages(prev => {
                        const newMsgs = [...prev];
                        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'assistant') {
                            newMsgs[newMsgs.length - 1].content = aiText;
                        }
                        return newMsgs;
                    });
                }
            }

            if (aiText) {
                // Backend persists this automatically
                console.log("Chat completed successfully");
            } else {
                throw new Error('No AI Response');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setIsWaiting(false);
        }
    };

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');
    const handleLogout = () => router.push('/');

    // Styles
    const themeClasses = theme === 'light' ? 'bg-[#f0f0f0] text-neutral-900' : 'bg-[#0a0a0a] text-neutral-100';
    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';
    const inputClass = theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#111] border-neutral-800';

    return (
        <div className={`min-h-screen font-sans ${themeClasses} flex flex-col overflow-hidden relative`}>

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-50 border-b ${borderClass} backdrop-blur-md bg-opacity-80 ${theme === 'light' ? 'bg-[#f0f0f0]/80' : 'bg-[#0a0a0a]/80'}`}>
                <div className="w-full px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className={`w-8 h-8 flex items-center justify-center border ${borderClass} rounded-full`}><MessageSquare size={16} /></div>
                        <span>AURA_CHAT</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-xs opacity-60 hidden md:inline">{t.online}</span>
                        <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'} hidden md:block`}></div>
                        <button onClick={toggleLang} className={`p-2 rounded-full border ${borderClass} hover:scale-105`}><Globe size={16} /></button>
                        <button onClick={toggleTheme} className={`p-2 rounded-full border ${borderClass} hover:scale-105`}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
                        <button onClick={handleLogout} className={`p-2 rounded-full border ${borderClass} hover:scale-105`}><LogOut size={18} /></button>
                    </div>
                </div>
            </nav>

            <div className="flex-grow pt-20 flex h-[calc(100vh-80px)] overflow-hidden">
                <DashboardSidebar theme={theme} currentPath="/dashboard/chat" translations={t} />

                {/* Main Area */}
                <main className="flex-1 flex overflow-hidden">

                    {/* Threads List Sidebar */}
                    <div className={`w-64 border-r ${borderClass} flex flex-col flex-shrink-0 ${theme === 'light' ? 'bg-white/50' : 'bg-black/20'}`}>
                        <div className="p-4 border-b border-inherit">
                            <button
                                onClick={handleCreateThread}
                                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${theme === 'light' ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}
                            >
                                <Plus size={16} /> {t.newChat}
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {threads.length === 0 && (
                                <div className="p-4 text-center text-xs opacity-40 font-mono">{t.noThreads}</div>
                            )}
                            {threads.map(thread => (
                                <div
                                    key={thread.id}
                                    onClick={() => setActiveThreadId(thread.id)}
                                    className={`p-3 rounded-lg cursor-pointer group flex items-center justify-between transition-all ${activeThreadId === thread.id
                                        ? (theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800')
                                        : 'hover:bg-neutral-500/10'}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                                        <MessageSquare size={14} className="opacity-60 flex-shrink-0" />
                                        {editingThreadId === thread.id ? (
                                            <input
                                                autoFocus
                                                value={editingTitle}
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                onBlur={(e) => handleSaveTitle(e, thread.id)}
                                                onKeyDown={(e) => handleSaveTitle(e, thread.id)}
                                                className="bg-transparent text-sm outline-none border-b border-emerald-500 w-full"
                                            />
                                        ) : (
                                            <span className="text-sm truncate font-medium">{thread.title || 'Conversation'}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleStartEdit(e, thread)}
                                            className="p-1 hover:text-emerald-500"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteThread(e, thread.id)}
                                            className="p-1 hover:text-red-500"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                        {/* Voice Mode Overlay (Premium Visual Ref) */}
                        {isVoiceMode && (
                            <div className={`absolute inset-0 z-50 flex flex-col p-10 transition-all duration-700 animate-in fade-in zoom-in-95 ${theme === 'light' ? 'bg-white' : 'bg-[#0a0a0a]'}`}>
                                {/* Radial Glow Background */}
                                <div className={`absolute inset-0 opacity-40 ${theme === 'light' ? 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]'}`}></div>

                                {/* Top Bar */}
                                <div className="flex items-center justify-between relative z-10 w-full">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isRecording || isAuraSpeaking ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300'}`}></div>
                                        <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${theme === 'light' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                            Modo Voz Activo
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (isRecording) stopRecording();
                                            setIsVoiceMode(false);
                                        }}
                                        className={`p-3 rounded-full transition-all hover:scale-110 active:scale-90 ${theme === 'light' ? 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'}`}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative z-10 text-center">

                                    {/* Premium Orb Visualizer */}
                                    <div className="w-full h-[300px] mb-8 animate-in zoom-in duration-1000">
                                        <AudioWaves isActive={isAuraSpeaking || isRecording} theme={theme} />
                                    </div>

                                    <div className="space-y-6 mb-12 w-full px-4">
                                        <div className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2 animate-in fade-in duration-1000">Aura</div>
                                        <div className="w-full h-[180px] overflow-hidden flex flex-col justify-end items-center relative">
                                            {/* Fade mask at top */}
                                            <div className={`absolute top-0 left-0 w-full h-10 bg-gradient-to-b ${theme === 'light' ? 'from-white to-transparent' : 'from-[#0a0a0a] to-transparent'} z-10`}></div>

                                            <h2 className={`text-4xl md:text-5xl font-bold leading-[1.2] tracking-tight transition-all duration-700 text-center w-full ${theme === 'light' ? 'text-neutral-900' : 'text-white'}`}>
                                                {messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || '¡Hola! ¿En qué puedo ayudarte hoy?'}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Mic Button Area */}
                                    <div className="flex flex-col items-center gap-6">
                                        <button
                                            onClick={() => isRecording ? stopRecording() : startRecording('voice')}
                                            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative group ${isRecording ? 'bg-red-500 shadow-red-500/20' : 'bg-emerald-500 shadow-emerald-500/30 text-white'}`}
                                        >
                                            <div className={`absolute inset-[-10px] rounded-full bg-inherit transition-all duration-1000 ${isRecording ? 'opacity-20 scale-110' : 'opacity-0 scale-100'}`}></div>
                                            <div className={`absolute inset-[-20px] rounded-full bg-inherit transition-all duration-1000 delay-100 ${isRecording ? 'opacity-10 scale-125' : 'opacity-0 scale-100'}`}></div>

                                            <Mic size={36} className={`transition-transform duration-500 ${isRecording ? 'scale-110' : 'group-hover:scale-110'}`} />
                                        </button>

                                        <span className={`text-[11px] font-bold uppercase tracking-[0.4em] transition-opacity duration-500 ${isRecording ? 'text-neutral-400' : 'text-neutral-300 opacity-60'}`}>
                                            {isRecording ? 'Escuchando...' : 'Toca para hablar'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Chat Settings Header */}
                        <div className={`h-12 border-b ${borderClass} flex items-center justify-between px-6 bg-opacity-50 text-xs font-mono`}>
                            <span className="opacity-60 uppercase">{activeThreadId ? `Thread #${activeThreadId}` : 'Select a thread'}</span>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`flex items-center gap-2 hover:opacity-100 transition-opacity ${showSettings ? 'opacity-100 text-emerald-500' : 'opacity-50'}`}
                            >
                                <Settings size={14} /> {t.settings}
                            </button>
                        </div>

                        {/* Settings Panel (Collapsible) */}
                        {showSettings && (
                            <div className={`absolute top-12 left-0 right-0 z-10 p-4 border-b ${borderClass} ${theme === 'light' ? 'bg-[#f0f0f0]' : 'bg-[#0a0a0a]'} animate-in slide-in-from-top-2`}>
                                <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">{t.systemPrompt}</label>
                                        <input
                                            type="text"
                                            value={systemPrompt}
                                            onChange={(e) => setSystemPrompt(e.target.value)}
                                            className={`w-full p-2 rounded text-xs font-mono border outline-none focus:border-emerald-500 ${inputClass}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">{t.temperature}: {temperature}</label>
                                        <input
                                            type="range" min="0" max="2" step="0.1"
                                            value={temperature}
                                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">{t.model}</label>
                                        <div className="text-xs font-mono opacity-60 py-2">Qwen/Qwen2.5-3B-Instruct (Local)</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                            {!activeThreadId ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 select-none">
                                    <MessageSquare size={48} />
                                    <p className="mt-4 font-mono text-sm uppercase">{t.newChat}</p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role !== 'user' && (
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-2 shadow-lg">
                                                    <Bot size={16} />
                                                </div>
                                            )}

                                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                                ? (theme === 'light' ? 'bg-black text-white rounded-tr-sm' : 'bg-white text-black rounded-tr-sm')
                                                : (theme === 'light' ? 'bg-white border border-neutral-200 rounded-tl-sm' : 'bg-neutral-900 border border-neutral-800 rounded-tl-sm')
                                                }`}>
                                                {msg.content}
                                            </div>

                                            {msg.role === 'user' && (
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-2 shadow-sm ${theme === 'light' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-white'}`}>
                                                    <User size={16} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {isWaiting && (
                                        <div className="flex gap-4 justify-start">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-2">
                                                <Bot size={16} />
                                            </div>
                                            <div className="flex items-center gap-1 p-4">
                                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
                                                <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className={`p-6 border-t ${borderClass} ${theme === 'light' ? 'bg-white/50' : 'bg-black/50'} backdrop-blur-sm`}>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startRecording('text')}
                                        title="Audio (IA escribe)"
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isRecording && recordingMode === 'text' ? 'bg-red-500 text-white scale-110' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                                    >
                                        <Mic size={20} />
                                    </button>
                                    <button
                                        onClick={() => startRecording('voice')}
                                        title="Voz (IA habla)"
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isRecording && recordingMode === 'voice' ? 'bg-red-500 text-white scale-110' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                                    >
                                        <Volume2 size={20} />
                                    </button>
                                </div>

                                <div className={`flex-1 flex items-center gap-2 p-2 pr-4 rounded-2xl border ${theme === 'light' ? 'bg-white border-neutral-300 focus-within:border-black' : 'bg-[#111] border-neutral-700 focus-within:border-white'} transition-colors shadow-lg`}>
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={isRecording ? "Grabando voz..." : t.typeMessage}
                                        className="flex-1 bg-transparent p-3 outline-none text-sm"
                                        disabled={loading || isRecording}
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputText.trim() || loading || isRecording}
                                        className={`p-3 rounded-xl transition-all ${!inputText.trim() || loading || isRecording ? 'opacity-30 cursor-not-allowed' : 'bg-emerald-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30'}`}
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="text-center mt-3 text-[10px] font-mono opacity-30 uppercase tracking-widest flex items-center justify-center gap-4">
                                <span>Qwen 2.5 3B Instruct • Runs Locally</span>
                                {isRecording && <span className="text-red-500 animate-pulse font-bold tracking-tighter">● REC</span>}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
