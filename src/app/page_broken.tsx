'use client';

import React, { useState, useRef } from 'react';
import { Moon, Sun, ArrowUpRight, Mic, Activity, Cpu, Languages, Play, Pause, Waves, X, Menu, User, Lock, Mail, ArrowRight, Save, Clock, Settings, Plus, Download, MoreHorizontal, Upload, CheckCircle2, Loader2, Globe, Sparkles } from 'lucide-react';
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
    demo: 'Demo',
    features: 'Características',
    api: 'API',
    signIn: 'Iniciar Sesión',
    getApiKey: 'Obtener API Key',
    statusOnline: 'ESTADO: EN LÍNEA',
    logout: 'SALIR',
    welcomeBack: 'BIENVENIDO',
    accessTerminal: 'ACCESO AL TERMINAL',
    signInDesc: 'Ingresa tus credenciales para acceder al núcleo neuronal.',
    signUpDesc: 'Inicializa tu espacio de trabajo y obtén tu API key.',
    fullName: 'Nombre Completo',
    email: 'correo@empresa.com',
    password: 'Contraseña',
    authenticate: 'Autenticar',
    initializeAccount: 'Inicializar Cuenta',
    createAccount: 'CREAR CUENTA',
    alreadyHaveAccount: '¿YA TIENES CUENTA?',
    version: 'V2.0 ESTABLE',
    latency: 'LATENCIA: 12ms',
    sonicPresence: 'PRESENCIA',
    engine: 'SÓNICA.',
    heroDesc: 'Síntesis neuronal hiper-realista. No distinguible de la voz humana. Diseñada para conversaciones infinitas.',
    voiceSample: 'MUESTRA DE VOZ: "AURA"',
    scrollToListen: 'DESPLAZA PARA ESCUCHAR',
    systemCapabilities: 'CAPACIDADES DEL SISTEMA',
    neuralArchitecture: '[ ARQUITECTURA NEURONAL ]',
    latencyFeature: '01 / LATENCIA',
    realtimeCore: 'Núcleo en Tiempo Real',
    realtimeDesc: 'Procesamiento en <50ms para conversaciones fluidas y sin interrupciones.',
    emotionFeature: '02 / EMOCIÓN',
    adaptiveTone: 'Tono Adaptativo',
    adaptiveToneDesc: 'La IA detecta el contexto y ajusta el tono: susurros, risas y pausas dramáticas.',
    globalFeature: '03 / GLOBAL',
    omniLingual: 'Omni-Lingual',
    omniLingualDesc: 'Soporte nativo para 40+ idiomas con preservación de acento y dialecto local.',
    startApiTrial: 'INICIAR PRUEBA API',
    getApiKeyCta: 'OBTENER API KEY →',
    architecture: 'Arquitectura',
    beyondText: 'MÁS ALLÁ DEL TEXTO.',
    waveformGeneration: 'Generación de Forma de Onda',
    waveformDesc: 'No concatenamos sílabas. Generamos ondas de audio completas pixel a pixel, logrando una textura orgánica.',
    contextAware: 'Consciente del Contexto',
    contextAwareDesc: 'El modelo entiende lo que lee. Sabe cuándo subir la entonación en una pregunta o suavizarla en una disculpa.',
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
    github: 'GITHUB',
    discord: 'DISCORD',
    status: 'ESTADO',
    footer: '© 2024 Aura Intelligence. Sistema operacional.',
  },
  en: {
    demo: 'Demo',
    features: 'Features',
    api: 'API',
    signIn: 'Sign In',
    getApiKey: 'Get API Key',
    statusOnline: 'STATUS: ONLINE',
    logout: 'LOGOUT',
    welcomeBack: 'WELCOME BACK',
    accessTerminal: 'ACCESS TERMINAL',
    signInDesc: 'Enter your credentials to access the neural core.',
    signUpDesc: 'Initialize your workspace and get your API key.',
    fullName: 'Full Name',
    email: 'name@company.com',
    password: 'Password',
    authenticate: 'Authenticate',
    initializeAccount: 'Initialize Account',
    createAccount: 'CREATE ACCOUNT',
    alreadyHaveAccount: 'ALREADY HAVE ACCOUNT?',
    version: 'V2.0 STABLE',
    latency: 'LATENCY: 12ms',
    sonicPresence: 'PRESENCE',
    engine: 'ENGINE.',
    heroDesc: 'Hyper-realistic neural synthesis. Indistinguishable from human voice. Designed for infinite conversations.',
    voiceSample: 'VOICE SAMPLE: "AURA"',
    scrollToListen: 'SCROLL TO LISTEN',
    systemCapabilities: 'SYSTEM CAPABILITIES',
    neuralArchitecture: '[ NEURAL ARCHITECTURE ]',
    latencyFeature: '01 / LATENCY',
    realtimeCore: 'Real-time Core',
    realtimeDesc: 'Processing in <50ms for fluid and uninterrupted conversations.',
    emotionFeature: '02 / EMOTION',
    adaptiveTone: 'Adaptive Tone',
    adaptiveToneDesc: 'AI detects context and adjusts tone: whispers, laughter, and dramatic pauses.',
    globalFeature: '03 / GLOBAL',
    omniLingual: 'Omni-Lingual',
    omniLingualDesc: 'Native support for 40+ languages with accent and local dialect preservation.',
    startApiTrial: 'START API TRIAL',
    getApiKeyCta: 'GET API KEY →',
    architecture: 'Architecture',
    beyondText: 'BEYOND TEXT.',
    waveformGeneration: 'Waveform Generation',
    waveformDesc: 'We don\'t concatenate syllables. We generate complete audio waves pixel by pixel, achieving organic texture.',
    contextAware: 'Context Aware',
    contextAwareDesc: 'The model understands what it reads. It knows when to raise intonation in a question or soften it in an apology.',
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
    github: 'GITHUB',
    discord: 'DISCORD',
    status: 'STATUS',
    footer: '© 2024 Aura Intelligence. System operational.',
  }
};

