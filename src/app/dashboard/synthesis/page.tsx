'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Waves, Globe, LogOut, Mic, Users, Clock, Settings, Play, Pause, Download, Sparkles, Upload, Loader2, Save, X, RefreshCw, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from '../../../components/DashboardSidebar';

// API Config
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
        synthesizing: 'GENERANDO AUDIO...',
        liveEditor: 'EDITOR NEURONAL',
        typePlaceholder: 'Escribe el texto que deseas que la IA lea...',
        generate: 'GENERAR AUDIO',
        quickDemo: 'DEMO RÁPIDO',
        voicesTitle: 'BIBLIOTECA DE VOCES',
        uploadRef: 'Clonar Voz (Subir Audio)',
        selectVoice: 'SELECCIONAR VOZ',
        chars: 'CARACTERES',
        generatedOutput: 'RESULTADO',
        errorText: 'El campo de texto no puede estar vacío.',
        errorVoice: 'Debes seleccionar una voz o subir un archivo de referencia.',
        download: 'DESCARGAR',
        clear: 'LIMPIAR',
        usingFile: 'Usando archivo de referencia',
        removeFile: 'Quitar',
        mode: 'MODO',
        turbo: 'TURBO',
        multilingual: 'MULTILINGÜE',
        languageId: 'IDIOMA',
        advancedSettings: 'CONFIGURACIÓN AVANZADA',
        temperature: 'TEMPERATURA',
        exaggeration: 'EXAGERACIÓN',
        cfg: 'CFG',
        repetitionPenalty: 'REPETICIÓN',
        topP: 'TOP-P',
        temperatureDesc: 'Más alto = más emoción y naturalidad',
        exaggerationDesc: 'Más alto = más expresiva y energética',
        cfgDesc: 'Más bajo = más libertad y naturalidad',
        repetitionPenaltyDesc: 'Más alto = menos repeticiones',
        topPDesc: 'Controla diversidad de palabras',
        paralinguisticTags: 'TAGS PARALINGÜÍSTICOS (TURBO)',
        clickToInsert: 'Clic para insertar',
    },
    en: {
        statusOnline: 'STATUS: ONLINE',
        workspace: 'Workspace',
        home: 'Home',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        synthesizing: 'GENERATING AUDIO...',
        liveEditor: 'NEURAL EDITOR',
        typePlaceholder: 'Type the text you want the AI to read...',
        generate: 'GENERATE AUDIO',
        quickDemo: 'QUICK DEMO',
        voicesTitle: 'VOICE LIBRARY',
        uploadRef: 'Clone Voice (Upload Audio)',
        selectVoice: 'SELECT VOICE',
        chars: 'CHARS',
        generatedOutput: 'RESULT',
        errorText: 'Text field cannot be empty.',
        errorVoice: 'You must select a voice or upload a reference file.',
        download: 'DOWNLOAD',
        clear: 'CLEAR',
        usingFile: 'Using reference file',
        removeFile: 'Remove',
        mode: 'MODE',
        turbo: 'TURBO',
        multilingual: 'MULTILINGUAL',
        languageId: 'LANGUAGE',
        advancedSettings: 'ADVANCED SETTINGS',
        temperature: 'TEMPERATURE',
        exaggeration: 'EXAGGERATION',
        cfg: 'CFG',
        repetitionPenalty: 'REPETITION',
        topP: 'TOP-P',
        temperatureDesc: 'Higher = more emotion and naturalness',
        exaggerationDesc: 'Higher = more expressive and energetic',
        cfgDesc: 'Lower = more freedom and naturalness',
        repetitionPenaltyDesc: 'Higher = fewer repetitions',
        topPDesc: 'Controls word diversity',
        paralinguisticTags: 'PARALINGUISTIC TAGS (TURBO)',
        clickToInsert: 'Click to insert',
    }
};

