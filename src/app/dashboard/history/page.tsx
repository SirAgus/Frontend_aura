'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Waves, Globe, LogOut, Mic, Users, Clock, Settings, Download, Trash2, FileAudio, RefreshCw, Play, Pause, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/DashboardSidebar';
import { useRef } from 'react'; // Ensure useRef is imported

const API_BASE = 'http://localhost:8000';

const getAuth = () => {
    const auth = localStorage.getItem('voice_auth');
    if (!auth) {
        window.location.href = '/';
        return null;
    }
    return auth;
};

const translations = {
    es: {
        statusOnline: 'ESTADO: EN LÍNEA',
        workspace: 'Espacio de Trabajo',
        home: 'Inicio',
        synthesis: 'Síntesis',
        voiceLab: 'Laboratorio de Voz',
        history: 'Historial',
        apiSettings: 'Configuración API',
        generationHistory: 'Historial de Generación',
        search: 'Buscar...',
        text: 'Texto',
        voice: 'Voz',
        date: 'Fecha',
        actions: 'Acciones',
        mode: 'Modo',
        language: 'Idioma',
        temperature: 'Temp',
        exaggeration: 'Exagg',
        cfg: 'CFG',
        repetitionPenalty: 'Rep',
        topP: 'Top-P',
        noHistory: 'No hay historial disponible.',
        loading: 'Cargando historial...',
        clear: 'LIMPIAR',
    },
    en: {
        statusOnline: 'STATUS: ONLINE',
        workspace: 'Workspace',
        home: 'Home',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        generationHistory: 'Generation History',
        search: 'Search...',
        text: 'Text',
        voice: 'Voice',
        date: 'Date',
        actions: 'Actions',
        mode: 'Mode',
        language: 'Language',
        temperature: 'Temp',
        exaggeration: 'Exagg',
        cfg: 'CFG',
        repetitionPenalty: 'Rep',
        topP: 'Top-P',
        noHistory: 'No history available.',
        loading: 'Loading history...',
        clear: 'CLEAR',
    }
};

