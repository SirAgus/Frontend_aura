'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Mic, Activity, Cpu, Languages, Play, X, Menu, ArrowRight, User, Lock, Mail, Globe, Pause } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CursorTrail from '@/components/CursorTrail';

// Translations
const translations = {
  es: {
    demo: 'Demo',
    features: 'Características',
    api: 'API',
    signIn: 'Iniciar Sesión',
    getApiKey: 'Obtener API Key',
    comingSoon: 'PRÓXIMAMENTE',
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
    version: 'V1.0 ESTABLE',
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
    github: 'GITHUB',
    linkedin: 'LINKEDIN',
    backend: 'Backend',
    frontend: 'Frontend',
    footer: '© {year} Aura Intelligence. Sistema operacional.',
    generatingVoice: 'GENERANDO VOZ...',
  },
  en: {
    demo: 'Demo',
    features: 'Features',
    api: 'API',
    signIn: 'Sign In',
    getApiKey: 'Get API Key',
    comingSoon: 'COMING SOON',
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
    version: 'V1.0 STABLE',
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
    github: 'GITHUB',
    linkedin: 'LINKEDIN',
    backend: 'Backend',
    frontend: 'Frontend',
    footer: '© {year} Aura Intelligence. System operational.',
    generatingVoice: 'GENERATING VOICE...',
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [showGitHubMenu, setShowGitHubMenu] = useState(false);
  const [barHeights, setBarHeights] = useState<number[]>(Array(8).fill(20));

  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const animationRef = useRef<number | null>(null);

  const t = translations[lang];

  // Close GitHub menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showGitHubMenu && !target.closest('.github-menu-container')) {
        setShowGitHubMenu(false);
      }
    };

    if (showGitHubMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showGitHubMenu]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'es' ? 'en' : 'es');
  };

  const initAudioAnalyzer = () => {
    if (!audioRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(new ArrayBuffer(bufferLength));

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      updateVisualizer();
    } catch (error) {
      console.error('Error initializing audio analyzer:', error);
    }
  };

  const updateVisualizer = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const newHeights = [];
    const data = dataArrayRef.current;

    // Map 8 bars to frequency data
    for (let i = 0; i < 8; i++) {
      // Take average of frequency ranges for each bar
      const start = Math.floor((i / 8) * data.length);
      const end = Math.floor(((i + 1) / 8) * data.length);
      let sum = 0;
      for (let j = start; j < end; j++) {
        sum += data[j];
      }
      const average = sum / (end - start);
      // Convert to percentage (20% min, 100% max)
      const height = Math.max(20, (average / 255) * 100);
      newHeights.push(height);
    }

    setBarHeights(newHeights);
    animationRef.current = requestAnimationFrame(updateVisualizer);
  };

  const stopVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setBarHeights(Array(8).fill(20));
  };

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // If signup mode, imply success or switch to logic. For now just handle login for 'signin'
    if (authMode === 'signup') {
      // Mock signup or just log
      console.log('Signup not implemented in backend yet');
      return;
    }

    if (!username || !password) {
      setLoginError('Credenciales requeridas');
      return;
    }

    setLoginError('');

    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${credentials}` }
      });

      const data = await response.json();

      if (data.success) {
        // Login exitoso
        localStorage.setItem('voice_auth', credentials);
        localStorage.setItem('voice_user', data.user || username);
        router.push('/dashboard');
      } else {
        // Login fallido
        setLoginError(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Error de conexión con el servidor');
    }
  };

  const handlePlayHero = async () => {
    if (isPlaying || isGenerating) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsGenerating(false);
      stopVisualizer();
      return;
    }

    try {
      setIsGenerating(true);
      // Using default admin creds for demo playback as before
      const defaultAuth = btoa('admin:admin_password');
      const response = await fetch(`http://localhost:8000/demo?text=Hello%20I%20am%20Aura%20and%20this%20is%20a%20voice%20test&language=en&mode=multilingual&language_id=es&temperature=0.7&exaggeration=0.5&cfg=1.0&repetition_penalty=2.0&top_p=1.0`, {
        headers: { 'Authorization': `Basic ${defaultAuth}` }
      });

      if (!response.ok) throw new Error('Demo failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setIsGenerating(false);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onended = () => {
          setIsPlaying(false);
          stopVisualizer();
        };
        audioRef.current.play().then(() => {
          initAudioAnalyzer();
        }).catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
      setIsPlaying(false);
    }
  };

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

  const Visualizer = ({ playing, heights }: { playing: boolean; heights: number[] }) => (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`w-1 md:w-1.5 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-neutral-900' : 'bg-white'}`}
          style={{
            height: playing ? `${heights[i] || 20}%` : '20%',
            animation: playing ? 'none' : 'none'
          }}
        />
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out font-sans ${themeClasses} flex flex-col overflow-x-hidden relative`}>
      <CursorTrail theme={theme} />
      <audio ref={audioRef} className="hidden" />

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 w-full z-50 border-b ${borderClass} backdrop-blur-md bg-opacity-80 ${theme === 'light' ? 'bg-[#f0f0f0]/80' : 'bg-[#0a0a0a]/80'}`}>
        <div className="w-full px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => scrollTo('home')}>
            <div className="w-16 h-16 flex items-center justify-center">
              <Image src="/logo.png" alt="AURA_VOICE" width={64} height={64} className="object-contain" />
            </div>
            <span>AURA_VOICE</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <button
              onClick={() => scrollTo('home')}
              className="hover:opacity-50 transition-opacity uppercase"
            >
              {t.demo}
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="hover:opacity-50 transition-opacity uppercase"
            >
              {t.features}
            </button>
            <button
              onClick={() => scrollTo('api')}
              className="hover:opacity-50 transition-opacity uppercase"
            >
              {t.api}
            </button>

            <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-800'}`}></div>

            <button
              onClick={() => { setShowAuth(true); setAuthMode('signin'); }}
              className="hover:opacity-50 transition-opacity uppercase"
            >
              {t.signIn}
            </button>

            <button
              disabled
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all relative ${theme === 'light' ? 'bg-neutral-300 text-neutral-500' : 'bg-neutral-700 text-neutral-400'} cursor-not-allowed opacity-60`}
              title={t.comingSoon}
            >
              {t.getApiKey}
              <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">{t.comingSoon}</span>
            </button>

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
          </div>

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

      {/* Auth Modal */}
      {showAuth && (
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
              <div className="w-20 h-20 flex items-center justify-center mb-4">
                <Image src="/logo.png" alt="AURA_VOICE" width={80} height={80} className="object-contain" />
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
                  type="text" // Assuming username based login for now
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={authMode === 'signin' ? "Usuario" : t.email}
                  className={`w-full p-4 pl-12 text-sm outline-none transition-colors border ${inputClasses}`}
                />
              </div>

              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textSubtle}`} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t.password}
                  className={`w-full p-4 pl-12 text-sm outline-none transition-colors border ${inputClasses}`}
                />
              </div>

              {loginError && <p className="text-xs text-red-500 font-mono">{loginError}</p>}

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

      {/* Main Content */}
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
                <span className="text-neutral-900 dark:text-neutral-100">SONIC</span><br />
                <span className="text-neutral-500 dark:text-neutral-500">{t.sonicPresence}</span><br />
                <span className="text-neutral-900 dark:text-neutral-100">{t.engine}</span>
              </h1>
              <p className={`text-xl md:text-2xl max-w-xl leading-relaxed mb-10 ${textSubtle}`}>
                {t.heroDesc}
              </p>

              <div className={`inline-flex items-center gap-6 p-2 pr-8 rounded-full border ${borderClass} ${theme === 'light' ? 'bg-white/50' : 'bg-black/50'} backdrop-blur-sm`}>
                <button
                  onClick={handlePlayHero}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isGenerating
                      ? 'bg-yellow-500 text-white animate-pulse'
                      : isPlaying
                        ? 'bg-red-500 text-white'
                        : (theme === 'light' ? 'bg-black text-white' : 'bg-white text-black')
                    }`}
                >
                  {isGenerating ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : isPlaying ? (
                    <Pause size={24} fill="currentColor" className="ml-1" />
                  ) : (
                    <Play size={24} fill="currentColor" className="ml-1" />
                  )}
                </button>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono opacity-60">{t.voiceSample}</span>
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-12">
                      <span className="text-xs font-mono animate-pulse">{t.generatingVoice}</span>
                    </div>
                  ) : (
                    <Visualizer playing={isPlaying} heights={barHeights} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 right-6 md:right-10 flex flex-col items-end gap-2 text-xs font-mono opacity-60 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => scrollTo('features')}>
            <span>{t.scrollToListen}</span>
            <div className={`w-[1px] h-24 ${theme === 'light' ? 'bg-black' : 'bg-white'}`}></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={`py-24 px-6 border-t ${borderClass}`}>
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-end mb-16">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{t.systemCapabilities}</h2>
              <span className={`hidden md:block font-mono text-sm ${textSubtle}`}>{t.neuralArchitecture}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
              {/* Feature 1 */}
              <div className={`group relative aspect-[16/9] p-8 flex flex-col justify-between transition-all duration-300 ${cardClasses}`}>
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
              <div className={`group relative aspect-[16/9] p-8 flex flex-col justify-between transition-all duration-300 ${cardClasses}`}>
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
              <div className={`group relative aspect-[16/9] p-8 flex flex-col justify-between transition-all duration-300 ${cardClasses}`}>
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
                className={`group relative aspect-[16/9] p-8 flex flex-col justify-center items-center text-center transition-all duration-300 cursor-not-allowed opacity-60 ${cardClasses}`}
              >
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] px-2 py-1 rounded bg-red-500 text-white font-bold">{t.comingSoon}</span>
                </div>
                <h3 className="text-4xl font-bold tracking-tighter opacity-50">{t.startApiTrial}</h3>
                <div className={`mt-4 w-16 h-1 bg-current opacity-30`}></div>
                <span className="font-mono text-xs mt-4 opacity-40">{t.getApiKeyCta}</span>
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
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Image src="/logo.png" alt="AURA_VOICE" width={32} height={32} className="object-contain" />
                  {t.waveformGeneration}
                </h4>
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

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${borderClass}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Image src="/logo.png" alt="AURA_VOICE" width={48} height={48} className="object-contain" />
            AURA_VOICE
          </div>
          <div className={`flex gap-8 text-sm font-mono ${textSubtle} items-center`}>
            <div className="relative github-menu-container">
              <button
                onClick={() => setShowGitHubMenu(!showGitHubMenu)}
                className="hover:text-current transition-colors flex items-center gap-1"
              >
                {t.github}
                <span className="text-xs">▼</span>
              </button>
              {showGitHubMenu && (
                <div className={`absolute bottom-full left-0 mb-2 ${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-[#111] border-neutral-800'} border rounded-lg shadow-lg min-w-[150px] z-50`}>
                  <a
                    href="https://github.com/SirAgus/backend_aura"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-neutral-500/10 transition-colors"
                    onClick={() => setShowGitHubMenu(false)}
                  >
                    {t.backend}
                  </a>
                  <a
                    href="https://github.com/SirAgus/Frontend_aura"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-neutral-500/10 transition-colors border-t border-neutral-200 dark:border-neutral-800"
                    onClick={() => setShowGitHubMenu(false)}
                  >
                    {t.frontend}
                  </a>
                </div>
              )}
            </div>
            <a
              href="https://www.linkedin.com/in/fernign/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-current transition-colors"
            >
              {t.linkedin}
            </a>
          </div>
          <div className={`text-xs ${textSubtle}`}>
            {t.footer.replace('{year}', new Date().getFullYear().toString())}
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