const PARALINGUISTIC_TAGS = [
    { label: 'Carraspeo', tag: '[clear throat]' },
    { label: 'Suspiro', tag: '[sigh]' },
    { label: 'Chistar', tag: '[shush]' },
    { label: 'Tos', tag: '[cough]' },
    { label: 'Quejido', tag: '[groan]' },
    { label: 'Olfatear', tag: '[sniff]' },
    { label: 'Jadeo', tag: '[gasp]' },
    { label: 'Risita', tag: '[chuckle]' },
    { label: 'Risa', tag: '[laugh]' },
];

const MULTILINGUAL_LANGS = [
    { code: 'ar', name: 'Arabic' },
    { code: 'pt', name: 'Brazilian Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'cs', name: 'Czech' },
    { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'pl', name: 'Polish' },
    { code: 'ru', name: 'Russian' },
    { code: 'es', name: 'Spanish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'da', name: 'Danish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'sv', name: 'Swedish' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'uk', name: 'Ukrainian' }
];

export default function SynthesisPage() {
    const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');

    // Synthesis State
    const [textInput, setTextInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // New mode and language parameters
    const [selectedMode, setSelectedMode] = useState<'turbo' | 'multilingual'>('multilingual');
    const [languageId, setLanguageId] = useState('es');

    // Advanced parameters
    const [temperature, setTemperature] = useState(0.7);
    const [exaggeration, setExaggeration] = useState(0.5);
    const [cfg, setCfg] = useState(1.0);
    const [repetitionPenalty, setRepetitionPenalty] = useState(2.0);
    const [topP, setTopP] = useState(1.0);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // State for voices (now objects)
    const [availableVoices, setAvailableVoices] = useState<any[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<any>(null); // Now stores the full object
    const [file, setFile] = useState<File | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = translations[lang];

    // Fetch available voices on mount
    useEffect(() => {
        fetchVoices();
    }, []);

    const fetchVoices = async () => {
        const auth = getAuth();
        if (!auth) return;

        try {
            const response = await fetch(`${API_BASE}/voices`, {
                headers: { 'Authorization': `Basic ${auth}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Normalize voices to always be objects
                const processed = (data.voices || []).map((v: any) =>
                    typeof v === 'string' ? { name: v, language: '?', gender: '?' } : v
                );
                setAvailableVoices(processed);

                // Select first voice by default if no file is selected
                if (processed.length > 0 && !file) {
                    setSelectedVoice(processed[0]);
                }
            }
        } catch (err) {
            console.error("Failed to load voices", err);
        }
    };

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');
    const handleLogout = () => router.push('/');

    // --- API Integrations ---

    const handleQuickDemo = async () => {
        if (!textInput.trim()) {
            setError(t.errorText);
            return;
        }
        setLoading(true);
        setError(null);
        setAudioUrl(null);

        try {
            const formData = new FormData();
            formData.append('text', textInput);

            const response = await fetch(`${API_BASE}/demo`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Demo generation failed');

            const blob = await response.blob();
            setAudioUrl(URL.createObjectURL(blob));
        } catch (err) {
            setError('Error generating demo');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTTS = async () => {
        if (!textInput.trim()) {
            setError(t.errorText);
            return;
        }

        if (!selectedVoice && !file) {
            setError(t.errorVoice);
            return;
        }

        const auth = getAuth();
        if (!auth) return;

        setLoading(true);
        setError(null);
        setAudioUrl(null);

        try {
            const formData = new FormData();
            formData.append('text', textInput);
            formData.append('mode', selectedMode);
            formData.append('language_id', languageId);
            formData.append('temperature', temperature.toString());
            formData.append('exaggeration', exaggeration.toString());
            formData.append('cfg', cfg.toString());
            formData.append('repetition_penalty', repetitionPenalty.toString());
            formData.append('top_p', topP.toString());

            if (file) {
                formData.append('audio_prompt', file);
            } else {
                // Use selectedVoice.name for the ID
                formData.append('voice_id', selectedVoice.name);
            }

            const response = await fetch(`${API_BASE}/generate-tts`, {
                method: 'POST',
                headers: { 'Authorization': `Basic ${auth}` },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || 'Generation failed');
            }

            const blob = await response.blob();
            setAudioUrl(URL.createObjectURL(blob));
        } catch (err: any) {
            setError(err.message || 'Error generating TTS');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSelectedVoice(null); // Clear voice selection
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        // Reselect first voice
        if (availableVoices.length > 0) setSelectedVoice(availableVoices[0]);
    };

    // --- UI Helpers ---
    const themeClasses = theme === 'light' ? 'bg-[#f0f0f0] text-neutral-900' : 'bg-[#0a0a0a] text-neutral-100';
    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';

    return (
        <div className={`min-h-screen font-sans ${themeClasses} flex flex-col overflow-hidden`}>
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-50 border-b ${borderClass} backdrop-blur-md bg-opacity-80 ${theme === 'light' ? 'bg-[#f0f0f0]/80' : 'bg-[#0a0a0a]/80'}`}>
                <div className="w-full px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className={`w-8 h-8 flex items-center justify-center border ${borderClass} rounded-full`}><Waves size={16} /></div>
                        <span>AURA_VOICE</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-xs opacity-60 hidden md:inline">{t.statusOnline}</span>
                        <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'} hidden md:block`}></div>
                        <button onClick={toggleLang} className={`p-2 rounded-full border ${borderClass} hover:scale-105`}><Globe size={16} /></button>
                        <button onClick={toggleTheme} className={`p-2 rounded-full border ${borderClass} hover:scale-105`}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
                        <button onClick={handleLogout} className={`p-2 rounded-full border ${borderClass} hover:scale-105`}><LogOut size={18} /></button>
                    </div>
                </div>
            </nav>

            <div className="flex-grow pt-20 flex h-[calc(100vh-80px)] overflow-hidden">

                <DashboardSidebar
                    theme={theme}
                    currentPath="/dashboard/synthesis"
                    translations={t}
                />

                {/* Main Synthesis Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Loading Overlay */}
                    {loading && (
                        <div className="absolute inset-0 z-20 backdrop-blur-sm bg-black/10 flex items-center justify-center">
                            <div className={`flex flex-col items-center gap-4 p-8 rounded-xl border ${borderClass} ${theme === 'light' ? 'bg-white shadow-xl' : 'bg-black shadow-2xl'}`}>
                                <Loader2 size={32} className="animate-spin text-emerald-500" />
                                <span className="font-mono text-sm tracking-widest animate-pulse">{t.synthesizing}</span>
                            </div>
                        </div>
                    )}

                    {/* Center: Input & Preview */}
                    <div className="flex-1 flex flex-col relative">
                        <div className={`h-16 border-b ${borderClass} flex items-center justify-between px-6 bg-opacity-50`}>
                            <div className="flex items-center gap-2">
                                <Mic size={16} className={loading ? 'text-emerald-500 animate-pulse' : 'opacity-40'} />
                                <span className="font-mono text-xs font-bold tracking-wider">{t.liveEditor}</span>
                            </div>
                            <div className="flex gap-3">
                                {/* Mode Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs opacity-60">{t.mode}:</span>
                                    <select
                                        value={selectedMode}
                                        onChange={(e) => setSelectedMode(e.target.value as 'turbo' | 'multilingual')}
                                        className={`px-2 py-1 text-xs border ${borderClass} bg-transparent font-mono outline-none`}
                                    >
                                        <option value="turbo">{t.turbo}</option>
                                        <option value="multilingual">{t.multilingual}</option>
                                    </select>
                                </div>

                                {/* Language ID Selector (only when multilingual) */}
                                {selectedMode === 'multilingual' && (
                                    <>
                                        <div className={`h-6 w-[1px] ${borderClass}`}></div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs opacity-60">{t.languageId}:</span>
                                            <select
                                                value={languageId}
                                                onChange={(e) => setLanguageId(e.target.value)}
                                                className={`px-2 py-1 text-xs border ${borderClass} bg-transparent font-mono outline-none max-w-[100px]`}
                                            >
                                                {MULTILINGUAL_LANGS.map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.code.toUpperCase()} - {lang.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Tags Selector (Only for Turbo) */}
                                {selectedMode === 'turbo' && PARALINGUISTIC_TAGS && (
                                    <>
                                        <div className={`h-6 w-[1px] ${borderClass}`}></div>
                                        <div className="flex items-center gap-2 group relative">
                                            <button className="px-2 py-1 text-xs font-mono border border-emerald-500/30 rounded bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 transition-colors flex items-center gap-1">
                                                <Sparkles size={10} /> TAGS
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full right-0 mt-2 w-48 p-2 rounded-xl border bg-white dark:bg-black shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                                <div className="text-[10px] uppercase font-bold opacity-40 mb-2 px-2">{t.clickToInsert}</div>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {PARALINGUISTIC_TAGS.map((tag) => (
                                                        <button
                                                            key={tag.tag}
                                                            onClick={() => setTextInput(prev => prev + " " + tag.tag + " ")}
                                                            className="text-xs font-mono text-left px-2 py-1.5 rounded hover:bg-neutral-500/10 transition-colors flex justify-between items-center"
                                                        >
                                                            <span>{tag.label}</span>
                                                            <span className="opacity-40 text-[10px]">{tag.tag}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className={`h-6 w-[1px] ${borderClass}`}></div>

                                {/* Advanced Settings Toggle */}
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`px-3 py-1.5 rounded text-xs font-mono border ${borderClass} hover:bg-neutral-500/10 transition-colors`}
                                >
                                    ⚙️ {t.advancedSettings}
                                </button>

                                <div className={`h-6 w-[1px] ${borderClass}`}></div>

                                <button
                                    onClick={() => setTextInput('')}
                                    className="px-3 py-1.5 rounded opacity-40 hover:opacity-100 font-mono text-xs flex items-center gap-2 transition-opacity"
                                    title={t.clear}
                                >
                                    <RefreshCw size={12} />
                                </button>
                                <div className={`h-6 w-[1px] ${borderClass}`}></div>
                                <button
                                    onClick={handleQuickDemo}
                                    disabled={loading}
                                    className={`px-4 py-1.5 rounded border ${borderClass} font-bold text-xs uppercase flex items-center gap-2 hover:bg-neutral-500/5 transition-colors ${loading && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <Sparkles size={12} className="text-purple-500" />
                                    {t.quickDemo}
                                </button>
                                <button
                                    onClick={handleGenerateTTS}
                                    disabled={loading}
                                    className={`px-6 py-1.5 rounded font-bold text-xs uppercase flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'} ${loading && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <Play size={12} fill="currentColor" />
                                    {t.generate}
                                </button>
                            </div>
                        </div>

                        {/* Advanced Settings Panel */}
                        {showAdvanced && (
                            <div className={`border-b ${borderClass} p-6 bg-neutral-500/5`}>
                                <div className="max-w-2xl mx-auto">
                                    <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                                        <Sparkles size={16} className="text-purple-500" />
                                        {t.advancedSettings}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                        {/* Temperature */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="font-mono text-xs opacity-80">{t.temperature}</label>
                                                <span className="font-mono text-xs text-purple-500">{temperature.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1.5"
                                                step="0.1"
                                                value={temperature}
                                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((temperature - 0.1) / (1.5 - 0.1)) * 100}%, rgb(75 85 99) ${((temperature - 0.1) / (1.5 - 0.1)) * 100}%, rgb(75 85 99) 100%)`
                                                }}
                                            />
                                            <p className="text-xs opacity-60 mt-1">{t.temperatureDesc}</p>
                                        </div>

                                        {/* Exaggeration */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="font-mono text-xs opacity-80">{t.exaggeration}</label>
                                                <span className="font-mono text-xs text-blue-500">{exaggeration.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.0"
                                                max="2.0"
                                                step="0.1"
                                                value={exaggeration}
                                                onChange={(e) => setExaggeration(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${(exaggeration / 2.0) * 100}%, rgb(75 85 99) ${(exaggeration / 2.0) * 100}%, rgb(75 85 99) 100%)`
                                                }}
                                            />
                                            <p className="text-xs opacity-60 mt-1">{t.exaggerationDesc}</p>
                                        </div>

                                        {/* CFG */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="font-mono text-xs opacity-80">{t.cfg}</label>
                                                <span className="font-mono text-xs text-emerald-500">{cfg.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1.0"
                                                step="0.1"
                                                value={cfg}
                                                onChange={(e) => setCfg(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${((cfg - 0.1) / (1.0 - 0.1)) * 100}%, rgb(75 85 99) ${((cfg - 0.1) / (1.0 - 0.1)) * 100}%, rgb(75 85 99) 100%)`
                                                }}
                                            />
                                            <p className="text-xs opacity-60 mt-1">{t.cfgDesc}</p>
                                        </div>

                                        {/* Repetition Penalty */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="font-mono text-xs opacity-80">{t.repetitionPenalty}</label>
                                                <span className="font-mono text-xs text-orange-500">{repetitionPenalty.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="3.0"
                                                step="0.1"
                                                value={repetitionPenalty}
                                                onChange={(e) => setRepetitionPenalty(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, rgb(249 115 22) 0%, rgb(249 115 22) ${((repetitionPenalty - 0.5) / (3.0 - 0.5)) * 100}%, rgb(75 85 99) ${((repetitionPenalty - 0.5) / (3.0 - 0.5)) * 100}%, rgb(75 85 99) 100%)`
                                                }}
                                            />
                                            <p className="text-xs opacity-60 mt-1">{t.repetitionPenaltyDesc}</p>
                                        </div>

                                        {/* Top-P */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="font-mono text-xs opacity-80">{t.topP}</label>
                                                <span className="font-mono text-xs text-pink-500">{topP.toFixed(1)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1.0"
                                                step="0.1"
                                                value={topP}
                                                onChange={(e) => setTopP(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, rgb(236 72 153) 0%, rgb(236 72 153) ${((topP - 0.1) / (1.0 - 0.1)) * 100}%, rgb(75 85 99) ${((topP - 0.1) / (1.0 - 0.1)) * 100}%, rgb(75 85 99) 100%)`
                                                }}
                                            />
                                            <p className="text-xs opacity-60 mt-1">{t.topPDesc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 relative p-8 overflow-y-auto">
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                className={`w-full h-full resize-none text-2xl leading-relaxed font-light outline-none bg-transparent ${theme === 'light' ? 'placeholder:text-neutral-300' : 'placeholder:text-neutral-700'}`}
                                placeholder={t.typePlaceholder}
                                autoFocus
                            />

                            <div className="absolute bottom-6 right-6 font-mono text-xs opacity-40 select-none pointer-events-none">
                                {textInput.length} {t.chars}
                            </div>

                            {error && (
                                <div className="absolute bottom-20 left-8 right-8 p-4 bg-red-500 text-white rounded-lg text-sm font-mono flex items-center gap-3 shadow-lg animate-in slide-in-from-bottom-2">
                                    <X size={16} className="cursor-pointer" onClick={() => setError(null)} />
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Audio Player Bar */}
                        {audioUrl && (
                            <div className={`border-t ${borderClass} p-6 ${theme === 'light' ? 'bg-white' : 'bg-[#0f0f0f]'} animate-in slide-in-from-bottom-full duration-300`}>

                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => {
                                            if (audioRef.current) {
                                                if (isPlaying) audioRef.current.pause();
                                                else audioRef.current.play();
                                            }
                                        }}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg ${isPlaying ? 'bg-red-500 text-white' : (theme === 'light' ? 'bg-black text-white' : 'bg-white text-black')}`}
                                    >
                                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                    </button>

                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-40">{t.generatedOutput}</span>
                                            <a
                                                href={audioUrl}
                                                download={`aura_synthesis_${Date.now()}.wav`}
                                                className={`text-xs font-bold uppercase flex items-center gap-1 hover:text-emerald-500 transition-colors`}
                                            >
                                                <Download size={14} /> {t.download}
                                            </a>
                                        </div>

                                        {/* Waveform Visualization Placeholder */}
                                        <div className={`h-12 w-full rounded flex items-center gap-1 overflow-hidden opacity-50`}>
                                            {[...Array(40)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-full transition-all duration-150 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}
                                                    style={{
                                                        height: isPlaying ? `${20 + Math.random() * 80}%` : '20%',
                                                        opacity: isPlaying ? 1 : 0.3
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Settings & Voice Select */}
                    <div className={`w-80 border-l ${borderClass} bg-opacity-20 flex flex-col`}>
                        <div className={`h-16 border-b ${borderClass} flex items-center px-6`}>
                            <span className="font-mono text-xs font-bold tracking-wider">{t.voicesTitle}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* File Upload Option */}
                            <div>
                                <label className="text-[10px] font-mono uppercase opacity-40 mb-2 block">{t.uploadRef}</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-4 border ${borderClass} border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-500/5 transition-all group ${file ? 'border-emerald-500 bg-emerald-500/5' : ''}`}
                                >
                                    {file ? (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                                <Volume2 size={20} />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600 truncate max-w-full px-2">{file.name}</span>
                                            <button
                                                onClick={clearFile}
                                                className="mt-2 text-[10px] uppercase font-bold text-red-500 hover:underline"
                                            >
                                                {t.removeFile}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} className="opacity-40 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-mono opacity-60 text-center">Click to upload .WAV</span>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".wav" className="hidden" />
                                </div>
                            </div>

                            {/* Voice List */}
                            <div>
                                <label className="text-[10px] font-mono uppercase opacity-40 mb-2 block">{t.selectVoice}</label>
                                <div className="space-y-2">
                                    {availableVoices.length === 0 && (
                                        <div className="text-xs opacity-40 italic p-2">Loading voices...</div>
                                    )}

                                    {availableVoices.map((voice) => (
                                        <button
                                            key={voice.name}
                                            onClick={() => {
                                                setSelectedVoice(voice);
                                                setFile(null);

                                                // Auto-select mode and language from voice metadata
                                                if (voice.model === 'chatterbox-multilingual') {
                                                    setSelectedMode('multilingual');
                                                    if (voice.language && voice.language !== '?' && voice.language !== 'unknown') {
                                                        setLanguageId(voice.language);
                                                    }
                                                } else if (voice.model === 'chatterbox-turbo' || voice.model === 'chatterbox-original') {
                                                    setSelectedMode('turbo');
                                                    // Turbo doesn't need language_id change usually, or defaults to ES
                                                }
                                            }}
                                            className={`w-full p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${selectedVoice?.name === voice.name && !file
                                                ? (theme === 'light' ? 'bg-black text-white border-black shadow-lg scale-[1.02]' : 'bg-white text-black border-white shadow-lg scale-[1.02]')
                                                : `${borderClass} hover:bg-neutral-500/5 hover:border-neutral-400 opacity-60 hover:opacity-100`
                                                }`}
                                        >
                                            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${selectedVoice?.name === voice.name && !file
                                                ? (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
                                                : 'bg-neutral-500/20'
                                                }`}>
                                                {voice.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm truncate flex items-center gap-2">
                                                    {voice.name}
                                                    {voice.region && voice.region !== '?' && <span className={`text-[9px] px-1 rounded border opacity-60 ${selectedVoice?.name === voice.name ? 'border-current' : 'border-neutral-500'}`}>{voice.region}</span>}
                                                </div>
                                                <div className="text-[10px] opacity-60 font-mono truncate">
                                                    {(!voice.language || voice.language === '?') ? 'STANDARD' : `${voice.language?.toUpperCase()} • ${voice.gender?.toUpperCase()}`}
                                                </div>
                                            </div>
                                            {selectedVoice?.name === voice.name && !file && <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1.5"></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
