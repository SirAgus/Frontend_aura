'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Waves, Globe, LogOut, Mic, Users, Clock, Settings, ShieldCheck, Database, Key } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../../components/DashboardSidebar';
import { userService, voiceService } from '@/lib/services/resources';
import { User } from '@/types';

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
    }
};

export default function SettingsPage() {
    const router = useRouter(); // Use router
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [user, setUser] = useState<User | null>(null);
    const [voices, setVoices] = useState<any[]>([]);
    const [updating, setUpdating] = useState(false);
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
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
