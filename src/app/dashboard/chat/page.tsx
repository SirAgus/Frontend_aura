'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Moon, Sun, Globe, LogOut, MessageSquare, Plus, Send,
    Trash2, MoreVertical, Edit2, Settings, Bot, User, Sparkles,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../../components/DashboardSidebar';

import { chatService } from '@/lib/services/resources';

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

    // UI State
    const [showSettings, setShowSettings] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
            // Sort by ID desc
            if (data) {
                setThreads(data.reverse());
                if (data.length > 0 && !activeThreadId) {
                    setActiveThreadId(data[0].id);
                }
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

    const handleCreateThread = async () => {
        if (!userId) return;
        try {
            const formData = new FormData();
            formData.append('title', 'Nueva Conversación');
            formData.append('user_id', userId);

            const newThread = await chatService.createThread(formData);
            if (newThread) {
                setThreads([newThread, ...threads]);
                setActiveThreadId(newThread.id);
            }
        } catch (e) {
            console.error("Error creating thread", e);
        }
    };

    const handleDeleteThread = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm(t.deleteThread + '?')) return;

        try {
            await chatService.deleteThread(id);
            const newThreads = threads.filter(t => t.id !== id);
            setThreads(newThreads);
            if (activeThreadId === id) {
                setActiveThreadId(newThreads.length > 0 ? newThreads[0].id : null);
            }
        } catch (e) { console.error(e); }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || !activeThreadId) return;

        const currentText = inputText;
        setTextInput("");
        setLoading(true);

        // 1. Optimistic UI Update (User Message)
        const optimisticMsg = { role: 'user', content: currentText, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            // 2. Persist User Message
            const userMsgData = new FormData();
            userMsgData.append('thread_id', activeThreadId.toString());
            userMsgData.append('role', 'user');
            userMsgData.append('content', currentText);

            await chatService.sendMessage(userMsgData);

            // 3. Call AI
            const chatData = new FormData();
            chatData.append('prompt', currentText);
            chatData.append('system_prompt', systemPrompt);
            chatData.append('temperature', temperature.toString());
            chatData.append('max_tokens', '500');

            const aiResponse = await chatService.chat(chatData);

            if (aiResponse && aiResponse.response) {
                const aiText = aiResponse.response;

                // 4. Persist AI Message
                const aiMsgData = new FormData();
                aiMsgData.append('thread_id', activeThreadId.toString());
                aiMsgData.append('role', 'assistant');
                aiMsgData.append('content', aiText);

                await chatService.sendMessage(aiMsgData);

                // Update messages from server to be sure or just append
                // Simple append for smooth UX
                setMessages(prev => [...prev, { role: 'assistant', content: aiText, timestamp: new Date().toISOString() }]);
            } else {
                throw new Error('AI Error');
            }

        } catch (e) {
            console.error(e);
            // Ideally show error toast
        } finally {
            setLoading(false);
            // Refresh real history to sync IDs etc
            fetchMessages(activeThreadId);
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
        <div className={`min-h-screen font-sans ${themeClasses} flex flex-col overflow-hidden`}>
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
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <MessageSquare size={14} className="opacity-60 flex-shrink-0" />
                                        <span className="text-sm truncate font-medium">{thread.title || 'Conversation'}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteThread(e, thread.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col relative">
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
                                    <p className="mt-4 font-mono text-sm uppercase">Select or create a conversation</p>
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
                                    {loading && (
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
                        {activeThreadId && (
                            <div className={`p-6 border-t ${borderClass} ${theme === 'light' ? 'bg-white/50' : 'bg-black/50'} backdrop-blur-sm`}>
                                <div className={`flex items-center gap-2 p-2 pr-4 rounded-2xl border ${theme === 'light' ? 'bg-white border-neutral-300 focus-within:border-black' : 'bg-[#111] border-neutral-700 focus-within:border-white'} transition-colors shadow-lg`}>
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={t.typeMessage}
                                        className="flex-1 bg-transparent p-3 outline-none text-sm"
                                        disabled={loading}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputText.trim() || loading}
                                        className={`p-3 rounded-xl transition-all ${!inputText.trim() || loading ? 'opacity-30 cursor-not-allowed' : 'bg-emerald-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30'}`}
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    </button>
                                </div>
                                <div className="text-center mt-3 text-[10px] font-mono opacity-30 uppercase tracking-widest">
                                    Qwen 2.5 3B Instruct • Runs Locally
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
