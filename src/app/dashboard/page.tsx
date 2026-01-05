'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Waves, Globe, LogOut, Mic, Users, Clock, Settings, TrendingUp, Zap, FileAudio } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const translations = {
    es: {
        statusOnline: 'ESTADO: EN LÍNEA',
        logout: 'SALIR',
        workspace: 'Espacio de Trabajo',
        home: 'Inicio',
        synthesis: 'Síntesis',
        voiceLab: 'Laboratorio de Voz',
        history: 'Historial',
        apiSettings: 'Configuración API',
        quickAccess: 'ACCESO RÁPIDO',
        recentActivity: 'Actividad Reciente',
        voicesSaved: 'Voces Guardadas',
        generationsToday: 'Generaciones Hoy',
        avgLatency: 'Latencia Promedio',
        startSynthesis: 'Iniciar Síntesis',
        manageVoices: 'Gestionar Voces',
        viewHistory: 'Ver Historial',
        recentGenerations: 'Generaciones Recientes',
        noActivity: 'No hay actividad reciente',
        systemStatus: 'Estado del Sistema',
        multilingualSupport: 'Soporte Multilingüe',
        availableModes: 'Modos Disponibles',
    },
    en: {
        statusOnline: 'STATUS: ONLINE',
        logout: 'LOGOUT',
        workspace: 'Workspace',
        home: 'Home',
        synthesis: 'Synthesis',
        voiceLab: 'Voice Lab',
        history: 'History',
        apiSettings: 'API Settings',
        quickAccess: 'QUICK ACCESS',
        recentActivity: 'Recent Activity',
        voicesSaved: 'Voices Saved',
        generationsToday: 'Generations Today',
        avgLatency: 'Avg Latency',
        startSynthesis: 'Start Synthesis',
        manageVoices: 'Manage Voices',
        viewHistory: 'View History',
        recentGenerations: 'Recent Generations',
        noActivity: 'No recent activity',
        systemStatus: 'System Status',
        multilingualSupport: 'Multilingual Support',
        availableModes: 'Available Modes',
    }
};