export default function App() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const t = translations[lang];

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es');
  };

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
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
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => !isLoggedIn && scrollTo('home')}>
            <div className={`w-8 h-8 flex items-center justify-center border ${borderClass} rounded-full`}>
              <Waves size={16} />
            </div>
            <span>AURA_VOICE</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {!isLoggedIn ? (
              <>
                {[t.demo, t.features, t.api].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollTo(item.toLowerCase())}
                    className="hover:opacity-50 transition-opacity uppercase"
                  >
                    {item}
                  </button>
                ))}

                <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'}`}></div>

                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signin'); }}
                  className="hover:opacity-50 transition-opacity uppercase"
                >
                  {t.signIn}
                </button>

                <button
                  onClick={() => { setShowAuth(true); setAuthMode('signup'); }}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all hover:scale-105 ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                  {t.getApiKey}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <span className="font-mono text-xs opacity-60">{t.statusOnline}</span>
                <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'}`}></div>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center text-xs font-bold`}>
                    U
                  </div>
                  <span className="text-xs font-bold">USER_01</span>
                </div>
                <button onClick={handleLogout} className="text-xs hover:underline opacity-60">{t.logout}</button>
              </div>
            )}

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
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLang} className={`p-2 rounded-full border ${borderClass}`}>
              <Globe size={16} />
            </button>
            <button onClick={toggleTheme} className={`p-2 rounded-full border ${borderClass}`}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal Overlay */}
      {showAuth && !isLoggedIn && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm bg-black/20 dark:bg-black/50">
          <div
            className="absolute inset-0"
            onClick={() => setShowAuth(false)}
          ></div>

          <div className={`relative w-full max-w-md p-8 md:p-12 shadow-2xl transition-all duration-300 ${theme === 'light' ? 'bg-white' : 'bg-[#111] border border-neutral-800'}`}>
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-6 right-6 opacity-50 hover:opacity-100"
            >
              <X size={20} />
            </button>

            <div className="mb-8">
              <div className={`w-10 h-10 flex items-center justify-center border ${borderClass} rounded-full mb-4`}>
                <Waves size={20} />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter mb-2">
                {authMode === 'signin' ? t.welcomeBack : t.accessTerminal}
              </h2>
              <p className={`text-sm ${textSubtle}`}>
                {authMode === 'signin' ? t.signInDesc : t.signUpDesc}
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              {authMode === 'signup' && (
                <div className="relative group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textSubtle}`} />
                  <input
                    type="text"
                    placeholder={t.fullName}
                    className={`w-full p-4 pl-12 text-sm outline-none transition-colors border ${inputClasses}`}
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textSubtle}`} />
                <input
                  type="email"
                  placeholder={t.email}
                  className={`w-full p-4 pl-12 text-sm outline-none transition-colors border ${inputClasses}`}
                />
              </div>

              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textSubtle}`} />
                <input
                  type="password"
                  placeholder={t.password}
                  className={`w-full p-4 pl-12 text-sm outline-none transition-colors border ${inputClasses}`}
                />
              </div>

              <button type="submit" className={`mt-4 py-4 px-6 w-full font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:opacity-90 ${theme === 'light' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                {authMode === 'signin' ? t.authenticate : t.initializeAccount}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 flex justify-between items-center text-xs font-mono">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="hover:underline opacity-60 hover:opacity-100"
              >
                {authMode === 'signin' ? t.createAccount : t.alreadyHaveAccount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Switcher */}
      {!isLoggedIn ? (
        // --- LANDING PAGE CONTENT ---
        <main className="flex-grow pt-20">

          {/* Hero Section */}
          <section id="home" className="min-h-[90vh] flex flex-col justify-center px-6 w-full relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl opacity-20 bg-emerald-500 animate-pulse"></div>
            <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 bg-blue-500 animate-pulse delay-700"></div>

            <div className="z-10 max-w-7xl mx-auto w-full">
              <div className="max-w-4xl relative">
                <div className="mb-6 flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono border ${borderClass}`}>{t.version}</span>
                  <span className="text-xs font-mono opacity-60">{t.latency}</span>
                </div>

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8">
                  SONIC<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-900 dark:from-neutral-400 dark:to-white">{t.sonicPresence}</span><br />
                  {t.engine}
                </h1>
                <p className={`text-xl md:text-2xl max-w-xl leading-relaxed mb-10 ${textSubtle}`}>
                  {t.heroDesc}
                </p>

                {/* Interactive Player Mockup */}
                <div className={`inline-flex items-center gap-6 p-2 pr-8 rounded-full border ${borderClass} ${theme === 'light' ? 'bg-white/50' : 'bg-black/50'} backdrop-blur-sm`}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-red-500 text-white' : (theme === 'light' ? 'bg-black text-white' : 'bg-white text-black')}`}
                  >
                    {isPlaying ? <div className="w-4 h-4 bg-white rounded-sm" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-mono opacity-60">{t.voiceSample}</span>
                    <Visualizer playing={isPlaying} />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-6 md:right-10 flex flex-col items-end gap-2 text-xs font-mono opacity-60 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => scrollTo('features')}>
                <span>{t.scrollToListen}</span>
                <div className={`w-[1px] h-24 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
              </div>
            </div>
          </section>

          {/* Features / Grid Section */}
          <section id="features" className={`py-24 px-6 border-t ${borderClass}`}>
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex justify-between items-end mb-16">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{t.systemCapabilities}</h2>
                <span className={`hidden md:block font-mono text-sm ${textSubtle}`}>{t.neuralArchitecture}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
                {/* Feature 1 */}
                <div className={`group relative aspect-[4/3] p-8 flex flex-col justify-between transition-all duration-300 ${cardClasses}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs">{t.latencyFeature}</span>
                    <Activity className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="relative z-10">
                    <div className="mb-4 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Cpu size={24} className="text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t.realtimeCore}</h3>
                    <p className={`text-sm ${textSubtle}`}>{t.realtimeDesc}</p>
                  </div>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                </div>

                {/* Feature 2 */}
                <div className={`group relative aspect-[4/3] p-8 flex flex-col justify-between transition-all duration-300 ${cardClasses}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs">{t.emotionFeature}</span>
                    <Activity className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="relative z-10">
                    <div className="mb-4 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Mic size={24} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t.adaptiveTone}</h3>
                    <p className={`text-sm ${textSubtle}`}>{t.adaptiveToneDesc}</p>
                  </div>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                </div>

                {/* Feature 3 */}
                <div className={`group relative aspect-[4/3] p-8 flex flex-col justify-between transition-all duration-300 ${cardClasses}`}>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs">{t.globalFeature}</span>
                    <Activity className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="relative z-10">
                    <div className="mb-4 w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Languages size={24} className="text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{t.omniLingual}</h3>
                    <p className={`text-sm ${textSubtle}`}>{t.omniLingualDesc}</p>
                  </div>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
                </div>

                {/* Feature 4 - CTA */}
                <div
                  onClick={() => { setShowAuth(true); setAuthMode('signup'); }}
                  className={`group relative aspect-[4/3] p-8 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-pointer ${cardClasses}`}
                >
                  <h3 className="text-4xl font-bold tracking-tighter group-hover:scale-110 transition-transform duration-500">{t.startApiTrial}</h3>
                  <div className={`mt-4 w-16 h-1 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                  <span className="font-mono text-xs mt-4 opacity-60">{t.getApiKeyCta}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Specs */}
          <section id="api" className={`py-24 px-6 bg-current ${theme === 'light' ? 'text-white bg-neutral-900' : 'text-black bg-neutral-100'}`}>
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <span className="font-mono text-xs tracking-widest uppercase border-b border-current pb-2 mb-8 block opacity-60">{t.architecture}</span>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">{t.beyondText}</h2>
              </div>
              <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><Waves size={20} /> {t.waveformGeneration}</h4>
                  <p className="opacity-80 leading-relaxed">{t.waveformDesc}</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><Cpu size={20} /> {t.contextAware}</h4>
                  <p className="opacity-80 leading-relaxed">{t.contextAwareDesc}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
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
            </div >

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
          </aside >

    {/* Main Work Area */ }
    < div className = "flex-1 flex flex-col md:flex-row overflow-hidden" >

      {/* Center Panel - Input & Controls */ }
      < div className = "flex-1 flex flex-col relative" >
        {/* Header of Panel */ }
        < div className = {`h-16 border-b ${borderClass} flex items-center justify-between px-6 bg-opacity-50`
}>
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
              </div >

  {/* Text Area */ }
  < div className = "flex-1 relative" >
    <textarea
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
      className={`w-full h-full resize-none p-8 text-2xl md:text-3xl font-light outline-none bg-transparent ${theme === 'light' ? 'text-neutral-900 placeholder:text-neutral-300' : 'text-white placeholder:text-neutral-700'}`}
      placeholder={t.typePlaceholder}
    />

{/* Error Display */ }
{
  error && (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full">
      {error}
    </div>
  )
}

{/* Audio Output */ }
{
  audioUrl && (
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
  )
}

<div className="absolute bottom-6 right-6 font-mono text-xs opacity-40">
  {textInput.length} {t.chars}
</div>
              </div >

  {/* Bottom Controls */ }
  < div className = {`h-24 border-t ${borderClass} flex items-center px-6 gap-6 overflow-x-auto`}>
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
              </div >
            </div >

  {/* Right Panel - Settings / Library */ }
  < div className = {`w-80 border-l ${borderClass} bg-opacity-20 flex flex-col hidden xl:flex`}>
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
            </div >
          </div >

  {/* Hidden file input */ }
  < input
type = "file"
ref = { fileInputRef }
onChange = { handleFileChange }
accept = "audio/wav"
className = "hidden"
  />
        </main >
      )}

{/* Footer (Only on Landing) */ }
{
  !isLoggedIn && (
    <footer className={`py-12 px-6 border-t ${borderClass}`}>
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Waves size={20} />
          AURA_VOICE
        </div>
        <div className={`flex gap-8 text-sm font-mono ${textSubtle}`}>
          <a href="#" className="hover:text-current transition-colors">{t.github}</a>
          <a href="#" className="hover:text-current transition-colors">{t.discord}</a>
          <a href="#" className="hover:text-current transition-colors">{t.status}</a>
        </div>
        <div className={`text-xs ${textSubtle}`}>
          {t.footer}
        </div>
      </div>
    </footer>
  )
}

{/* Styles for bounce animation */ }
<style jsx global>{`
        @keyframes bounce {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </div >
  );
}
