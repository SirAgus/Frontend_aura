'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Waves, Globe, LogOut, Mic, Users, Clock, Settings, Play, Pause, Download, Sparkles, Upload, Loader2, Save, X, RefreshCw, Volume2, Search, Filter, ArrowRight, Info, Edit2, PlusCircle } from 'lucide-react';
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
        synthesizing: 'GENERANDO...',
        liveEditor: 'EDITOR NEURONAL',
        typePlaceholder: 'Escribe el texto que deseas que la IA lea...',
        generate: 'GENERAR',
        quickDemo: 'DEMO',
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
        multilingual: 'MULTI',
        original: 'ORIGINAL',
        languageId: 'IDIOMA',
        advancedSettings: 'AJUSTES',
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
        play: 'REPRODUCIR',
        pause: 'PAUSAR',
    },
    en: {
        statusOnline: 'STATUS: ONLINE',
        workspace: 'Workspace',
        home: 'Home',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        synthesizing: 'GENERATING...',
        liveEditor: 'NEURAL EDITOR',
        typePlaceholder: 'Type the text you want the AI to read...',
        generate: 'GENERATE',
        quickDemo: 'DEMO',
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
        multilingual: 'MULTI',
        original: 'ORIGINAL',
        languageId: 'LANG',
        advancedSettings: 'SETTINGS',
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
        play: 'PLAY',
        pause: 'PAUSE',
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
    const [selectedMode, setSelectedMode] = useState<'turbo' | 'multilingual' | 'original'>('multilingual');
    const [languageId, setLanguageId] = useState('es');

    // Advanced parameters
    const [temperature, setTemperature] = useState(0.7);
    const [exaggeration, setExaggeration] = useState(0.5);
    const [cfg, setCfg] = useState(1.0);
    const [repetitionPenalty, setRepetitionPenalty] = useState(2.0);
    const [topP, setTopP] = useState(1.0);
    const [ambienceId, setAmbienceId] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Style / Emotion System
    const [selectedStyle, setSelectedStyle] = useState('animated');
    const [searchQuery, setSearchQuery] = useState("");
    const [showVoiceModal, setShowVoiceModal] = useState(false);
    const [filterGender, setFilterGender] = useState("all");
    const [filterLanguage, setFilterLanguage] = useState("all");

    // Visualizer State
    const [frequencyData, setFrequencyData] = useState<number[]>(new Array(40).fill(0));
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const connectedElementRef = useRef<HTMLMediaElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Text Highlighter Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlighterRef = useRef<HTMLDivElement>(null);

    const highlightText = (text: string) => {
        if (!text) return <span className="text-neutral-500 opacity-40 italic">{t.typePlaceholder}</span>;

        // Ambience Regex: [rain], [birds], [ambience:abc], [rain:10s]
        const ambienceRegex = /\[(ambience:[^\]]+|rain|birds|forest|beach|storm|office|cafe|lofi|static|fire|wind|ags)(?::\d+s)?\]/i;

        // Emotion/Other Regex: generic [word] that is NOT ambience
        const tagRegex = /(\[[^\]]+\])/g;

        const parts = text.split(tagRegex);

        return parts.map((part, i) => {
            if (part.match(tagRegex)) {
                // Check if it's ambience
                if (part.match(ambienceRegex)) {
                    return <span key={i} className="text-emerald-500 font-bold">{part}</span>;
                }
                // Else emotion/other
                return <span key={i} className="text-orange-500 font-bold">{part}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (highlighterRef.current) {
            highlighterRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };

    const STYLE_PRESETS: Record<string, any> = {
        animated: { label: '✨ Animated (Animada)', temp: 1.2, exag: 2.0, cfg: 1.0, topP: 0.95, rep: 1.2 },
        neutral: { label: '😐 Neutral', temp: 0.75, exag: 0.5, cfg: 2.0, topP: 0.9, rep: 2.0 },
        sad: { label: '😢 Sad (Triste)', temp: 0.4, exag: 0.0, cfg: 3.0, topP: 0.8, rep: 2.0 },
        serious: { label: '🤔 Serious (Serio)', temp: 0.3, exag: 0.1, cfg: 4.0, topP: 0.7, rep: 2.5 },
        happy: { label: '😄 Happy (Feliz)', temp: 1.35, exag: 2.5, cfg: 0.8, topP: 1.0, rep: 1.15 },
        terrified: { label: '😱 Terrified (Aterrado)', temp: 1.5, exag: 4.0, cfg: 0.5, topP: 1.0, rep: 1.1 },
    };

    // Visualization Loop
    useEffect(() => {
        let animationFrame: number;

        const cleanupSource = () => {
            if (sourceRef.current) {
                try {
                    sourceRef.current.disconnect();
                } catch (e) { }
                sourceRef.current = null;
            }
        };

        if (isPlaying && audioRef.current && audioUrl) {
            try {
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                    analyserRef.current = audioContextRef.current.createAnalyser();
                    analyserRef.current.fftSize = 256;
                }

                // MediaElementSource can only be created ONCE per HTMLMediaElement.
                // We trace which element is connected to avoid the 'already connected' error.
                if (connectedElementRef.current !== audioRef.current) {
                    cleanupSource();
                    sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
                    sourceRef.current.connect(analyserRef.current!);
                    analyserRef.current!.connect(audioContextRef.current.destination);
                    connectedElementRef.current = audioRef.current;
                }

                if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }

                const analyser = analyserRef.current;
                if (!analyser) return;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const update = () => {
                    if (analyser) {
                        analyser.getByteFrequencyData(dataArray);
                        const bars = [];
                        for (let i = 0; i < 40; i++) {
                            const val = dataArray[i * 2] / 255;
                            bars.push(val);
                        }
                        setFrequencyData(bars);
                        animationFrame = requestAnimationFrame(update);
                    }
                };
                update();
            } catch (e) {
                console.error("Audio visualization error:", e);
            }
        } else {
            setFrequencyData(new Array(40).fill(0));
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            // We don't cleanup the context itself to reuse it, 
            // but we might want to cleanup the source if we're stopping/changing
            // However, createMediaElementSource can only be called ONCE per element.
            // Since React remounts the element on audioUrl change, we are safe.
        };
    }, [isPlaying, audioUrl]);

    // Apply presets when style changes
    useEffect(() => {
        if (STYLE_PRESETS[selectedStyle]) {
            const s = STYLE_PRESETS[selectedStyle];
            setTemperature(s.temp);
            setExaggeration(s.exag);
            setCfg(s.cfg);
            setTopP(s.topP);
            setRepetitionPenalty(s.rep);
        }
    }, [selectedStyle]);

    const AMBIENCE_OPTIONS = [
        { id: '', label: 'None (Sin ambiente)' },
        { id: 'rain', label: 'Rain (Lluvia)' },
        { id: 'birds', label: 'Birds (Pájaros/Bosque)' },
        { id: 'office', label: 'Office (Oficina moderna)' },
        { id: 'storm', label: 'Storm (Tormenta)' },
        { id: 'wind', label: 'Wind (Viento)' },
        { id: 'cafe', label: 'Cafe (Cafetería)' },
        { id: 'lofi', label: 'Lofi (Música LoFi)' },
    ];

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
            formData.append('ambience_id', ambienceId);

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

    const insertAmbienceTag = () => {
        if (!ambienceId) return;
        const tag = `[${ambienceId}]`;
        setTextInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + tag + ' ');
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
                    {/* Dark Backdrop Overlay during processing */}
                    {loading && (
                        <div className="absolute inset-0 z-40 backdrop-blur-[2px] bg-black/20 transition-all duration-500 animate-in fade-in" />
                    )}

                    {/* Center: Input & Preview */}
                    <div className="flex-1 flex flex-col relative">
                        <div className={`h-16 border-b ${borderClass} flex items-center justify-between px-6 bg-opacity-50`}>
                            <div className="flex items-center gap-2">
                                <Mic size={16} className={loading ? 'text-emerald-500 animate-pulse' : 'opacity-40'} />
                                <span className="font-mono text-xs font-bold tracking-wider">{t.liveEditor}</span>
                            </div>
                            <div className="flex gap-2">
                                {/* Mode Selector */}
                                <div className="flex items-center gap-1">
                                    <span className="font-mono text-[10px] opacity-60 hidden md:inline">{t.mode}:</span>
                                    <select
                                        value={selectedMode}
                                        onChange={(e) => setSelectedMode(e.target.value as 'turbo' | 'multilingual')}
                                        className={`px-1 py-1 text-xs border ${borderClass} bg-transparent font-mono outline-none max-w-[80px]`}
                                    >
                                        <option value="turbo">{t.turbo}</option>
                                        <option value="multilingual">{t.multilingual}</option>
                                        <option value="original">{t.original}</option>
                                    </select>
                                </div>

                                {/* Language ID Selector (only when multilingual) */}
                                {selectedMode === 'multilingual' && (
                                    <>
                                        <div className={`h-6 w-[1px] ${borderClass}`}></div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-[10px] opacity-60 hidden md:inline">{t.languageId}:</span>
                                            <select
                                                value={languageId}
                                                onChange={(e) => setLanguageId(e.target.value)}
                                                className={`px-1 py-1 text-xs border ${borderClass} bg-transparent font-mono outline-none max-w-[80px]`}
                                            >
                                                {MULTILINGUAL_LANGS.map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.code.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {(selectedMode === 'multilingual' || selectedMode === 'original') && (
                                    <>
                                        <div className={`h-6 w-[1px] ${borderClass}`}></div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-[10px] opacity-60 hidden md:inline">STYLE:</span>
                                            <select
                                                value={selectedStyle}
                                                onChange={(e) => setSelectedStyle(e.target.value)}
                                                className={`px-1 py-1 text-xs border ${borderClass} bg-transparent font-mono outline-none max-w-[100px] text-ellipsis overflow-hidden`}
                                            >
                                                {Object.entries(STYLE_PRESETS).map(([key, style]) => (
                                                    <option key={key} value={key}>
                                                        {style.label.split('(')[0].trim()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Tags Selector (For Turbo & Original) */}
                                {(selectedMode === 'turbo' || selectedMode === 'original') && PARALINGUISTIC_TAGS && (
                                    <>
                                        <div className={`h-6 w-[1px] ${borderClass}`}></div>
                                        <div className="flex items-center gap-2 group relative">
                                            <button className="px-2 py-1 text-[10px] font-mono border border-emerald-500/30 rounded bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 transition-colors flex items-center gap-1">
                                                <Sparkles size={8} /> TAGS
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

                                <div className={`h-6 w-[1px] ${borderClass} hidden md:block`}></div>

                                {/* Advanced Settings Toggle */}
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`px-2 py-1.5 rounded text-[10px] font-mono border ${borderClass} hover:bg-neutral-500/10 transition-colors flex items-center gap-1`}
                                    title={t.advancedSettings}
                                >
                                    <Settings size={12} /> <span className="hidden lg:inline">{t.advancedSettings}</span>
                                </button>

                                <div className={`h-6 w-[1px] ${borderClass}`}></div>

                                <button
                                    onClick={() => setTextInput('')}
                                    className="px-2 py-1.5 rounded opacity-40 hover:opacity-100 font-mono text-xs flex items-center gap-2 transition-opacity"
                                    title={t.clear}
                                >
                                    <RefreshCw size={12} />
                                </button>
                                <div className={`h-6 w-[1px] ${borderClass}`}></div>
                                <button
                                    onClick={handleQuickDemo}
                                    disabled={loading}
                                    className={`px-3 py-1.5 rounded border ${borderClass} font-bold text-[10px] uppercase flex items-center gap-1.5 hover:bg-neutral-500/5 transition-colors ${loading && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <Sparkles size={10} className="text-purple-500" />
                                    <span className="hidden sm:inline">{t.quickDemo}</span>
                                </button>
                                <button
                                    onClick={handleGenerateTTS}
                                    disabled={loading}
                                    className={`px-4 py-1.5 rounded font-bold text-[10px] uppercase flex items-center gap-1.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'} ${loading && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <Play size={10} fill="currentColor" />
                                    {t.generate}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 relative p-12 overflow-y-auto">
                            {/* Active Voice Spotlight (The "Foto" section) */}
                            {selectedVoice && !file && (
                                <div key={selectedVoice.name} className={`absolute top-12 right-12 animate-in fade-in slide-in-from-right-10 zoom-in-95 duration-700 ${loading ? 'z-50' : 'z-20'}`}>
                                    <div
                                        className={`p-6 rounded-[2rem] border ${borderClass} ${theme === 'light' ? 'bg-white/90 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.1)]' : 'bg-black/80 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.5)]'} backdrop-blur-xl flex flex-col items-center gap-4 w-52 transition-all duration-500 hover:-translate-y-2 group animate-float relative overflow-hidden`}
                                        style={{
                                            boxShadow: isPlaying
                                                ? `0px 20px 40px -10px ${theme === 'light' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)'}`
                                                : undefined
                                        }}
                                    >
                                        <div className="relative">
                                            {/* Ambient Glow that pulses with audio frequencies */}
                                            <div
                                                className={`absolute -inset-6 rounded-full blur-2xl transition-all duration-300 ${isPlaying ? 'bg-emerald-500 opacity-30 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'bg-purple-500 opacity-5'}`}
                                                style={{
                                                    transform: isPlaying ? `scale(${1 + (frequencyData.reduce((a, b) => a + b, 0) / 40) * 0.4})` : 'scale(1)'
                                                }}
                                            ></div>

                                            {/* Photo/Avatar Circle */}
                                            <button
                                                onClick={() => setShowVoiceModal(true)}
                                                className={`w-28 h-28 rounded-full flex items-center justify-center relative z-10 transition-all duration-700 overflow-hidden cursor-pointer ${isPlaying ? 'rotate-[10deg] scale-105' : 'hover:scale-105'} ${theme === 'light' ? 'bg-neutral-900 text-white' : 'bg-white text-black'} shadow-2xl group/btn`}
                                            >
                                                {/* Text Initial or Loading Spinner */}
                                                <div className={`text-4xl font-black transition-all duration-500 group-hover/btn:opacity-0 group-hover/btn:scale-50`}>
                                                    {loading ? <Loader2 size={32} className="animate-spin opacity-40" /> : selectedVoice.name.charAt(0).toUpperCase()}
                                                </div>

                                                {/* Search/Change Overlay on hover */}
                                                <div className={`absolute inset-0 flex items-center justify-center bg-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity backdrop-blur-sm z-20 text-white rounded-full`}>
                                                    <Search size={32} />
                                                </div>

                                                {/* Progress Ring during playback */}
                                                {isPlaying && (
                                                    <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin duration-[3s]" />
                                                )}
                                            </button>

                                            {/* Floating mini action buttons below avatar but inside the "box" */}
                                            {!loading && (
                                                <div className="absolute -bottom-2 inset-x-0 flex justify-center gap-4 z-30 animate-in slide-in-from-bottom-4 transition-transform duration-300">
                                                    {audioUrl && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (audioRef.current) {
                                                                    if (isPlaying) audioRef.current.pause();
                                                                    else audioRef.current.play();
                                                                }
                                                            }}
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl border ${borderClass} ${isPlaying ? 'bg-emerald-500 text-white border-emerald-400' : (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')}`}
                                                        >
                                                            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                                        </button>
                                                    )}
                                                    {audioUrl && (
                                                        <a
                                                            href={audioUrl}
                                                            download="synthesis.wav"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl border ${borderClass} ${theme === 'light' ? 'bg-white text-black border-neutral-200' : 'bg-black text-white border-neutral-800'}`}
                                                            title={t.download}
                                                        >
                                                            <Download size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-center relative z-10 pt-2">
                                            <div className="text-sm font-black uppercase tracking-[0.2em] mb-1">{selectedVoice.name}</div>
                                            <div className="flex items-center justify-center gap-2">
                                                {loading ? (
                                                    <span className="text-[9px] font-mono text-emerald-500 animate-pulse uppercase tracking-widest">{t.synthesizing}</span>
                                                ) : (
                                                    <>
                                                        <span className="text-[9px] font-mono opacity-40 uppercase">{selectedVoice.gender}</span>
                                                        <div className="w-1 h-1 rounded-full bg-neutral-500/20"></div>
                                                        <span className="text-[9px] font-mono opacity-40 uppercase">{selectedVoice.region}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dynamic EQ Visualization inside the card */}
                                        <div className="w-full flex justify-center items-end gap-1 h-6">
                                            {frequencyData.slice(0, 12).map((val, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1 rounded-full transition-all duration-150 ${isPlaying ? 'bg-emerald-500' : 'bg-neutral-500/20'}`}
                                                    style={{
                                                        height: isPlaying ? `${15 + val * 85}%` : '15%',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {showAdvanced && (
                                        <div className={`mt-4 p-6 rounded-[2rem] border ${theme === 'light' ? 'bg-white border-neutral-100 shadow-[0_8px_20px_rgb(0,0,0,0.04)]' : 'bg-[#0a0a0a] border-white/10 shadow-xl'} w-52 animate-in fade-in slide-in-from-top-8 zoom-in-90 duration-500 ease-out space-y-5`}>
                                            <div className="flex items-center gap-2 mb-2 px-1 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                                                <Settings size={14} className="text-emerald-500 animate-spin-slow" />
                                                <span className="font-mono text-[10px] font-bold tracking-widest uppercase opacity-60">Control Panel</span>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Temperature */}
                                                <div className="group/set animate-in fade-in slide-in-from-top-2 duration-500 delay-200">
                                                    <div className="flex justify-between items-center mb-1.5 px-1 text-purple-500">
                                                        <label className="text-[9px] font-black tracking-tighter opacity-40 uppercase group-hover/set:opacity-100 transition-opacity text-current">{t.temperature}</label>
                                                        <span className="text-[10px] font-mono font-bold">{temperature.toFixed(1)}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0.1" max="1.5" step="0.1" value={temperature}
                                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                                        style={{
                                                            background: `linear-gradient(to right, #a855f7 ${((temperature - 0.1) / (1.5 - 0.1)) * 100}%, ${theme === 'light' ? '#e5e5e5' : '#262626'} ${((temperature - 0.1) / (1.5 - 0.1)) * 100}%)`
                                                        }}
                                                        className="w-full h-1 rounded-full appearance-none cursor-pointer transition-all group-hover/set:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                                                    />
                                                </div>

                                                {/* Exaggeration */}
                                                <div className="group/set animate-in fade-in slide-in-from-top-2 duration-500 delay-300">
                                                    <div className="flex justify-between items-center mb-1.5 px-1 text-blue-500">
                                                        <label className="text-[9px] font-black tracking-tighter opacity-40 uppercase group-hover/set:opacity-100 transition-opacity text-current">{t.exaggeration}</label>
                                                        <span className="text-[10px] font-mono font-bold">{exaggeration.toFixed(1)}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0.0" max="2.0" step="0.1" value={exaggeration}
                                                        onChange={(e) => setExaggeration(parseFloat(e.target.value))}
                                                        style={{
                                                            background: `linear-gradient(to right, #3b82f6 ${(exaggeration / 2.0) * 100}%, ${theme === 'light' ? '#e5e5e5' : '#262626'} ${(exaggeration / 2.0) * 100}%)`
                                                        }}
                                                        className="w-full h-1 rounded-full appearance-none cursor-pointer transition-all group-hover/set:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                                                    />
                                                </div>

                                                {/* CFG */}
                                                <div className="group/set animate-in fade-in slide-in-from-top-2 duration-500 delay-400">
                                                    <div className="flex justify-between items-center mb-1.5 px-1 text-emerald-500">
                                                        <label className="text-[9px] font-black tracking-tighter opacity-40 uppercase group-hover/set:opacity-100 transition-opacity text-current">CFG</label>
                                                        <span className="text-[10px] font-mono font-bold">{cfg.toFixed(1)}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0.1" max="1.0" step="0.1" value={cfg}
                                                        onChange={(e) => setCfg(parseFloat(e.target.value))}
                                                        style={{
                                                            background: `linear-gradient(to right, #10b981 ${((cfg - 0.1) / (1.0 - 0.1)) * 100}%, ${theme === 'light' ? '#e5e5e5' : '#262626'} ${((cfg - 0.1) / (1.0 - 0.1)) * 100}%)`
                                                        }}
                                                        className="w-full h-1 rounded-full appearance-none cursor-pointer transition-all group-hover/set:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                                                    />
                                                </div>

                                                {/* Ambience Selector - Premium style */}
                                                <div className="pt-2 animate-in fade-in slide-in-from-top-4 duration-500 delay-500">
                                                    <label className="text-[9px] font-black tracking-tighter opacity-40 uppercase block mb-2 px-1">Ambience</label>
                                                    <div className="relative group/sel">
                                                        <select
                                                            value={ambienceId}
                                                            onChange={(e) => setAmbienceId(e.target.value)}
                                                            className={`w-full p-2.5 pr-8 text-[10px] font-mono rounded-xl border ${borderClass} bg-neutral-500/5 hover:bg-neutral-500/10 outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer`}
                                                        >
                                                            {AMBIENCE_OPTIONS.map(opt => (
                                                                <option key={opt.id} value={opt.id} className={theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black text-xs'}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover/sel:opacity-100 transition-opacity">
                                                            <Waves size={10} className={ambienceId ? "text-emerald-500" : ""} />
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                                                        <button
                                                            onClick={insertAmbienceTag}
                                                            disabled={!ambienceId}
                                                            className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all shadow-lg group/btn ${!ambienceId
                                                                ? 'bg-neutral-500/10 border-transparent text-neutral-400 opacity-50 cursor-not-allowed'
                                                                : ambienceId === 'custom'
                                                                    ? 'bg-orange-500 border-orange-600 text-white shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                                                                    : 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                                                                }`}
                                                        >
                                                            <div className={`p-1 rounded-full ${!ambienceId ? 'bg-neutral-500/20' : 'bg-white/20'}`}>
                                                                <PlusCircle size={10} strokeWidth={3} />
                                                            </div>
                                                            <div className="flex flex-col items-start leading-none">
                                                                <span className="text-[9px] font-black uppercase tracking-widest">INSERTAR TAG</span>
                                                                {ambienceId && (
                                                                    <span className="text-[8px] font-mono opacity-80">
                                                                        {`[${ambienceId}]`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}


                            {/* Highlighter & Textarea Container */}
                            <div className="relative w-full h-full group">
                                {/* Text Highlighter Overlay (Backdrop) */}
                                <div
                                    ref={highlighterRef}
                                    className={`absolute inset-0 whitespace-pre-wrap break-words text-lg leading-relaxed font-light font-sans pointer-events-none overflow-hidden ${selectedVoice && !file ? 'pr-[22rem]' : 'pr-12'}`}
                                    aria-hidden="true"
                                >
                                    {highlightText(textInput)}
                                </div>

                                {/* Transparent Textarea */}
                                <textarea
                                    ref={textareaRef}
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onScroll={handleScroll}
                                    className={`w-full h-full resize-none text-lg leading-relaxed font-light outline-none bg-transparent text-transparent caret-neutral-900 dark:caret-white ${selectedVoice && !file ? 'pr-[22rem]' : 'pr-12'}`}
                                    placeholder=""
                                    autoFocus
                                    spellCheck={false}
                                />
                            </div>

                            <div className={`absolute bottom-6 font-mono text-xs opacity-40 select-none pointer-events-none transition-all ${selectedVoice && !file ? 'right-[23rem]' : 'right-6'}`}>
                                {textInput.length} {t.chars}
                            </div>

                            {error && (
                                <div className="absolute bottom-20 left-8 right-8 p-4 bg-red-500 text-white rounded-lg text-sm font-mono flex items-center gap-3 shadow-lg animate-in slide-in-from-bottom-2">
                                    <X size={16} className="cursor-pointer" onClick={() => setError(null)} />
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Hidden Audio Element */}
                        {audioUrl && (
                            <audio
                                ref={audioRef}
                                src={audioUrl}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => setIsPlaying(false)}
                                className="hidden"
                            />
                        )}
                    </div>

                    {/* Right Panel: Usage Guide & Suggestions */}
                    <div className={`w-80 border-l ${borderClass} bg-opacity-10 flex flex-col hidden xl:flex`}>
                        <div className={`h-16 border-b ${borderClass} flex items-center px-6`}>
                            <span className="font-mono text-xs font-bold tracking-wider">GUÍA RÁPIDA</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10 flex flex-col min-h-0">
                            <div className="space-y-4">
                                <div className="text-[10px] font-mono font-black uppercase text-emerald-500 tracking-[0.2em] flex items-center gap-2">
                                    <Info size={12} /> 01. Emociones
                                </div>
                                <p className="text-[11px] leading-relaxed opacity-60 font-medium italic">
                                    "Prueba usar tags como [laugh], [sigh] o [whisper] para que la IA actúe de forma más humana."
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] font-mono font-black uppercase text-purple-500 tracking-[0.2em]">02. Puntuación</div>
                                <p className="text-[11px] leading-relaxed opacity-60 font-medium italic">
                                    "El uso excesivo de elipsis (...) genera pausas más naturales y dubitativas en el modelo Turbo."
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] font-mono font-black uppercase text-blue-500 tracking-[0.2em]">03. Clonación</div>
                                <p className="text-[11px] leading-relaxed opacity-60 font-medium italic">
                                    "Para mejores resultados al clonar, asegúrate de que el audio no tenga música de fondo ni ruidos."
                                </p>
                            </div>

                            <div className="space-y-6 cursor-help group/params" onClick={() => setShowAdvanced(!showAdvanced)}>
                                <div className="text-[10px] font-mono font-black uppercase text-orange-500 tracking-[0.2em] flex items-center gap-2 group-hover/params:translate-x-1 transition-transform">
                                    <Settings size={12} className={showAdvanced ? 'animate-spin-slow' : ''} /> 04. Parámetros
                                </div>
                                {!showAdvanced ? (
                                    <p className="text-[11px] leading-relaxed opacity-60 font-medium italic animate-in fade-in duration-500">
                                        "Configura los matices técnicos de la generación neuronal para ajustar la expresividad y precisión."
                                    </p>
                                ) : (
                                    <div className="space-y-4 opacity-70 animate-in slide-in-from-top-4 fade-in duration-500">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-purple-400">Temperatura</div>
                                            <p className="text-[10px] leading-relaxed italic">Define la aleatoriedad. +1.0 para mayor expresividad y locura; -1.0 para estabilidad quirúrgica.</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-blue-400">Exageración</div>
                                            <p className="text-[10px] leading-relaxed italic">Intensifica los rasgos únicos y la entonación de la identidad seleccionada.</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">CFG Scale</div>
                                            <p className="text-[10px] leading-relaxed italic">Fuerza a la IA a seguir el texto rigurosamente. Útil para tecnicismos o lecturas precisas.</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Ambience</div>
                                            <p className="text-[10px] leading-relaxed italic">Inyecta ruido de fondo atmosférico para situar la voz en un entorno real.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 animate-in fade-in duration-700 delay-300">
                                <div className="text-[10px] font-mono font-black uppercase text-emerald-500 tracking-[0.2em] flex items-center gap-2">
                                    <Waves size={12} /> 05. Ambientes Dinámicos
                                </div>
                                <p className="text-[11px] leading-relaxed opacity-60 font-medium italic">
                                    "Controla el entorno y su duración en tiempo real: <span className="text-emerald-500/80">[rain:10s]</span> Lluvia por 10s... <span className="text-orange-500/80">[ambience:truenos:2s]</span> ¡Boom!"
                                </p>
                            </div>

                            <div className="pt-8 mt-auto">
                                <div className={`p-6 rounded-[2rem] border border-dashed ${borderClass} bg-neutral-500/5`}>
                                    <div className="text-[10px] font-mono uppercase font-black mb-3 flex items-center gap-2 opacity-40">
                                        <Sparkles size={12} /> PRO TIP
                                    </div>
                                    <p className="text-[10px] leading-relaxed opacity-40">
                                        Hacer clic en la foto de la tarjeta circular te permite cambiar de voz sin perder tu progreso.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Voice Library Modal */}
            {
                showVoiceModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500"
                            onClick={() => setShowVoiceModal(false)}
                        />

                        {/* Modal Content */}
                        <div className={`relative w-full max-w-6xl h-full max-h-[90vh] rounded-[3.5rem] border ${borderClass} ${theme === 'light' ? 'bg-white/95' : 'bg-[#050505]/90'} backdrop-blur-3xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-500`}>
                            {/* Modal Header */}
                            <div className={`p-10 border-b ${borderClass} flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden`}>
                                {/* Decorative background for header */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-purple-500/10" />

                                <div className="space-y-2 relative z-10">
                                    <h2 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
                                        {t.voicesTitle}
                                        <div className="px-2 py-0.5 rounded bg-emerald-500 text-[10px] text-white font-mono vertical-middle">LIVE</div>
                                    </h2>
                                    <p className="text-xs font-mono opacity-40 uppercase tracking-widest max-w-md">Explora y selecciona tu próxima identidad neuronal de nuestra base de datos global.</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 relative z-10">
                                    {/* Search */}
                                    <div className="relative group w-full lg:w-72">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-emerald-500 transition-all" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Buscar voz o región..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${borderClass} bg-neutral-500/5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-mono text-sm uppercase tracking-tight`}
                                        />
                                    </div>

                                    {/* Filters */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative group">
                                            <select
                                                value={filterGender}
                                                onChange={(e) => setFilterGender(e.target.value)}
                                                className={`pl-10 pr-10 py-4 rounded-2xl border ${borderClass} bg-neutral-500/5 outline-none font-mono text-[10px] font-bold cursor-pointer hover:bg-neutral-500/10 transition-all appearance-none uppercase tracking-widest`}
                                            >
                                                <option value="all">TODOS LOS SEXOS</option>
                                                <option value="male">MASCULINO</option>
                                                <option value="female">FEMENINO</option>
                                            </select>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none group-hover:scale-110 transition-transform">
                                                <Filter size={14} />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <select
                                                value={filterLanguage}
                                                onChange={(e) => setFilterLanguage(e.target.value)}
                                                className={`pl-10 pr-10 py-4 rounded-2xl border ${borderClass} bg-neutral-500/5 outline-none font-mono text-[10px] font-bold cursor-pointer hover:bg-neutral-500/10 transition-all appearance-none uppercase tracking-widest`}
                                            >
                                                <option value="all">TODOS LOS IDIOMAS</option>
                                                {Array.from(new Set(availableVoices.map(v => v.language || v.region))).filter(Boolean).map(lang => (
                                                    <option key={lang} value={lang}>{lang?.toUpperCase()}</option>
                                                ))}
                                            </select>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none group-hover:scale-110 transition-transform">
                                                <Globe size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowVoiceModal(false)}
                                        className="p-4 rounded-full border border-neutral-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-lg hover:rotate-90"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body - Cloning & Voice Grid */}
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-neutral-500/5">
                                <div className="max-w-7xl mx-auto space-y-12">
                                    {/* Cloning Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                        <div className="lg:col-span-1 space-y-6 text-left">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                                                    <Mic size={20} className="text-emerald-500" />
                                                    Clonar Voz (Subir Audio)
                                                </h3>
                                                <p className="text-xs opacity-50 font-medium leading-relaxed">Sube una referencia de voz de alta calidad (mínimo 10 seg) para clonar tu propia identidad neuronal en tiempo real.</p>
                                            </div>

                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`p-10 border ${borderClass} border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-all group relative overflow-hidden ${file ? 'bg-emerald-500/10 border-emerald-500 shadow-2xl' : 'bg-neutral-500/5'}`}
                                            >
                                                {file ? (
                                                    <div className="text-center space-y-4">
                                                        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl ring-4 ring-emerald-500/20">
                                                            <Volume2 size={32} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-black text-emerald-600 truncate max-w-[200px]">{file.name}</div>
                                                            <div className="text-[10px] uppercase font-bold opacity-40">Archivo Detectado</div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setShowVoiceModal(false); }}
                                                            className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
                                                        >
                                                            Usar esta voz
                                                        </button>
                                                        <button onClick={clearFile} className="block w-full text-[9px] font-black text-red-500/50 hover:text-red-500 uppercase">Eliminar</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload size={32} className="opacity-20 group-hover:opacity-100 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-500" />
                                                        <span className="text-xs font-black opacity-30 group-hover:opacity-100 transition-opacity tracking-widest">ARRASTRA TU VOZ (.WAV)</span>
                                                    </>
                                                )}
                                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".wav" className="hidden" />
                                            </div>
                                        </div>

                                        <div className="lg:col-span-1 h-full flex flex-col text-left">
                                            <div className={`flex-1 p-8 rounded-[2.5rem] border border-dashed ${borderClass} opacity-40 flex flex-col justify-center items-start gap-4 hover:opacity-100 transition-opacity`}>
                                                <div className="flex items-center gap-2 text-emerald-500">
                                                    <Sparkles size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Pro Tip</span>
                                                </div>
                                                <p className="text-xs font-medium leading-relaxed italic">
                                                    "Selecciona una voz de la biblioteca haciendo clic en la foto circular para obtener los mejores resultados neuronales."
                                                </p>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-1 h-full flex flex-col justify-center gap-4 text-[11px] font-mono opacity-30 select-none">
                                            <div className="flex justify-between border-b border-neutral-500/10 pb-3"><span>FORMATO</span> <span>WAV / MP3</span></div>
                                            <div className="flex justify-between border-b border-neutral-500/10 pb-3"><span>DURACIÓN</span> <span>+10 SEG SUGERIDO</span></div>
                                            <div className="flex justify-between border-b border-neutral-500/10 pb-3"><span>CALIDAD</span> <span>44.1 KHZ / 16-BIT</span></div>
                                        </div>
                                    </div>

                                    <div className={`h-[1px] w-full ${borderClass} opacity-20`} />

                                    {/* Voices Grid Section */}
                                    <div className="space-y-8 text-left">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                                                <Users size={20} className="text-purple-500" />
                                                Voces Predefinidas
                                            </h3>
                                            <div className="text-[10px] font-mono opacity-40 uppercase">{availableVoices.length} Identidades Disponibles</div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {availableVoices
                                                .filter(v => {
                                                    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || (v.language && v.language.toLowerCase().includes(searchQuery.toLowerCase()));
                                                    const matchesGender = filterGender === "all" || v.gender?.toLowerCase() === filterGender;
                                                    const matchesLang = filterLanguage === "all" || (v.language || v.region) === filterLanguage;
                                                    return matchesSearch && matchesGender && matchesLang;
                                                })
                                                .map((voice) => (
                                                    <button
                                                        key={voice.name}
                                                        onClick={() => {
                                                            setSelectedVoice(voice);
                                                            setFile(null);
                                                            setShowVoiceModal(false);
                                                            if (voice.model === 'chatterbox-multilingual') {
                                                                setSelectedMode('multilingual');
                                                                if (voice.language && voice.language !== '?' && voice.language !== 'unknown') {
                                                                    setLanguageId(voice.language);
                                                                }
                                                            } else {
                                                                setSelectedMode('turbo');
                                                            }
                                                        }}
                                                        className={`p-8 rounded-[2.5rem] border text-left flex flex-col gap-6 transition-all duration-500 relative overflow-hidden group/vcard scale-up-center ${selectedVoice?.name === voice.name && !file
                                                            ? (theme === 'light' ? 'bg-white border-black shadow-2xl ring-4 ring-emerald-500/20 ring-offset-4 ring-offset-white' : 'bg-black border-white shadow-[0_0_40px_rgba(255,255,255,0.1)] ring-4 ring-emerald-500/20 ring-offset-4 ring-offset-black')
                                                            : `${borderClass} bg-neutral-500/5 hover:bg-emerald-500 hover:border-emerald-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]`
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center font-black text-2xl transition-all duration-500 group-hover/vcard:scale-110 group-hover/vcard:rotate-6 ${selectedVoice?.name === voice.name && !file
                                                                ? (theme === 'light' ? 'bg-black text-white' : 'bg-white text-black')
                                                                : 'bg-neutral-500/10 group-hover/vcard:bg-white group-hover/vcard:text-emerald-500'
                                                                }`}>
                                                                {voice.name.charAt(0).toUpperCase()}
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <div className={`font-black text-lg truncate flex items-center gap-2 tracking-tighter transition-colors ${selectedVoice?.name !== voice.name ? 'group-hover/vcard:text-white' : ''}`}>
                                                                    {voice.name}
                                                                    {selectedVoice?.name === voice.name && (
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                                                    )}
                                                                </div>
                                                                <div className={`text-[11px] font-mono uppercase mt-1 flex flex-wrap items-center gap-x-2 transition-opacity ${selectedVoice?.name !== voice.name ? 'opacity-40 group-hover/vcard:opacity-80 group-hover/vcard:text-white' : 'opacity-60'}`}>
                                                                    <span>{voice.gender || 'UNK'}</span>
                                                                    <span className="opacity-30">•</span>
                                                                    <span>{voice.language || 'STD'}</span>
                                                                    {voice.region && (
                                                                        <>
                                                                            <span className="opacity-30">•</span>
                                                                            <span className="flex items-center gap-1">
                                                                                <Globe size={10} />
                                                                                {voice.region}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className={`pt-4 border-t ${selectedVoice?.name === voice.name ? 'border-emerald-500/20' : 'border-neutral-500/10 group-hover/vcard:border-white/20'} flex justify-between items-center transition-all`}>
                                                            <span className={`text-[9px] font-mono uppercase tracking-widest ${selectedVoice?.name !== voice.name ? 'opacity-30 group-hover/vcard:opacity-100 group-hover/vcard:text-white' : 'opacity-60'}`}>
                                                                {voice.model?.split('-')[1]?.toUpperCase() || 'NEURAL'}
                                                            </span>
                                                            {selectedVoice?.name === voice.name && <Waves size={14} className="text-emerald-500 animate-pulse" />}
                                                            {selectedVoice?.name !== voice.name && <ArrowRight size={14} className="opacity-0 group-hover/vcard:opacity-100 group-hover/vcard:text-white group-hover/vcard:translate-x-1 transition-all" />}
                                                        </div>

                                                        {/* Selection Pill */}
                                                        {selectedVoice?.name === voice.name && !file && (
                                                            <div className="absolute top-0 right-0 px-5 py-2 rounded-bl-[2rem] bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                                SELECTED
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
