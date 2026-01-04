'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Waves, Globe, LogOut, Mic, Users, Clock, Settings, Upload, Save, Play, CheckCircle2, AlertCircle, Loader2, Trash2, Edit2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/DashboardSidebar';

const API_BASE = 'http://localhost:8000';

const translations = {
    es: {
        workspace: 'Espacio de Trabajo',
        home: 'Inicio',
        synthesis: 'Síntesis',
        voiceLab: 'Laboratorio de Voz',
        history: 'Historial',
        apiSettings: 'Configuración API',
        uploadVoice: 'CLONAR NUEVA VOZ',
        voiceName: 'NOMBRE DE LA VOZ',
        selectFile: 'SELECCIONAR ARCHIVO WAV',
        uploading: 'SUBIENDO...',
        saveVoice: 'GUARDAR VOZ',
        successUpload: 'Voz clonada exitosamente.',
        errorUpload: 'Error al subir la voz.',
        availableVoices: 'VOCES DISPONIBLES',
        noVoices: 'No hay voces clonadas disponibles.',
        deleteConfirm: '¿Estás seguro de eliminar esta voz?',
        saveChanges: 'GUARDAR CAMBIOS',
        cancel: 'CANCELAR',
        editVoice: 'EDITAR VOZ',
    },
    en: {
        workspace: 'Workspace',
        home: 'Home',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        uploadVoice: 'CLONE NEW VOICE',
        voiceName: 'VOICE NAME',
        selectFile: 'SELECT WAV FILE',
        uploading: 'UPLOADING...',
        saveVoice: 'SAVE VOICE',
        successUpload: 'Voice cloned successfully.',
        errorUpload: 'Error uploading voice.',
        availableVoices: 'AVAILABLE VOICES',
        noVoices: 'No cloned voices available.',
        deleteConfirm: 'Are you sure you want to delete this voice?',
        saveChanges: 'SAVE CHANGES',
        cancel: 'CANCEL',
        editVoice: 'EDIT VOICE',
    }
};

