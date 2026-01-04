'use client';

import React, { useState, useRef } from 'react';
import { Moon, Sun, Mic, Play, Pause, Waves, X, User, Clock, Settings, Plus, Download, MoreHorizontal, Upload, CheckCircle2, Loader2, Globe, Sparkles, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Helper for Sidebar icons
const Users = ({ size, ...props }: any) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

// Translations
const translations = {
    es: {
        statusOnline: 'ESTADO: EN LÍNEA',
        logout: 'SALIR',
        workspace: 'Espacio de Trabajo',
        synthesis: 'Síntesis',
        voiceLab: 'Laboratorio de Voz',
        history: 'Historial',
        apiSettings: 'Configuración API',
        tokens: 'TOKENS',
        liveEditor: 'EDITOR EN VIVO',
        synthesizing: 'SINTETIZANDO...',
        uploadRef: 'SUBIR REF',
        audioLoaded: 'AUDIO_CARGADO',
        generate: 'Generar',
        typePlaceholder: 'Escribe algo para sintetizar...',
        chars: 'CARACTERES',
        voiceModel: 'Modelo de Voz',
        auraDefault: 'Aura (Predeterminado)',
        echoDeep: 'Echo (Profundo)',
        novaFast: 'Nova (Rápido)',
        speed: 'Velocidad',
        stability: 'Estabilidad',
        voiceSelection: 'Selección de Voz',
        cloneVoice: 'CLONAR VOZ',
        recentGenerations: 'Generaciones Recientes',
        generatedOutput: 'Salida Generada',
        errorMessage: 'Por favor proporciona texto y un audio de referencia.',
        quickDemo: 'Demo Rápido',
        quickDemoDesc: 'Prueba con voz femenina predeterminada',
        demoError: 'Error al generar demo',
    },
    en: {
        statusOnline: 'STATUS: ONLINE',
        logout: 'LOGOUT',
        workspace: 'Workspace',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        tokens: 'TOKENS',
        liveEditor: 'LIVE EDITOR',
        synthesizing: 'SYNTHESIZING...',
        uploadRef: 'UPLOAD REF',
        audioLoaded: 'AUDIO_LOADED',
        generate: 'Generate',
        typePlaceholder: 'Type something to synthesize...',
        chars: 'CHARS',
        voiceModel: 'Voice Model',
        auraDefault: 'Aura (Default)',
        echoDeep: 'Echo (Deep)',
        novaFast: 'Nova (Fast)',
        speed: 'Speed',
        stability: 'Stability',
        voiceSelection: 'Voice Selection',
        cloneVoice: 'CLONE VOICE',
        recentGenerations: 'Recent Generations',
        generatedOutput: 'Generated Output',
        errorMessage: 'Please provide both text and a reference audio clip.',
        quickDemo: 'Quick Demo',
        quickDemoDesc: 'Try with default female voice',
        demoError: 'Error generating demo',
    }
};

export default function Dashboard() {
    const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [dashboardView, setDashboardView] = useState('synthesis');

    // Dashboard specific states + Backend logic
    const [textInput, setTextInput] = useState("La arquitectura neuronal permite una síntesis de voz indistinguible de la realidad...");
    const [selectedVoice, setSelectedVoice] = useState('aura-1');

    // Backend TTS Logic
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOutputPlaying, setIsOutputPlaying] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const t = translations[lang];

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleLang = () => {
        setLang(prev => prev === 'es' ? 'en' : 'es');
    };

    const handleLogout = () => {
        router.push('/');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const generateTTS = async () => {
        if (!textInput || !file) {
            setError(t.errorMessage);
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        setError(null);
        setAudioUrl(null);

        const formData = new FormData();
        formData.append('text', textInput);
        formData.append('audio_prompt', file);

        try {
            const response = await fetch('http://localhost:8000/generate-tts', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate speech');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred during generation.');
            setTimeout(() => setError(null), 4000);
        } finally {
            setLoading(false);
        }
    };

    // Quick Demo with default female voice
    const generateQuickDemo = async () => {
        if (!textInput) {
            setError(lang === 'es' ? 'Por favor proporciona un texto.' : 'Please provide text.');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setLoading(true);
        setError(null);
        setAudioUrl(null);

        const formData = new FormData();
        formData.append('text', textInput);

        try {
            const credentials = btoa('admin:admin_password');

            const response = await fetch('http://localhost:8000/demo', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({ error: 'Failed to generate demo' }));
                throw new Error(errData.error || 'Failed to generate demo');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (err: any) {
            console.error(err);
            setError(err.message || t.demoError);
            setTimeout(() => setError(null), 4000);
        } finally {
            setLoading(false);
        }
    };

    // Base layout classes
    const themeClasses = theme === 'light'
        ? 'bg-[#f0f0f0] text-neutral-900 selection:bg-neutral-900 selection:text-white'
        : 'bg-[#0a0a0a] text-neutral-100 selection:bg-white selection:text-black';

    const cardClasses = theme === 'light'
        ? 'bg-white border-neutral-200 hover:border-neutral-400'
        : 'bg-[#111] border-neutral-800 hover:border-neutral-600';

    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';
    const textSubtle = theme === 'light' ? 'text-neutral-500' : 'text-neutral-500';
    const inputClasses = theme === 'light'
        ? 'bg-[#f8f8f8] border-neutral-300 focus:border-neutral-900 placeholder:text-neutral-400'
        : 'bg-[#1a1a1a] border-neutral-800 focus:border-white placeholder:text-neutral-600';

    const Visualizer = ({ playing, height = "h-12", barCount = 8 }: { playing: boolean, height?: string, barCount?: number }) => (
        <div className={`flex items-center justify-center gap-1 ${height}`}>
            {[...Array(barCount)].map((_, i) => (
                <div
                    key={i}
                    className={`w-1 md:w-1.5 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-neutral-900' : 'bg-white'}`}
                    style={{
                        height: playing ? `${Math.random() * 100}%` : '20%',
                        animation: playing ? `bounce 0.5s infinite ${i * 0.1}s` : 'none'
                    }}
                />
            ))}
        </div>
    );

    const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-4 transition-colors ${active ? (theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800') : 'hover:opacity-60'}`}
        >
            <Icon size={20} />
            <span className="font-mono text-xs tracking-wider uppercase hidden md:inline">{label}</span>
        </button>
    );

    const VoiceCard = ({ id, name, lang, active, onClick }: any) => (
        <div
            onClick={onClick}
            className={`p-4 border cursor-pointer transition-all ${active ? (theme === 'light' ? 'border-black bg-neutral-100' : 'border-white bg-neutral-900') : `${borderClass} opacity-60 hover:opacity-100`}`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${active ? (theme === 'light' ? 'bg-black text-white' : 'bg-white text-black') : 'bg-neutral-200 dark:bg-neutral-800'}`}>
                    {name.charAt(0)}
                </div>
                {active && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
            </div>
            <h4 className="font-bold text-sm">{name}</h4>
            <span className="text-xs font-mono opacity-60">{lang}</span>
        </div>
    );

    const HistoryItem = ({ title, date, duration }: any) => (
        <div className={`p-4 border-b ${borderClass} flex items-center justify-between group hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors`}>
            <div className="flex items-center gap-4">
                <button className={`w-8 h-8 rounded-full flex items-center justify-center border ${borderClass} hover:scale-105 transition-transform`}>
                    <Play size={12} fill="currentColor" />
                </button>
                <div>
                    <h5 className="text-sm font-bold">{title}</h5>
                    <span className="text-xs font-mono opacity-50">{date}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs font-mono opacity-50">{duration}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans ${themeClasses} flex flex-col overflow-x-hidden relative`}>

            {/* Navigation Bar - Fixed */}
            <nav className={`fixed top-0 left-0 w-full z-50 border-b ${borderClass} backdrop-blur-md bg-opacity-80 ${theme === 'light' ? 'bg-[#f0f0f0]/80' : 'bg-[#0a0a0a]/80'}`}>
                <div className="w-full px-6 h-20 flex items-center justify-between">

                    {/* Logo Area */}
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer">
                        <div className={`w-8 h-8 flex items-center justify-center border ${borderClass} rounded-full`}>
                            <Waves size={16} />
                        </div>
                        <span>AURA_VOICE</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-xs opacity-60 hidden md:inline">{t.statusOnline}</span>
                        <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'} hidden md:block`}></div>
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center text-xs font-bold`}>
                                U
                            </div>
                            <span className="text-xs font-bold hidden md:inline">USER_01</span>
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLang}
                            className={`p-2 rounded-full border ${borderClass} hover:scale-105 transition-transform flex items-center gap-1`}
                            title={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
                        >
                            <Globe size={16} />
                            <span className="text-xs font-bold">{lang.toUpperCase()}</span>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full border ${borderClass} hover:scale-105 transition-transform`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={`p-2 rounded-full border ${borderClass} hover:scale-105 transition-transform`}
                            title={t.logout}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* DASHBOARD VIEW */}
            <main className="flex-grow pt-20 flex h-[calc(100vh-80px)] overflow-hidden">

                {/* Sidebar */}
                <aside className={`w-20 md:w-64 border-r ${borderClass} flex flex-col justify-between bg-opacity-50`}>
                    <div>
                        <div className="p-6 hidden md:block">
                            <span className="text-xs font-mono opacity-40 uppercase">{t.workspace}</span>
                        </div>
                        <nav className="flex flex-col">
                            <SidebarItem
                                icon={Mic}
                                label={t.synthesis}
                                active={dashboardView === 'synthesis'}
                                onClick={() => setDashboardView('synthesis')}
                            />
                            <SidebarItem
                                icon={Users}
                                label={t.voiceLab}
                                active={dashboardView === 'voices'}
                                onClick={() => setDashboardView('voices')}
                            />
                            <SidebarItem
                                icon={Clock}
                                label={t.history}
                                active={dashboardView === 'history'}
                                onClick={() => setDashboardView('history')}
                            />
                            <SidebarItem
                                icon={Settings}
                                label={t.apiSettings}
                                active={dashboardView === 'settings'}
                                onClick={() => setDashboardView('settings')}
                            />
                        </nav>
                    </div>

                    <div className={`p-4 border-t ${borderClass}`}>
                        <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold">{t.tokens}</span>
                                <span className="text-xs font-mono opacity-60">84%</span>
                            </div>
                            <div className={`w-full h-1 rounded-full ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'}`}>
                                <div className="w-[84%] h-full rounded-full bg-emerald-500"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Work Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* Center Panel - Input & Controls */}
                    <div className="flex-1 flex flex-col relative">
                        {/* Header of Panel */}
                        <div className={`h-16 border-b ${borderClass} flex items-center justify-between px-6 bg-opacity-50`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-indigo-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
                                <span className="font-mono text-xs font-bold tracking-wider">{loading ? t.synthesizing : t.liveEditor}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-2 rounded border ${borderClass} hover:opacity-70 ${file ? 'border-emerald-500' : ''}`}
                                    title={file ? t.audioLoaded : t.uploadRef}
                                >
                                    {file ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Upload size={16} />}
                                </button>
                                <button
                                    onClick={generateQuickDemo}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded border ${borderClass} font-bold text-xs uppercase flex items-center gap-2 hover:opacity-70 ${loading ? 'opacity-50' : ''}`}
                                    title={t.quickDemoDesc}
                                >
                                    {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    {t.quickDemo}
                                </button>
                                <button
                                    onClick={generateTTS}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded font-bold text-xs uppercase flex items-center gap-2 ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'} ${loading ? 'opacity-50' : ''}`}
                                >
                                    {loading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
                                    {t.generate}
                                </button>
                            </div>
                        </div>

                        {/* Text Area */}
                        <div className="flex-1 relative">
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                className={`w-full h-full resize-none p-8 text-2xl md:text-3xl font-light outline-none bg-transparent ${theme === 'light' ? 'text-neutral-900 placeholder:text-neutral-300' : 'text-white placeholder:text-neutral-700'}`}
                                placeholder={t.typePlaceholder}
                            />

                            {/* Error Display */}
                            {error && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full">
                                    {error}
                                </div>
                            )}

                            {/* Audio Output */}
                            {audioUrl && (
                                <div className={`absolute bottom-6 left-6 right-6 p-4 border ${borderClass} rounded-2xl ${theme === 'light' ? 'bg-white/95' : 'bg-[#111]/95'} backdrop-blur-md shadow-2xl flex items-center gap-6`}>
                                    <button
                                        onClick={() => {
                                            if (audioRef.current) {
                                                if (isOutputPlaying) audioRef.current.pause();
                                                else audioRef.current.play();
                                            }
                                        }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isOutputPlaying ? 'bg-indigo-500 text-white' : (theme === 'light' ? 'bg-black text-white' : 'bg-white text-black')}`}
                                    >
                                        {isOutputPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">{t.generatedOutput}</span>
                                            <a href={audioUrl} download="aura-voice.wav" className="opacity-40 hover:opacity-100"><Download size={14} /></a>
                                        </div>
                                        <Visualizer playing={isOutputPlaying} height="h-6" barCount={20} />
                                        <audio
                                            ref={audioRef}
                                            src={audioUrl}
                                            onPlay={() => setIsOutputPlaying(true)}
                                            onPause={() => setIsOutputPlaying(false)}
                                            onEnded={() => setIsOutputPlaying(false)}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-6 right-6 font-mono text-xs opacity-40">
                                {textInput.length} {t.chars}
                            </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className={`h-24 border-t ${borderClass} flex items-center px-6 gap-6 overflow-x-auto`}>
                            <div className="flex flex-col gap-1 min-w-[120px]">
                                <span className="text-[10px] font-mono opacity-60 uppercase">{t.voiceModel}</span>
                                <select className={`bg-transparent font-bold outline-none cursor-pointer ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                                    <option>{t.auraDefault}</option>
                                    <option>{t.echoDeep}</option>
                                    <option>{t.novaFast}</option>
                                </select>
                            </div>
                            <div className={`w-[1px] h-10 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'}`}></div>
                            <div className="flex flex-col gap-1 min-w-[120px]">
                                <span className="text-[10px] font-mono opacity-60 uppercase">{t.speed}: 1.0x</span>
                                <input type="range" min="0.5" max="2" step="0.1" className="w-24 accent-current" />
                            </div>
                            <div className={`w-[1px] h-10 ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'}`}></div>
                            <div className="flex flex-col gap-1 min-w-[120px]">
                                <span className="text-[10px] font-mono opacity-60 uppercase">{t.stability}</span>
                                <input type="range" min="0" max="100" className="w-24 accent-current" />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Settings / Library */}
                    <div className={`w-80 border-l ${borderClass} bg-opacity-20 flex flex-col hidden xl:flex`}>
                        <div className={`p-4 border-b ${borderClass}`}>
                            <span className="font-mono text-xs tracking-widest uppercase opacity-60">{t.voiceSelection}</span>
                        </div>
                        <div className="p-4 grid gap-3 overflow-y-auto flex-1">
                            <VoiceCard id="v1" name="Aura" lang="English (US)" active={selectedVoice === 'aura-1'} onClick={() => setSelectedVoice('aura-1')} />
                            <VoiceCard id="v2" name="Echo" lang="English (UK)" active={selectedVoice === 'echo-1'} onClick={() => setSelectedVoice('echo-1')} />
                            <VoiceCard id="v3" name="Nova" lang="Spanish (MX)" active={selectedVoice === 'nova-1'} onClick={() => setSelectedVoice('nova-1')} />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`p-4 border border-dashed ${borderClass} flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 cursor-pointer transition-opacity`}
                            >
                                <Plus size={20} />
                                <span className="text-xs font-mono">{t.cloneVoice}</span>
                            </div>
                        </div>
                        <div className={`p-4 border-t ${borderClass} h-1/3 flex flex-col`}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-mono text-xs tracking-widest uppercase opacity-60">{t.recentGenerations}</span>
                                <MoreHorizontal size={16} className="opacity-40" />
                            </div>
                            <div className="flex-1 overflow-y-auto -mx-4">
                                <HistoryItem title="Project Alpha_v2" date="2m ago" duration="0:12" />
                                <HistoryItem title="Intro Sequence" date="1h ago" duration="0:45" />
                                <HistoryItem title="Marketing Copy" date="Yesterday" duration="1:20" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="audio/wav"
                    className="hidden"
                />
            </main>

            {/* Styles for bounce animation */}
            <style jsx global>{`
        @keyframes bounce {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
        </div>
    );
}