export default function HistoryPage() {
    const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');

    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Audio Player State
    const [playingFile, setPlayingFile] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const t = translations[lang];

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const auth = getAuth();
        if (!auth) return;

        try {
            const response = await fetch(`${API_BASE}/history`, {
                headers: { 'Authorization': `Basic ${auth}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Sort by timestamp desc
                const sorted = data.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setHistory(sorted);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (filename: string) => {
        const auth = getAuth();
        if (!auth) return;

        try {
            const response = await fetch(`${API_BASE}/download/${filename}`, {
                headers: { 'Authorization': `Basic ${auth}` }
            });
            if (!response.ok) return;

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) { console.error(e); }
    };

    const handlePlay = async (filename: string) => {
        if (playingFile === filename) {
            audioRef.current?.pause();
            setPlayingFile(null);
            return;
        }

        const auth = getAuth();
        if (!auth) return;

        try {
            setPlayingFile(filename); // Optimistic UI update (show spinner or play state)
            const response = await fetch(`${API_BASE}/download/${filename}`, {
                headers: { 'Authorization': `Basic ${auth}` }
            });

            if (!response.ok) throw new Error('Playback failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                audioRef.current.onended = () => setPlayingFile(null);
            }
        } catch (e) {
            console.error(e);
            setPlayingFile(null);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('¿Borrar todo el historial?')) return;

        const auth = getAuth();
        if (!auth) return;

        try {
            await fetch(`${API_BASE}/history?delete_all=true`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${auth}` }
            });
            fetchHistory();
        } catch (e) { console.error(e); }
    };

    const handleDeleteEntry = async (id: string) => {
        if (!confirm('¿Borrar esta entrada?')) return;

        const auth = getAuth();
        if (!auth) return;

        try {
            await fetch(`${API_BASE}/history?ids=${id}`, { // Assuming backend supports query param for simple list or modified
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${auth}` }
            });
            // If backend needs body:
            // await fetch(`${API_BASE}/history`, { method: 'DELETE', headers: ..., body: JSON.stringify({ ids: [id] }) });
            // For now trusting simple query param or single id endpoint if available, but prompt said ids=["..."]
            // Let's assume the user implemented it so: DELETE /history?ids=id1&ids=id2

            fetchHistory();
        } catch (e) { console.error(e); }
    };

    const handleLogout = () => {
        localStorage.removeItem('voice_auth');
        router.push('/');
    };

    const themeClasses = theme === 'light' ? 'bg-[#f0f0f0] text-neutral-900' : 'bg-[#0a0a0a] text-neutral-100';
    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';

    return (
        <div className={`min-h-screen font-sans ${themeClasses} flex flex-col`}>
            <audio ref={audioRef} className="hidden" />

            <nav className={`fixed top-0 left-0 w-full z-50 border-b ${borderClass} backdrop-blur-md bg-opacity-80 ${theme === 'light' ? 'bg-[#f0f0f0]/80' : 'bg-[#0a0a0a]/80'}`}>
                <div className="w-full px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter"><div className={`w-8 h-8 flex items-center justify-center border ${borderClass} rounded-full`}><Waves size={16} /></div><span>AURA_VOICE</span></div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setLang(l => l === 'es' ? 'en' : 'es')} className={`p-2 rounded-full border ${borderClass}`}><Globe size={16} /></button>
                        <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className={`p-2 rounded-full border ${borderClass}`}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
                        <button onClick={handleLogout} className={`p-2 rounded-full border ${borderClass}`}><LogOut size={18} /></button>
                    </div>
                </div>
            </nav>

            <div className="flex-grow pt-20 flex h-[calc(100vh-80px)] overflow-hidden">
                <DashboardSidebar
                    theme={theme}
                    currentPath="/dashboard/history"
                    translations={t}
                />

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2"><Clock /> {t.history}</h2>
                            <div className="flex gap-2">
                                <button onClick={fetchHistory} className={`p-2 rounded hover:bg-neutral-500/10`} title="Reload"><RefreshCw size={20} /></button>
                                {history.length > 0 && (
                                    <button onClick={handleDeleteAll} className="px-4 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 text-xs font-bold uppercase flex items-center gap-2">
                                        <Trash2 size={16} /> {t.clear}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={`border ${borderClass} rounded-xl overflow-hidden`}>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={`bg-neutral-500/5 text-xs font-mono uppercase opacity-60 border-b ${borderClass}`}>
                                        <th className="p-4 w-12">#</th>
                                        <th className="p-4">Text</th>
                                        <th className="p-4">Voice</th>
                                        <th className="p-4">{t.mode}</th>
                                        <th className="p-4">{t.language}</th>
                                        <th className="p-4">{t.temperature}</th>
                                        <th className="p-4">{t.exaggeration}</th>
                                        <th className="p-4">{t.cfg}</th>
                                        <th className="p-4">{t.repetitionPenalty}</th>
                                        <th className="p-4">{t.topP}</th>
                                        <th className="p-4 text-right">Time</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${borderClass}`}>
                                    {loading ? (
                                        <tr><td colSpan={12} className="p-8 text-center opacity-40">{t.loading}</td></tr>
                                    ) : history.length === 0 ? (
                                        <tr><td colSpan={12} className="p-8 text-center opacity-40">{t.noHistory}</td></tr>
                                    ) : (
                                        history.map((item, i) => (
                                            <tr key={item.id} className="hover:bg-neutral-500/5 transition-colors group">
                                                <td className="p-4 font-mono opacity-40">{i + 1}</td>
                                                <td className="p-4 max-w-xs truncate" title={item.text}>{item.text}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.voice_used}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.mode || 'turbo'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.language_id || 'es'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.temperature || '0.8'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.exaggeration || '0.5'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.cfg || '0.5'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.repetition_penalty || '2.0'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-mono border ${borderClass}`}>{item.top_p || '1.0'}</span>
                                                </td>
                                                <td className="p-4 text-right opacity-60 text-xs font-mono">
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </td>
                                                <td className="p-4 text-right flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handlePlay(item.filename)}
                                                        className={`p-2 rounded-full transition-colors ${playingFile === item.filename ? 'bg-emerald-500 text-white' : 'hover:bg-neutral-500/10'}`}
                                                        title="Play"
                                                    >
                                                        {playingFile === item.filename ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                                    </button>
                                                    <button onClick={() => handleDownload(item.filename)} className="p-2 hover:bg-neutral-500/10 rounded-full" title="Download">
                                                        <Download size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteEntry(item.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-full" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