export default function VoiceLabPage() {
    const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');

    // State for new fields
    const [voiceName, setVoiceName] = useState('');
    const [language, setLanguage] = useState('es');
    const [region, setRegion] = useState('');
    const [gender, setGender] = useState('female');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const [voices, setVoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Edit State
    const [editingVoice, setEditingVoice] = useState<any>(null);

    // Audio Preview State
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const t = translations[lang];

    useEffect(() => {
        fetchVoices();
    }, []);

    const getAuth = () => localStorage.getItem('voice_auth') || btoa('admin:admin_password');

    const fetchVoices = async () => {
        try {
            const response = await fetch(`${API_BASE}/voices`, {
                headers: { 'Authorization': `Basic ${getAuth()}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Handle both old (array of strings) and new (array of objects) formats gracefully
                const processedVoices = (data.voices || []).map((v: any) =>
                    typeof v === 'string' ? { name: v, language: '?', gender: '?' } : v
                );
                setVoices(processedVoices);
            }
        } catch (e) { console.error(e); }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !voiceName) return;

        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('name', voiceName);
        formData.append('file', file);
        formData.append('language', language);
        formData.append('region', region);
        formData.append('gender', gender);
        formData.append('description', description);

        try {
            const response = await fetch(`${API_BASE}/voices/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Basic ${getAuth()}` },
                body: formData,
            });

            if (response.ok) {
                setMessage({ type: 'success', text: t.successUpload });
                setVoiceName('');
                setLanguage('es');
                setRegion('');
                setGender('female');
                setDescription('');
                setFile(null);
                fetchVoices();
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            setMessage({ type: 'error', text: t.errorUpload });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVoice) return;

        // PUT /voices/{id}
        // Assuming backend accepts formData or params. Prompt says "PUT /voices/{voice_id}: Renombra una voz o actualiza sus metadatos".
        try {
            // Since the prompt doesn't specify if it's JSON or FormData for PUT, I'll assume query params for simplicity as per common pattern in FastAPIs or similar to upload but without file.
            // However, proper REST PUT usually takes body.
            // Based on upload using FormData, let's try FormData without file, or JSON.
            // "Renombra una voz" implies 'name' param can change? If ID changes, that's tricky.
            // Let's assume ID is the original name and we pass new_name.

            const params = new URLSearchParams();
            if (editingVoice.newName) params.append('new_name', editingVoice.newName);
            params.append('language', editingVoice.language);
            params.append('region', editingVoice.region);
            params.append('gender', editingVoice.gender);
            params.append('description', editingVoice.description);

            const response = await fetch(`${API_BASE}/voices/${editingVoice.originalName}?${params.toString()}`, {
                method: 'PUT',
                headers: { 'Authorization': `Basic ${getAuth()}` }
            });

            if (response.ok) {
                setEditingVoice(null);
                fetchVoices();
            } else {
                console.error("Update failed");
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (voiceName: string) => {
        if (!confirm(t.deleteConfirm)) return;
        try {
            await fetch(`${API_BASE}/voices/${voiceName}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Basic ${getAuth()}` }
            });
            fetchVoices();
        } catch (e) { console.error(e); }
    };

    const handlePreview = async (voiceName: string) => {
        // Logic for preview
        if (playingVoice === voiceName) {
            audioRef.current?.pause();
            setPlayingVoice(null);
            return;
        }
        setPlayingVoice(voiceName);
        try {
            const formData = new FormData();
            formData.append('text', `Hola, esta es una prueba de voz.`); // Spanish default
            formData.append('voice_id', voiceName);
            // If the voice metadata says 'en', maybe backend handles it.
            // But here we just assume it works.

            const response = await fetch(`${API_BASE}/generate-tts`, {
                method: 'POST',
                headers: { 'Authorization': `Basic ${getAuth()}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Preview failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                audioRef.current.onended = () => setPlayingVoice(null);
            }
        } catch (e) {
            console.error(e);
            setPlayingVoice(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('voice_auth');
        router.push('/');
    };

    const themeClasses = theme === 'light' ? 'bg-[#f0f0f0] text-neutral-900' : 'bg-[#0a0a0a] text-neutral-100';
    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';
    const inputClass = theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#111] border-neutral-800';

    return (
        <div className={`min-h-screen font-sans ${themeClasses} flex flex-col`}>
            <audio ref={audioRef} className="hidden" />

            {/* Navbar */}
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

            {/* Edit Modal */}
            {editingVoice && (
                <div className="fixed inset-0 z-[60] backdrop-blur-sm bg-black/50 flex items-center justify-center p-4">
                    <div className={`w-full max-w-lg p-8 rounded-xl shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-[#111] border border-neutral-800'}`}>
                        <h3 className="text-xl font-bold mb-4">{t.editVoice}</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs font-mono opacity-60">Name</label>
                                <input type="text" value={editingVoice.newName} onChange={e => setEditingVoice({ ...editingVoice, newName: e.target.value })} className={`w-full p-2 border rounded ${inputClass}`} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-mono opacity-60">Language</label>
                                    <select value={editingVoice.language} onChange={e => setEditingVoice({ ...editingVoice, language: e.target.value })} className={`w-full p-2 border rounded ${inputClass}`}>
                                        <option value="es">Español</option>
                                        <option value="en">English</option>
                                        <option value="pt">Português</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-mono opacity-60">Gender</label>
                                    <select value={editingVoice.gender} onChange={e => setEditingVoice({ ...editingVoice, gender: e.target.value })} className={`w-full p-2 border rounded ${inputClass}`}>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-mono opacity-60">Region</label>
                                <input type="text" value={editingVoice.region} onChange={e => setEditingVoice({ ...editingVoice, region: e.target.value })} className={`w-full p-2 border rounded ${inputClass}`} />
                            </div>
                            <div>
                                <label className="text-xs font-mono opacity-60">Description</label>
                                <textarea value={editingVoice.description} onChange={e => setEditingVoice({ ...editingVoice, description: e.target.value })} className={`w-full p-2 border rounded h-20 resize-none ${inputClass}`} />
                            </div>

                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setEditingVoice(null)} className="px-4 py-2 text-xs font-bold uppercase hover:bg-neutral-500/10 rounded">{t.cancel}</button>
                                <button type="submit" className={`px-4 py-2 text-xs font-bold uppercase rounded ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}>{t.saveChanges}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex-grow pt-20 flex h-[calc(100vh-80px)] overflow-hidden">
                <DashboardSidebar theme={theme} currentPath="/dashboard/voices" translations={t} />

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Upload Section */}
                        <div className="lg:col-span-5">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Upload className="text-emerald-500" /> {t.uploadVoice}</h2>
                            <form onSubmit={handleUpload} className={`p-8 border ${borderClass} rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-[#111]'}`}>
                                {/* Same upload form as before */}
                                <div className="mb-4">
                                    <label className="block text-xs font-mono uppercase opacity-60 mb-2">{t.voiceName}</label>
                                    <input
                                        type="text"
                                        value={voiceName}
                                        onChange={(e) => setVoiceName(e.target.value)}
                                        className={`w-full p-3 rounded-lg outline-none border focus:border-emerald-500 transition-colors ${inputClass}`}
                                        placeholder="e.g. jarvis_v1"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-mono uppercase opacity-60 mb-2">Language</label>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className={`w-full p-3 rounded-lg outline-none border focus:border-emerald-500 transition-colors ${inputClass}`}
                                        >
                                            <option value="es">Español</option>
                                            <option value="en">English</option>
                                            <option value="pt">Português</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase opacity-60 mb-2">Gender</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className={`w-full p-3 rounded-lg outline-none border focus:border-emerald-500 transition-colors ${inputClass}`}
                                        >
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-mono uppercase opacity-60 mb-2">Region (e.g. CL, MX)</label>
                                    <input
                                        type="text"
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className={`w-full p-3 rounded-lg outline-none border focus:border-emerald-500 transition-colors ${inputClass}`}
                                        placeholder="CL"
                                        maxLength={2}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-mono uppercase opacity-60 mb-2">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className={`w-full p-3 rounded-lg outline-none border focus:border-emerald-500 transition-colors resize-none h-20 ${inputClass}`}
                                        placeholder="Describe the voice accent or intent..."
                                    />
                                </div>

                                <div className="mb-8">
                                    <label className="block text-xs font-mono uppercase opacity-60 mb-2">{t.selectFile}</label>
                                    <div className={`border-2 border-dashed ${borderClass} rounded-lg p-6 text-center cursor-pointer hover:bg-neutral-500/5 transition-colors relative`}>
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept=".wav"
                                            required
                                        />
                                        <Upload className="mx-auto mb-2 opacity-40" />
                                        <span className="text-sm font-mono opacity-60">{file ? file.name : 'Drop WAV here'}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    {loading ? t.uploading : t.saveVoice}
                                </button>

                                {message && (
                                    <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        {message.text}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* List Section */}
                        <div className="lg:col-span-7">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="text-blue-500" /> {t.availableVoices}</h2>
                            <div className={`border ${borderClass} rounded-xl overflow-hidden`}>
                                {voices.length === 0 ? (
                                    <div className="p-8 text-center opacity-40 font-mono text-sm">{t.noVoices}</div>
                                ) : (
                                    <div className="grid grid-cols-1 divide-y divide-neutral-200 dark:divide-neutral-800">
                                        {voices.map((voice, idx) => {
                                            const v = typeof voice === 'string' ? { name: voice } : voice;

                                            return (
                                                <div key={idx} className={`p-5 flex items-start justify-between hover:bg-neutral-500/5 transition-colors group`}>
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                                            {v.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold flex items-center gap-2">
                                                                {v.name}
                                                                {v.region && v.region !== '?' && <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-500/10 border border-neutral-500/20 font-mono uppercase">{v.region}</span>}
                                                            </h3>

                                                            <div className="flex flex-wrap gap-2 text-xs opacity-60 mt-1 font-mono">
                                                                {v.language && v.language !== '?' && <span>{v.language?.toUpperCase()}</span>}
                                                                {v.language && v.language !== '?' && v.gender && v.gender !== '?' && <span>•</span>}
                                                                {v.gender && v.gender !== '?' && <span>{v.gender?.toUpperCase()}</span>}

                                                                {(!v.language || v.language === '?') && (!v.gender || v.gender === '?') && <span>STANDARD VOICE</span>}
                                                            </div>
                                                            {v.description && <p className="text-sm mt-2 opacity-80 max-w-md">{v.description}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handlePreview(v.name)}
                                                            className={`p-3 rounded-full hover:bg-neutral-500/10 transition-colors ${playingVoice === v.name ? 'text-emerald-500 bg-emerald-500/10' : 'opacity-20 group-hover:opacity-100'}`}
                                                            title="Preview Voice"
                                                        >
                                                            {playingVoice === v.name ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingVoice({ ...v, originalName: v.name, newName: v.name })}
                                                            className={`p-3 rounded-full hover:bg-neutral-500/10 transition-colors opacity-20 group-hover:opacity-100`}
                                                            title="Edit Voice"
                                                        >
                                                            <Edit2 size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(v.name)}
                                                            className={`p-3 rounded-full hover:bg-red-500/10 text-red-500 transition-colors opacity-20 group-hover:opacity-100`}
                                                            title="Delete Voice"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
