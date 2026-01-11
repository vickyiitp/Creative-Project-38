import React, { useEffect, useRef, useState } from 'react';
import Modal, { PrivacyContent, TermsContent } from './LegalModals';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  // Scroll listener for Back to Top
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Matrix/Cipher Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;
    const columns = Math.ceil(window.innerWidth / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)'; // Darker background trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient effect for the leading character
        const isHead = Math.random() > 0.95;
        ctx.fillStyle = isHead ? '#fff' : `rgba(34, 197, 94, ${Math.random() * 0.5 + 0.1})`;
        
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen text-white font-['Orbitron'] relative overflow-x-hidden selection:bg-green-500 selection:text-black bg-[#050505]">
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40"
      />
      
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] crt-overlay"></div>
      <div className="scanline z-[1]"></div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-green-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 cursor-pointer group" onClick={() => window.location.reload()}>
              <span className="text-xl md:text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300 tracking-tighter">
                ENIGMA<span className="text-green-500">_</span>MACHINE
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8 font-sans text-sm font-semibold tracking-wider">
                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-green-400 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-green-500 hover:after:w-full after:transition-all">MECHANICS</button>
                <button onClick={() => scrollToSection('lore')} className="hover:text-green-400 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-green-500 hover:after:w-full after:transition-all">LORE</button>
                <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-green-500 hover:after:w-full after:transition-all">PORTFOLIO</a>
                <button 
                  onClick={onStart}
                  className="px-6 py-2 bg-green-600/90 hover:bg-green-500 text-black font-bold rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all hover:-translate-y-0.5"
                >
                  PLAY NOW
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-green-400 hover:text-white hover:bg-green-900/20 focus:outline-none"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                   <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                ) : (
                   <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                   </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} bg-black/95 backdrop-blur-xl border-b border-green-900/30`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center font-sans font-semibold">
            <button onClick={() => scrollToSection('how-it-works')} className="block px-3 py-3 text-base hover:text-green-400 transition-colors w-full text-center border-b border-white/5">MECHANICS</button>
            <button onClick={() => scrollToSection('lore')} className="block px-3 py-3 text-base hover:text-green-400 transition-colors w-full text-center border-b border-white/5">LORE</button>
            <a href="https://vickyiitp.tech" target="_blank" rel="noopener noreferrer" className="block px-3 py-3 text-base hover:text-green-400 transition-colors w-full text-center border-b border-white/5">PORTFOLIO</a>
            <div className="pt-4 w-full px-3 pb-2">
              <button 
                onClick={onStart}
                className="w-full px-5 py-3 bg-green-600 hover:bg-green-500 text-black font-bold rounded shadow-lg"
              >
                PLAY NOW
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-6 z-10 pt-20 perspective-[1000px]">
        <div className="glass-panel p-6 md:p-12 rounded-none md:rounded-2xl max-w-5xl w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.05)] border-y border-green-500/20 md:border md:border-green-500/20 animate-fade-in-up relative overflow-hidden group">
          
          {/* Decorative Corner Lines */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500/50"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500/50"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500/50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500/50"></div>

          <div className="mb-6 inline-block px-4 py-1 rounded-sm bg-green-500/5 border border-green-500/20 text-green-400 text-[10px] md:text-xs tracking-[0.3em] font-sans font-bold animate-pulse">
            PROJECT 100 GAMES // VICKYIITP
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black mb-6 tracking-tighter text-white glitch" data-text="ENIGMA">
            ENIGMA
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl text-green-500/80 mt-[-10px] md:mt-[-20px] font-light tracking-[0.5em] uppercase mb-8">
            PROTOCOL
          </h2>
          
          <p className="max-w-xl mx-auto text-neutral-400 mb-10 font-sans text-base md:text-lg leading-relaxed">
            The enemy has shifted their encryption. The fate of the free world hangs on a single transmission. 
            <span className="text-green-400 block mt-2 font-bold">Crack the unbreakable code.</span>
          </p>

          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-green-600 text-black font-bold text-lg rounded-sm transition-all duration-300 overflow-hidden hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] w-full md:w-auto tracking-widest"
            aria-label="Start Game"
          >
            <span className="relative z-10">INITIALIZE DECRYPTION</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out"></div>
            <div className="absolute inset-0 border-2 border-black opacity-0 group-hover:opacity-20 scale-105 transition-all"></div>
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-green-500/50 hidden md:block" aria-hidden="true">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 md:py-32 px-4 md:px-6 bg-neutral-900/80 z-10 backdrop-blur-sm border-t border-white/5 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 md:mb-24">
             <div className="h-1 w-20 bg-green-500 mb-6"></div>
             <h2 className="text-3xl md:text-5xl font-bold text-center tracking-tighter">
                SYSTEM <span className="text-green-500">MECHANICS</span>
             </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 perspective-[1000px]">
            {/* Card 1 */}
            <div className="glass-panel p-8 rounded-xl border border-white/5 hover:border-green-500/50 transition-all duration-500 group transform hover:-translate-y-2 hover:rotate-x-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.3)] bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white group-hover:opacity-20 transition-opacity select-none">01</div>
              <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300 mx-auto md:mx-0 ring-1 ring-green-500/30">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center md:text-left text-white group-hover:text-green-400 transition-colors">SIGNAL INTERCEPT</h3>
              <p className="text-neutral-400 font-sans leading-relaxed text-sm text-center md:text-left">
                Capture encrypted transmissions. Analyze the ciphertext for structural weaknesses using visual tools.
              </p>
              <div className="mt-8 h-0.5 w-full bg-neutral-800 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-green-500 w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-8 rounded-xl border border-white/5 hover:border-green-500/50 transition-all duration-500 group transform hover:-translate-y-2 hover:rotate-x-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.3)] bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white group-hover:opacity-20 transition-opacity select-none">02</div>
              <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300 mx-auto md:mx-0 ring-1 ring-green-500/30">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center md:text-left text-white group-hover:text-green-400 transition-colors">ROTOR CONFIG</h3>
              <p className="text-neutral-400 font-sans leading-relaxed text-sm text-center md:text-left">
                Manipulate the 3-rotor assembly. Align the shift ciphers to the daily key settings to reveal the plaintext.
              </p>
               <div className="mt-8 flex space-x-2 justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded-full border border-green-500 border-dashed animate-[spin_3s_linear_infinite]"></div>
                  <div className="w-6 h-6 rounded-full border border-green-500 border-dashed animate-[spin_4s_linear_infinite_reverse]"></div>
                  <div className="w-6 h-6 rounded-full border border-green-500 border-dashed animate-[spin_5s_linear_infinite]"></div>
               </div>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-8 rounded-xl border border-white/5 hover:border-green-500/50 transition-all duration-500 group transform hover:-translate-y-2 hover:rotate-x-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.3)] bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white group-hover:opacity-20 transition-opacity select-none">03</div>
              <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300 mx-auto md:mx-0 ring-1 ring-green-500/30">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center md:text-left text-white group-hover:text-green-400 transition-colors">FREQUENCY ANALYSIS</h3>
              <p className="text-neutral-400 font-sans leading-relaxed text-sm text-center md:text-left">
                Analyze signal distribution against standard language models. If 'E' is the most common letter, you're close.
              </p>
              <div className="mt-8 flex items-end justify-between h-6 space-x-1 px-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="w-1/6 bg-green-500/40 h-[40%] group-hover:h-[60%] transition-all duration-500"></div>
                  <div className="w-1/6 bg-green-500/80 h-[90%] group-hover:h-[80%] transition-all duration-500 delay-75"></div>
                  <div className="w-1/6 bg-green-500/30 h-[30%] group-hover:h-[50%] transition-all duration-500 delay-100"></div>
                  <div className="w-1/6 bg-green-500/60 h-[70%] group-hover:h-[90%] transition-all duration-500 delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="lore" className="relative py-20 md:py-24 px-4 md:px-6 z-10 scroll-mt-16 bg-gradient-to-b from-neutral-900/80 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold text-green-500 uppercase tracking-[0.5em] mb-4">The Briefing</h2>
          <p className="text-3xl md:text-5xl leading-tight font-light text-white mb-10">
            "We are in the dark. <br/><span className="font-bold text-white">We need light.</span>"
          </p>
          <div className="glass-panel p-6 md:p-12 rounded-lg text-left border-l-4 border-l-green-500 hover:bg-white/5 transition-colors duration-500 shadow-2xl relative">
            <div className="absolute top-4 right-4 text-red-500 border border-red-500 px-2 py-0.5 text-xs font-bold uppercase tracking-widest rotate-[-5deg] opacity-70">Top Secret</div>
            <p className="text-neutral-300 font-sans text-lg mb-6">
              <strong className="text-white block mb-1 text-sm uppercase tracking-wider text-green-400">Date Log:</strong> October 14, 1942<br/>
              <strong className="text-white block mb-1 text-sm uppercase tracking-wider text-green-400 mt-2">Location:</strong> Bletchley Park, Block 8
            </p>
            <div className="h-px w-full bg-white/10 mb-6"></div>
            <p className="text-neutral-300 font-sans text-base md:text-lg leading-relaxed">
              You are the lead cryptanalyst for the Ultra project. Thousands of lives depend on the convoys crossing the Atlantic. 
              The U-Boats are coordinating their attacks using a new, sophisticated cipher. 
              <br/><br/>
              Your machine is ready. The rotors are reset. The intercept is waiting.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 md:py-16 border-t border-white/5 bg-black z-10 font-sans">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-neutral-400">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white font-['Orbitron'] tracking-wider">VICKYIITP</h3>
            <p className="leading-relaxed max-w-sm">
              Building 100 Games. Exploring the frontiers of AI and Web Development at IIT Patna. Devil Labs.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon href="https://youtube.com/@vickyiitp" label="YouTube" path="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              <SocialIcon href="https://linkedin.com/in/vickyiitp" label="LinkedIn" path="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              <SocialIcon href="https://x.com/vickyiitp" label="X (Twitter)" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              <SocialIcon href="https://github.com/vickyiitp" label="GitHub" path="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              <SocialIcon href="https://instagram.com/vickyiitp" label="Instagram" path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.225-.149-4.771-1.664-4.919-4.919C2.175 15.584 2.163 15.205 2.163 12c0-3.205.012-3.585.069-4.849.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </div>
          </div>

          {/* Links Column */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-xs border-b border-white/10 pb-2 inline-block w-20">Platform</h4>
            <a href="https://vickyiitp.tech" className="hover:text-green-500 transition-colors">Main Portfolio</a>
            <button onClick={onStart} className="text-left hover:text-green-500 transition-colors">Play Game</button>
            <a href="https://github.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">Source Code</a>
          </div>

          {/* Contact/Legal Column */}
          <div className="flex flex-col space-y-2">
            <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-xs border-b border-white/10 pb-2 inline-block w-20">Legal</h4>
            <button onClick={() => setActiveModal('privacy')} className="text-left hover:text-green-500 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="text-left hover:text-green-500 transition-colors">Terms of Service</button>
            <div className="mt-4 pt-4 border-t border-neutral-800">
               <a href="mailto:themvaplatform@gmail.com" className="hover:text-green-500 transition-colors break-words text-xs font-mono">themvaplatform@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-900 text-center text-xs text-neutral-600">
          <p>© 2025 Vicky Kumar (vickyiitp). All rights reserved.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-green-600/80 hover:bg-green-500 text-white rounded-full shadow-lg z-40 transition-all duration-300 backdrop-blur-sm animate-fade-in hover:scale-110"
          aria-label="Back to Top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        title="Privacy Policy" 
        content={<PrivacyContent />} 
      />
      <Modal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)} 
        title="Terms of Service" 
        content={<TermsContent />} 
      />
    </div>
  );
};

// Helper component for social icons
const SocialIcon = ({ href, label, path }: { href: string, label: string, path: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-green-400 transition-all transform hover:-translate-y-1 hover:scale-110" aria-label={label}>
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d={path}/></svg>
  </a>
);

export default LandingPage;