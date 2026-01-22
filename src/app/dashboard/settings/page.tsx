'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Waves, Globe, LogOut, Mic, Users, Clock, Settings, ShieldCheck, Database, Key, Info, X, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../../components/DashboardSidebar';
import { userService, voiceService } from '@/lib/services/resources';
import { User, Voice } from '@/types';

const translations = {
    es: {
        statusOnline: 'ESTADO: EN LÍNEA',
        workspace: 'Espacio de Trabajo',
        home: 'Inicio',
        synthesis: 'Síntesis',
        voiceLab: 'Laboratorio de Voz',
        history: 'Historial',
        apiSettings: 'Configuración API',
        generalSettings: 'Configuración General',
        security: 'Seguridad',
        connected: 'CONECTADO',
        endpoint: 'Endpoint',
        version: 'Versión',
        account: 'Cuenta',
        apiKey: 'Tu API Key',
        generateKeySymbol: 'Generar Nueva Key',
        copy: 'Copiar',
        copied: 'Copiado!',
        apiKeyWarning: 'Mantén esta llave en secreto. Si la regeneras, la anterior dejará de funcionar.',
        howToUse: '¿Cómo usar?',
        apiDocumentation: 'Documentación de la API',
        openaiStyle: 'Endpoint Estilo OpenAI',
        openaiStyleDesc: 'Este es el más potente y el que deberías usar si quieres compatibilidad con apps de IA.',
        quickResponse: 'Endpoint "Quick Response"',
        quickResponseDesc: 'Ideal para scripts rápidos donde solo quieres el texto de vuelta.',
        howToTest: '¿Cómo probarlo?',
        fullChat: 'El Chat completo',
        quickResp: 'La respuesta rápida',
        streaming: 'Streaming (verás las palabras aparecer una a una)',
        mcpManagement: 'Gestión de MCP (Poderes de la IA)',
        mcpDesc: 'Usa estos endpoints para conectar tu IA con herramientas externas.',
        addMcp: 'Añadir un servidor MCP',
        listMcp: 'Listar servidores activos',
        mcpTest: 'Conecta un MCP de prueba (Fetch web)',
    },
    en: {
        statusOnline: 'STATUS: ONLINE',
        workspace: 'Workspace',
        home: 'Home',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        generalSettings: 'General Settings',
        security: 'Security',
        connected: 'CONNECTED',
        endpoint: 'Endpoint',
        version: 'Version',
        account: 'Account',
        apiKey: 'Your API Key',
        generateKeySymbol: 'Generate New Key',
        copy: 'Copy',
        copied: 'Copied!',
        apiKeyWarning: 'Keep this key secret. If you regenerate it, the previous one will stop working.',
        howToUse: 'How to use?',
        apiDocumentation: 'API Documentation',
        openaiStyle: 'OpenAI Style Endpoint',
        openaiStyleDesc: 'This is the most powerful one and the one you should use if you want compatibility with AI apps.',
        quickResponse: 'Quick Response Endpoint',
        quickResponseDesc: 'Ideal for quick scripts where you just want the text back.',
        howToTest: 'How to test it?',
        fullChat: 'Full Chat',
        quickResp: 'Quick Response',
        streaming: 'Streaming (you will see words appearing one by one)',
        mcpManagement: 'MCP Management (AI Powers)',
        mcpDesc: 'Use these endpoints to connect your AI with external tools.',
        addMcp: 'Add an MCP server',
        listMcp: 'List active servers',
        mcpTest: 'Connect a test MCP (Web fetch)',
    }
};