// Helper for Sidebar icons
const UsersIcon = ({ size, ...props }: any) => (
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

import DashboardSidebar from '../../components/DashboardSidebar';

export default function DashboardHome() {
    const router = useRouter();
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState<'es' | 'en'>('es');

    // Data States
    const [stats, setStats] = useState({
        voicesCount: 0,
        generationsToday: 0,
        totalGenerations: 0,
        latency: 'N/A' // No data available yet
    });
    const [recentHistory, setRecentHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [systemInfo, setSystemInfo] = useState<{
        status: string;
        multilingual_support: string;
        available_modes: string[];
    } | null>(null);

    const t = translations[lang];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const storedAuth = localStorage.getItem('voice_auth');
            if (!storedAuth) {
                router.push('/');
                return;
            }
            const authHeader = { 'Authorization': 'Basic ' + storedAuth };
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            // 0. Fetch System Info
            try {
                const systemRes = await fetch(`${apiUrl}/`, { headers: authHeader });
                if (systemRes.ok) {
                    const systemData = await systemRes.json();
                    setSystemInfo(systemData);
                }
            } catch (e) {
                console.error("Error fetching system info:", e);
            }

            // 1. Fetch Voices Count
            const voicesRes = await fetch(`${apiUrl}/voices`, { headers: authHeader });
            const voicesData = await voicesRes.json();
            const voicesCount = voicesData.voices ? voicesData.voices.length : 0;

            // 2. Fetch History for Stats & Recent Activity
            const historyRes = await fetch(`${apiUrl}/history`, { headers: authHeader });
            const historyData = await historyRes.json();

            // Process History Data
            const today = new Date().toISOString().split('T')[0];
            const todayCount = historyData.filter((item: any) => item.timestamp.startsWith(today)).length;

            // Sort by newest first and take top 5
            const sortedHistory = historyData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            setStats({
                voicesCount,
                generationsToday: todayCount,
                totalGenerations: historyData.length,
                latency: '45ms' // Simulated for now
            });
            setRecentHistory(sortedHistory.slice(0, 5));

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleLang = () => {
        setLang(prev => prev === 'es' ? 'en' : 'es');
    };

    const handleLogout = () => {
        router.push('/');
    };

    const themeClasses = theme === 'light'
        ? 'bg-[#f0f0f0] text-neutral-900'
        : 'bg-[#0a0a0a] text-neutral-100';

    const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';
    const cardClasses = theme === 'light'
        ? 'bg-white border-neutral-200'
        : 'bg-[#111] border-neutral-800';

    const StatCard = ({ icon: Icon, label, value, color }: any) => (
        <div className={`p-6 border ${cardClasses} hover:border-${color}-500 transition-all`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                    <Icon size={20} className={`text-${color}-500`} />
                </div>
                <TrendingUp size={16} className="opacity-40" />
            </div>
            <div className="text-3xl font-bold mb-1">{loading ? '-' : value}</div>
            <div className="text-xs font-mono opacity-60 uppercase">{label}</div>
        </div>
    );

    const QuickActionCard = ({ icon: Icon, title, description, href, color }: any) => (
        <Link
            href={href}
            className={`group p-8 border ${cardClasses} hover:border-${color}-500 transition-all cursor-pointer`}
        >
            <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className={`text-${color}-500`} />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-60">{description}</p>
        </Link>
    );

    return (
        <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans ${themeClasses} flex flex-col overflow-x-hidden`}>

            {/* Navigation Bar */}
            <nav className={`fixed top-0 left-0 w-full z-50 border-b ${borderClass} backdrop-blur-md bg-opacity-80 ${theme === 'light' ? 'bg-[#f0f0f0]/80' : 'bg-[#0a0a0a]/80'}`}>
                <div className="w-full px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className={`w-8 h-8 flex items-center justify-center border ${borderClass} rounded-full`}>
                            <Waves size={16} />
                        </div>
                        <span>AURA_VOICE</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="font-mono text-xs opacity-60 hidden md:inline">{t.statusOnline}</span>
                        <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'} hidden md:block`}></div>
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center text-xs font-bold`}>
                                U
                            </div>
                            <span className="text-xs font-bold hidden md:inline">USER_01</span>
                        </div>

                        <button
                            onClick={toggleLang}
                            className={`p-2 rounded-full border ${borderClass} hover:scale-105 transition-transform flex items-center gap-1`}
                        >
                            <Globe size={16} />
                            <span className="text-xs font-bold">{lang.toUpperCase()}</span>
                        </button>

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full border ${borderClass} hover:scale-105 transition-transform`}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

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

            {/* Main Layout */}
            <div className="flex-grow pt-20 flex h-[calc(100vh-80px)] overflow-hidden">

                <DashboardSidebar
                    theme={theme}
                    currentPath="/dashboard"
                    translations={t}
                />

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold tracking-tight mb-2">{t.quickAccess}</h1>
                            <p className="text-sm opacity-60">{t.recentActivity}</p>
                        </div>

                        {/* System Status */}
                        {systemInfo && (
                            <div className={`mb-8 p-6 border ${cardClasses} rounded-xl`}>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Zap className="text-emerald-500" size={20} />
                                    {t.systemStatus}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <div>
                                            <div className="font-mono text-sm opacity-60">{t.systemStatus}</div>
                                            <div className="font-bold">{systemInfo.status}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <div>
                                            <div className="font-mono text-sm opacity-60">{t.multilingualSupport}</div>
                                            <div className="font-bold">{systemInfo.multilingual_support}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                        <div>
                                            <div className="font-mono text-sm opacity-60">{t.availableModes}</div>
                                            <div className="font-bold">{systemInfo.available_modes.join(', ')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <StatCard icon={FileAudio} label={t.voicesSaved} value={stats.voicesCount} color="emerald" />
                            <StatCard icon={Zap} label={t.generationsToday} value={stats.generationsToday} color="blue" />
                            <StatCard icon={Clock} label={t.avgLatency} value={stats.latency} color="purple" />
                            <StatCard icon={TrendingUp} label="Total Gens" value={stats.totalGenerations} color="orange" />
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">{t.quickAccess}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <QuickActionCard
                                    icon={Mic}
                                    title={t.startSynthesis}
                                    description="Genera audio con voces personalizadas"
                                    href="/dashboard/synthesis"
                                    color="emerald"
                                />
                                <QuickActionCard
                                    icon={UsersIcon}
                                    title={t.manageVoices}
                                    description="Sube y administra tus voces clonadas"
                                    href="/dashboard/voices"
                                    color="blue"
                                />
                                <QuickActionCard
                                    icon={Clock}
                                    title={t.viewHistory}
                                    description="Revisa y descarga generaciones anteriores"
                                    href="/dashboard/history"
                                    color="purple"
                                />
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{t.recentGenerations}</h2>
                            <div className={`border ${cardClasses} rounded-xl overflow-hidden`}>
                                {loading ? (
                                    <div className="p-8 text-center opacity-40">Loading...</div>
                                ) : recentHistory.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Clock size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="opacity-60">{t.noActivity}</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <tbody>
                                            {recentHistory.map((item, i) => (
                                                <tr key={i} className={`border-b ${borderClass} last:border-0 hover:bg-neutral-500/5`}>
                                                    <td className="p-4 truncate max-w-xs font-mono text-sm">{item.text}</td>
                                                    <td className="p-4 text-xs opacity-60">{item.voice_used}</td>
                                                    <td className="p-4 text-right text-xs opacity-40">{new Date(item.timestamp).toLocaleTimeString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
