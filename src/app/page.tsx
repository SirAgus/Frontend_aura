'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play, Pause, Mic, Activity, Globe, Lock, Code, Zap,
  Github, Twitter, Disc, Volume2, User, Mail, ArrowRight,
  ChevronRight, X, Menu, Sun, Moon, Waves, Sparkles, Check
} from 'lucide-react';

const translations = {
  es: {
    heroTitle: 'Síntesis Neural de Voz para la Próxima Generación',
    heroDesc: 'Clonación de voz hiperrealista y síntesis de texto a voz con latencia ultra baja. Diseñado para desarrolladores y creadores.',
    startNow: 'COMENZAR AHORA',
    documentation: 'DOCUMENTACIÓN',
    features: 'CARACTERÍSTICAS',
    pricing: 'PRECIOS',
    showcase: 'DEMOSTRACIÓN',
    status: 'ESTADO: ONLINE',
    copyright: '© 2024 AURA VOICE SYSTEMS.',
    rights: 'TODOS LOS DERECHOS RESERVADOS.',
    privacy: 'PRIVACIDAD',
    terms: 'TÉRMINOS',
    contact: 'CONTACTO',
    scrollToListen: 'DESPLAZA PARA ESCUCHAR',
    demoTitle: 'Experimenta la Calidad',
    demoDesc: 'Escucha muestras generadas en tiempo real por nuestro motor neural v4.0.',
    feature1Title: 'Clonación Instantánea',
    feature1Desc: 'Solo necesitas 3 segundos de audio para clonar cualquier voz con alta fidelidad.',
    feature2Title: 'Latencia Ultra Baja',
    feature2Desc: 'Generación de audio en menos de 50ms para aplicaciones conversacionales en tiempo real.',
    feature3Title: 'Soporte Multilingüe',
    feature3Desc: 'El modelo entiende y sintetiza en más de 30 idiomas con acento nativo.',
    feature4Title: 'API Robusta',
    feature4Desc: 'Integra nuestras voces en tu aplicación con pocas líneas de código.',
    readyToBuild: '¿Listo para Construir?',
    joinCommunity: 'Únete a miles de desarrolladores usando Aura.',
    accessTerminal: 'Acceder a la Terminal',
    welcomeBack: 'Bienvenido de nuevo',
    signInDesc: 'Ingresa tus credenciales para acceder al sistema.',
    signUpDesc: 'Solicita acceso anticipado a la plataforma.',
    fullName: 'Nombre Completo',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    continue: 'CONTINUAR',
    requestAccess: 'SOLICITAR ACCESO',
    noAccount: '¿No tienes cuenta?',
    haveAccount: '¿Ya tienes cuenta?',
    signIn: 'INICIAR SESIÓN'
  },
  en: {
    heroTitle: 'Neural Voice Synthesis for the Next Generation',
    heroDesc: 'Hyper-realistic voice cloning and text-to-voice synthesis with ultra-low latency. Designed for developers and creators.',
    startNow: 'START NOW',
    documentation: 'DOCUMENTATION',
    features: 'FEATURES',
    pricing: 'PRICING',
    showcase: 'SHOWCASE',
    status: 'STATUS: ONLINE',
    copyright: '© 2024 AURA VOICE SYSTEMS.',
    rights: 'ALL RIGHTS RESERVED.',
    privacy: 'PRIVACY',
    terms: 'TERMS',
    contact: 'CONTACT',
    scrollToListen: 'SCROLL TO LISTEN',
    demoTitle: 'Experience the Quality',
    demoDesc: 'Listen to samples generated in real-time by our v4.0 neural engine.',
    feature1Title: 'Instant Cloning',
    feature1Desc: 'You only need 3 seconds of audio to clone any voice with high fidelity.',
    feature2Title: 'Ultra Low Latency',
    feature2Desc: 'Audio generation in less than 50ms for real-time conversational applications.',
    feature3Title: 'Multilingual Support',
    feature3Desc: 'The model understands and synthesizes in over 30 languages with native accent.',
    feature4Title: 'Robust API',
    feature4Desc: 'Integrate our voices into your application with just a few lines of code.',
    readyToBuild: 'Ready to Build?',
    joinCommunity: 'Join thousands of developers using Aura.',
    accessTerminal: 'Access Kernel',
    welcomeBack: 'Welcome Back',
    signInDesc: 'Enter your credentials to access the system.',
    signUpDesc: 'Request early access to the platform.',
    fullName: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    continue: 'CONTINUE',
    requestAccess: 'REQUEST ACCESS',
    noAccount: 'Don\'t have an account?',
    haveAccount: 'Already have an account?',
    signIn: 'SIGN IN'
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [showAuth, setShowAuth] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrolled / maxScroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'es' ? 'en' : 'es');

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!username || !password) {
      setLoginError('Credenciales requeridas');
      return;
    }
    // Set Auth
    localStorage.setItem('voice_auth', btoa(`${username}:${password}`));
    router.push('/dashboard');
  };

  const themeClasses = theme === 'light' ? 'bg-[#f0f0f0] text-neutral-900' : 'bg-[#0a0a0a] text-neutral-100';
  const borderClass = theme === 'light' ? 'border-neutral-300' : 'border-neutral-800';
  const textSubtle = theme === 'light' ? 'text-neutral-500' : 'text-neutral-500';
  const cardClasses = theme === 'light' ? 'bg-white border-neutral-200 hover:border-black' : 'bg-[#111] border-neutral-800 hover:border-white';
  const buttonHighlight = theme === 'light' ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 selection:bg-emerald-500/30 ${themeClasses}`}>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 border-b transition-colors duration-500 backdrop-blur-md bg-opacity-80 ${borderClass} ${theme === 'light' ? 'bg-[#f0f0f0]/80' : 'bg-[#0a0a0a]/80'}`}>
        <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className={`w-8 h-8 flex items-center justify-center border ${borderClass} rounded-full`}>
              <Waves size={16} />
            </div>
            <span>AURA_VOICE</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest">
              <button onClick={() => scrollTo('features')} className="hover:text-emerald-500 transition-colors uppercase">{t.features}</button>
              <button onClick={() => scrollTo('showcase')} className="hover:text-emerald-500 transition-colors uppercase">{t.showcase}</button>
              <button onClick={() => scrollTo('pricing')} className="opacity-40 cursor-not-allowed uppercase">{t.pricing}</button>
            </div>

            <div className={`h-4 w-[1px] ${borderClass} hidden md:block`}></div>

            <button onClick={toggleLang} className={`flex items-center gap-1 text-xs font-bold uppercase hover:opacity-60 transition-opacity`}>
              {lang}
            </button>

            <button onClick={toggleTheme} className="hover:opacity-60 transition-opacity">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => setShowAuth(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest transition-transform hover:scale-105 active:scale-95 uppercase ${buttonHighlight}`}
            >
              {t.startNow}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-bold tracking-widest uppercase animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              {t.status}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
              {lang === 'en' ? (
                <>NEURAL <span className="text-emerald-500">VOICE</span><br />SYNTHESIS</>
              ) : (
                <>SÍNTESIS <span className="text-emerald-500">NEURAL</span><br />DE VOZ</>
              )}
            </h1>

            <p className={`text-lg md:text-xl max-w-md leading-relaxed ${textSubtle}`}>
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowAuth(true)}
                className={`px-8 py-4 rounded-full font-bold text-sm tracking-widest flex items-center gap-2 transition-all hover:scale-105 uppercase ${buttonHighlight}`}
              >
                {t.startNow} <ArrowRight size={16} />
              </button>
              <button className={`px-8 py-4 rounded-full font-bold text-sm tracking-widest border border-current hover:bg-current hover:bg-opacity-5 transition-all uppercase flex items-center gap-2`}>
                <Code size={16} /> API DOCS
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Trusted by placeholders */}
              <div className="h-6 w-20 bg-current opacity-20 rounded" />
              <div className="h-6 w-20 bg-current opacity-20 rounded" />
              <div className="h-6 w-20 bg-current opacity-20 rounded" />
            </div>
          </div>

          {/* Interactive Visual/Demo */}
          <div className="relative h-[500px] w-full hidden lg:flex items-center justify-center">
            <div className={`relative w-80 aspect-[9/16] rounded-3xl border-8 shadow-2xl overflow-hidden bg-black ${theme === 'light' ? 'border-neutral-900' : 'border-neutral-800'}`}>
              {/* Fake UI */}
              <div className="absolute top-0 left-0 w-full p-6 text-white z-10">
                <div className="flex justify-between items-center mb-8">
                  <Menu size={20} />
                  <span className="font-bold tracking-widest text-xs">AURA</span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                    <div className="h-2 w-12 bg-emerald-500 rounded-full mb-2"></div>
                    <p className="text-xs opacity-80 leading-relaxed">System v4.0 online. Latency optimal.</p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-12 flex-1 bg-white/5 rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Abstract Waves */}
              <div className="absolute inset-0 opacity-50">
                {/* Placeholder for complex webgl wave if we had one */}
                <div className={`w-full h-full bg-gradient-to-t from-emerald-900/50 to-transparent`} />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute bottom-12 left-0 w-full flex justify-center">
                <button className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </button>
              </div>
            </div>

            {/* Background Decorative Rings */}
            <div className={`absolute -z-10 w-[600px] h-[600px] border border-current rounded-full opacity-5 animate-[spin_60s_linear_infinite]`} style={{ borderStyle: 'dashed' }} />
            <div className={`absolute -z-10 w-[450px] h-[450px] border border-current rounded-full opacity-10 animate-[spin_40s_linear_infinite_reverse]`} />
          </div>

        </div>

        {/* Scroll Indicator */}
        <div
          onClick={() => scrollTo('features')}
          className="absolute bottom-10 right-6 md:right-10 flex flex-col items-end gap-2 text-xs font-mono opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
        >
          <span>{t.scrollToListen}</span>
          <div className={`w-[1px] h-24 ${theme === 'light' ? 'bg-black' : 'bg-white'}`} />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className={`py-32 px-6 md:px-12 ${theme === 'light' ? 'bg-white' : 'bg-[#0f0f0f]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { t: t.feature1Title, d: t.feature1Desc, i: User },
              { t: t.feature2Title, d: t.feature2Desc, i: Zap },
              { t: t.feature3Title, d: t.feature3Desc, i: Globe },
              { t: t.feature4Title, d: t.feature4Desc, i: Code },
            ].map((f, i) => (
              <div key={i} className={`p-8 border rounded-xl transition-all duration-300 group hover:-translate-y-2 ${cardClasses}`}>
                <f.i size={32} className="mb-6 opacity-40 group-hover:opacity-100 group-hover:text-emerald-500 transition-opacity" />
                <h3 className="text-lg font-bold mb-2">{f.t}</h3>
                <p className={`text-sm leading-relaxed ${textSubtle}`}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className={`py-32 px-6 md:px-12 border-t ${borderClass}`}>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tighter mb-4">{t.demoTitle}</h2>
          <p className={`text-lg ${textSubtle}`}>{t.demoDesc}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-6 border rounded-xl flex items-center justify-between transition-colors hover:bg-neutral-500/5 ${cardClasses}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'}`}>
                  {i === 1 ? 'ES' : i === 2 ? 'EN' : 'FR'}
                </div>
                <div>
                  <div className="font-bold text-sm">Voice Sample 0{i}</div>
                  <div className="text-xs opacity-40 font-mono">Neural Model v4.1 • Stereo • 48kHz</div>
                </div>
              </div>
              <button className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110 ${theme === 'light' ? 'border-black hover:bg-black hover:text-white' : 'border-white hover:bg-white hover:text-black'}`}>
                <Play size={14} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 md:px-12 border-t ${borderClass}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold tracking-widest opacity-60">
          <div>{t.copyright}</div>
          <div className="flex gap-8">
            <a href="#" className="hover:opacity-100">{t.privacy}</a>
            <a href="#" className="hover:opacity-100">{t.terms}</a>
            <a href="#" className="hover:opacity-100">{t.contact}</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] backdrop-blur-md bg-black/60 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl relative overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-[#111] border border-neutral-800'}`}>

            <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-500/10 transition-colors">
              <X size={20} />
            </button>

            <div className="mb-8 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center border ${theme === 'light' ? 'border-neutral-200' : 'border-neutral-800'}`}>
                <Waves size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Bienvenido</h2>
              <p className="text-sm opacity-60">Ingresa tus credenciales para acceder.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase opacity-60 mb-2">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className={`w-full p-4 rounded-lg outline-none border transition-colors ${theme === 'light' ? 'bg-neutral-50 border-neutral-200 focus:border-black' : 'bg-neutral-900 border-neutral-800 focus:border-white'}`}
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase opacity-60 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full p-4 rounded-lg outline-none border transition-colors ${theme === 'light' ? 'bg-neutral-50 border-neutral-200 focus:border-black' : 'bg-neutral-900 border-neutral-800 focus:border-white'}`}
                  placeholder="••••••••"
                />
              </div>

              {loginError && <p className="text-xs text-red-500 font-mono text-center">{loginError}</p>}

              <button
                type="submit"
                className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98] ${buttonHighlight}`}
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