export default function SettingsPage() {
    const router = useRouter(); // Use router
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [user, setUser] = useState<User | null>(null);
    const [voices, setVoices] = useState<Voice[]>([]);
    const [updating, setUpdating] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const t = translations[lang];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, voicesData] = await Promise.all([
                    userService.getMe(),
                    voiceService.getAll()
                ]);
                setUser(userData);
                setVoices(voicesData || []);
                if (userData.api_key) setApiKey(userData.api_key);
            } catch (error) {
                console.error("Error fetching settings data", error);
            }
        };
        fetchData();
    }, []);

    const handleUpdateVoice = async (voiceId: string) => {
        setUpdating(true);
        try {
            await userService.updateSettings({ default_voice_id: voiceId });
            setUser(prev => prev ? { ...prev, default_voice_id: voiceId } : null);
        } catch (error) {
            console.error("Error updating voice", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('voice_token');
        localStorage.removeItem('voice_user_id');
        router.push('/');
    };

    const handleGenerateApiKey = async () => {
        setIsGeneratingKey(true);
        try {
            const res = await userService.createApiKey();
            setApiKey(res.api_key);
        } catch (error) {
            console.error("Error generating API Key", error);
        } finally {
            setIsGeneratingKey(false);
        }
    };

    const handleCopyKey = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const themeClasses = theme === 'light' ? 'bg-[#f0f0f0] text-neutral-900' : 'bg-[#0a0a0a] text-neutral-100';
    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';

    return (
        <div className={`min-h-screen font-sans ${themeClasses} flex flex-col`}>
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
                    currentPath="/dashboard/settings"
                    translations={t}
                />

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3"><Settings className="opacity-50" /> {t.apiSettings}</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* API Status Card */}
                            <div className={`p-8 border ${borderClass} rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-[#111]'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500`}>
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">API Status</h3>
                                        <div className="text-xs font-mono text-emerald-500 font-bold tracking-wider">CONECTADO</div>
                                    </div>
                                </div>
                                <div className="space-y-2 font-mono text-xs opacity-60">
                                    <div className="flex justify-between">
                                        <span>Endpoint:</span>
                                        <span>{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Versión:</span>
                                        <span>v1.0.0</span>
                                    </div>
                                </div>
                            </div>

                            {/* User Account Card */}
                            <div className={`p-8 border ${borderClass} rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-[#111]'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500`}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{t.account}</h3>
                                        <div className="text-xs font-mono opacity-60 uppercase">{user?.role || '...'}</div>
                                    </div>
                                </div>
                                <div className="space-y-4 font-mono text-xs opacity-60">
                                    <div className="flex justify-between border-b pb-2 border-inherit">
                                        <span>User:</span>
                                        <span className="font-bold">{user?.username || '...'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2 border-inherit">
                                        <span>Email:</span>
                                        <span className="font-bold">{user?.email || '...'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2 border-inherit">
                                        <span>Role:</span>
                                        <span className="font-bold">{user?.role || '...'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Voice Preferences Card */}
                            <div className={`p-8 border ${borderClass} rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-[#111]'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500`}>
                                        <Mic size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Preferencias de Voz</h3>
                                        <div className="text-xs font-mono opacity-60 uppercase">Personalización</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Voz Predeterminada</label>
                                        <select
                                            value={user?.default_voice_id || ''}
                                            disabled={updating}
                                            onChange={(e) => handleUpdateVoice(e.target.value)}
                                            className={`w-full p-3 rounded-xl border text-sm outline-none transition-all ${theme === 'light' ? 'bg-[#f9f9f9] border-neutral-200 focus:border-black' : 'bg-black border-neutral-800 focus:border-white'} ${updating ? 'opacity-50' : ''}`}
                                        >
                                            <option value="">Selecciona una voz...</option>
                                            {voices.map(v => (
                                                <option key={v.name} value={v.name}>{v.name} ({v.language})</option>
                                            ))}
                                        </select>
                                        {updating && <span className="text-[10px] font-mono text-emerald-500 animate-pulse">Guardando...</span>}
                                    </div>
                                    <p className="text-[10px] opacity-40 leading-relaxed uppercase tracking-tighter">
                                        Esta voz se utilizará automáticamente en las nuevas sesiones de síntesis.
                                    </p>
                                </div>
                            </div>

                            {/* API Key Card */}
                            <div className={`p-8 border ${borderClass} rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-[#111]'} md:col-span-2`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500`}>
                                        <Key size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{t.apiKey}</h3>
                                        <div className="text-xs font-mono opacity-60 uppercase">Autenticación Externa</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleGenerateApiKey}
                                            disabled={isGeneratingKey}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${borderClass} ${theme === 'light' ? 'hover:bg-black hover:text-white' : 'hover:bg-white hover:text-black'} disabled:opacity-50`}
                                        >
                                            {isGeneratingKey ? '...' : t.generateKeySymbol}
                                        </button>
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className={`p-2 rounded-lg border ${borderClass} ${theme === 'light' ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800'} transition-all text-neutral-500`}
                                            title={t.howToUse}
                                        >
                                            <Info size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {apiKey ? (
                                        <div className="flex items-center gap-2">
                                            <div className={`flex-1 p-3 rounded-xl border font-mono text-sm overflow-x-auto whitespace-nowrap ${theme === 'light' ? 'bg-[#f9f9f9] border-neutral-200' : 'bg-black border-neutral-800'}`}>
                                                {apiKey}
                                            </div>
                                            <button
                                                onClick={handleCopyKey}
                                                className={`p-3 rounded-xl border ${borderClass} transition-all ${theme === 'light' ? 'hover:bg-neutral-100' : 'hover:bg-neutral-800'} text-xs font-bold min-w-[80px]`}
                                            >
                                                {isCopied ? t.copied : t.copy}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`p-8 border-2 border-dashed ${borderClass} rounded-xl flex flex-col items-center justify-center gap-3 opacity-40`}>
                                            <Key size={32} className="opacity-20" />
                                            <p className="text-xs font-mono uppercase tracking-widest text-center">No hay una API Key activa visible.<br />Haz clic en generar para obtener una.</p>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                        <div className="text-amber-500 mt-0.5"><ShieldCheck size={14} /></div>
                                        <p className="text-[10px] text-amber-500/80 font-medium leading-relaxed uppercase tracking-tighter">
                                            {t.apiKeyWarning}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documentation Modal */}
                        {showModal && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                                <div
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setShowModal(false)}
                                />
                                <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border ${borderClass} ${theme === 'light' ? 'bg-white' : 'bg-[#111]'} shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200`}>
                                    {/* Modal Header */}
                                    <div className={`p-6 border-b ${borderClass} flex items-center justify-between bg-opacity-50 backdrop-blur-md sticky top-0 z-10 ${theme === 'light' ? 'bg-white' : 'bg-[#111]'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                                <Info size={20} />
                                            </div>
                                            <h2 className="text-xl font-bold">{t.apiDocumentation}</h2>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className={`p-2 rounded-full hover:bg-neutral-500/10 transition-colors`}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                                        {/* Section 1: API Keys (Short) */}
                                        <section className="space-y-4">
                                            <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-[10px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                1. 🔑 {t.apiKey}
                                            </div>
                                            <div className={`p-3 rounded-lg font-mono text-xs ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                POST /users/me/api-key
                                            </div>
                                        </section>

                                        <hr className={borderClass} />

                                        {/* Section 2: OpenAI Style + MCP */}
                                        <section className="space-y-4">
                                            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-[10px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                2. 🤖 {t.openaiStyle}
                                            </div>
                                            <p className="text-sm opacity-60 leading-relaxed">
                                                {lang === 'es' ? 'Estos endpoints inyectan automáticamente todas las herramientas de tus servidores MCP activos.' : 'These endpoints automatically inject all tools from your active MCP servers.'}
                                            </p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 font-mono text-xs opacity-40">Endpoints:</div>
                                                <div className={`p-3 rounded-lg font-mono text-xs ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                    POST /completion <br />
                                                    POST /v1/chat/completions
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 font-mono text-xs opacity-40">Payload (Standard OpenAI):</div>
                                                <pre className={`p-4 rounded-lg font-mono text-xs overflow-x-auto ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                    {`{
  "messages": [
    {"role": "system", "content": "Eres un asistente con acceso a herramientas."},
    {"role": "user", "content": "Busca el archivo de ventas y resumelo."}
  ],
  "stream": false,
  "temperature": 0.7
}`}
                                                </pre>
                                            </div>
                                        </section>

                                        <hr className={borderClass} />

                                        {/* Section 3: MCP Management */}
                                        <section className="space-y-4">
                                            <div className="flex items-center gap-2 text-purple-500 font-bold uppercase tracking-widest text-[10px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                3. 🛠️ {t.mcpManagement}
                                            </div>
                                            <p className="text-sm opacity-60 leading-relaxed">
                                                {t.mcpDesc}
                                            </p>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 font-mono text-xs opacity-40">A. {t.addMcp}:</div>
                                                    <div className={`p-3 rounded-lg font-mono text-xs ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                        POST /mcp/servers
                                                    </div>
                                                    <pre className={`p-3 rounded-lg font-mono text-[10px] ${theme === 'light' ? 'bg-neutral-50' : 'bg-neutral-900'} border ${borderClass} opacity-70`}>
                                                        {`{
  "name": "sistema_archivos",
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@mcp/server-filesystem", "/path"]
}`}
                                                    </pre>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 font-mono text-xs opacity-40">B. {t.listMcp}:</div>
                                                    <div className={`p-3 rounded-lg font-mono text-xs ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                        GET /mcp/servers
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <hr className={borderClass} />

                                        {/* Section 4: Quick Response */}
                                        <section className="space-y-4">
                                            <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-[10px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                4. ⚡ {t.quickResponse}
                                            </div>
                                            <p className="text-sm opacity-60 leading-relaxed">
                                                {lang === 'es' ? 'Ideal si no te importa el formato OpenAI y solo quieres el texto.' : 'Ideal if you don\'t care about the OpenAI format and just want the text.'}
                                            </p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 font-mono text-xs opacity-40">Endpoint:</div>
                                                <div className={`p-3 rounded-lg font-mono text-xs ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                    POST /response?prompt=TU_PREGUNTA
                                                </div>
                                            </div>
                                        </section>

                                        <hr className={borderClass} />

                                        {/* Section 5: How to Test (CURL) */}
                                        <section className="space-y-4">
                                            <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-[10px]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                🚀 {t.howToTest}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold opacity-80">{t.fullChat}:</p>
                                                    <pre className={`p-4 rounded-lg font-mono text-[10px] overflow-x-auto ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                        {`curl http://localhost:8000/completion \\
  -H "Authorization: Bearer sk-aura-${apiKey || 'TU_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": "Hola"}]}'`}
                                                    </pre>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold opacity-80">{t.mcpTest}:</p>
                                                    <pre className={`p-4 rounded-lg font-mono text-[10px] overflow-x-auto ${theme === 'light' ? 'bg-neutral-100' : 'bg-black'} border ${borderClass}`}>
                                                        {`curl -X POST http://localhost:8000/mcp/servers \\
  -H "Authorization: Bearer sk-aura-${apiKey || 'TU_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "web",
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-fetch"]
  }'`}
                                                    </pre>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className={`p-6 border-t ${borderClass} flex justify-end gap-3 sticky bottom-0 z-10 ${theme === 'light' ? 'bg-white' : 'bg-[#111]'}`}>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className={`px-6 py-2.5 rounded-xl font-bold text-sm ${theme === 'light' ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'} transition-all`}
                                        >
                                            Entendido
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
