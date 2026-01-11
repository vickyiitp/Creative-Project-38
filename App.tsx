import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generatePuzzle } from './services/geminiService';
import { generateRandomKey, encryptMessage, decryptMessage } from './services/cryptoService';
import Rotor from './components/Rotor';
import FrequencyChart from './components/FrequencyChart';
import LandingPage from './components/LandingPage';
import ScrambledText from './components/ScrambledText';
import { PuzzleData } from './types';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'game'>('landing');
  const [gameMode, setGameMode] = useState<'puzzle' | 'sandbox'>('puzzle');

  // Game State
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [rotors, setRotors] = useState<number[]>([0, 0, 0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Editor State
  const [customInput, setCustomInput] = useState<string>("ENTER YOUR MESSAGE");

  // Derived State
  const decryptedAttempt = useMemo(() => {
    if (gameMode === 'sandbox') {
        // In sandbox, we just show what the customInput becomes with current rotors
        return decryptMessage(customInput, rotors);
    }
    if (!encryptedText) return "";
    return decryptMessage(encryptedText, rotors);
  }, [encryptedText, rotors, gameMode, customInput]);

  // Initialization
  const startNewGame = useCallback(async () => {
    setLoading(true);
    setIsSolved(false);
    setShowSolution(false);
    setRotors([0, 0, 0]);
    
    // Fetch content
    const newPuzzle = await generatePuzzle();
    setPuzzle(newPuzzle);
    
    // Create logic
    const secretKey = generateRandomKey();
    const cipher = encryptMessage(newPuzzle.message, secretKey);
    setEncryptedText(cipher);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    // Pre-load a game when app loads, but stay on landing
    startNewGame();
  }, [startNewGame]);

  // Win Condition Check
  useEffect(() => {
    if (gameMode === 'sandbox') return;
    if (puzzle && decryptedAttempt === puzzle.message && !isSolved) {
      setIsSolved(true);
    }
  }, [decryptedAttempt, puzzle, isSolved, gameMode]);

  const handleRotorChange = (id: number, val: number) => {
    if (isSolved && gameMode === 'puzzle') return; 
    const newRotors = [...rotors];
    newRotors[id] = val;
    setRotors(newRotors);
  };

  const toggleGameMode = () => {
    setGameMode(prev => prev === 'puzzle' ? 'sandbox' : 'puzzle');
    setIsSolved(false);
    setShowSolution(false);
    setRotors([0, 0, 0]);
    if (gameMode === 'sandbox') {
        // Switching back to puzzle, maybe regenerate or keep current
        if (!puzzle) startNewGame();
    }
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('game')} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-green-500 flex flex-col items-center relative overflow-x-hidden font-mono selection:bg-green-900 selection:text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
         {/* Simple CSS rain simulation via repeated background */}
         <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_49px,#22c55e_50px)] bg-[length:100%_50px] animate-[scanline_20s_linear_infinite]"></div>
      </div>
      <div className="crt-overlay absolute inset-0 z-50 pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-6xl p-4 md:p-6 flex justify-between items-center border-b border-green-900/50 z-10 bg-neutral-900/90 backdrop-blur-md sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col cursor-pointer group" onClick={() => setView('landing')}>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white font-['Orbitron'] group-hover:text-green-400 transition-colors">
            ENIGMA<span className="text-green-600 group-hover:animate-pulse">_</span>MACHINE
          </h1>
          <span className="text-[10px] md:text-xs text-green-700 tracking-[0.3em] font-sans">V.1942.ALPHA // INTERCEPTOR</span>
        </div>
        <div className="flex items-center space-x-3 md:space-x-4">
           {gameMode === 'puzzle' && (
             <>
                <div className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-500 ${isSolved ? 'bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`}></div>
                <span className="text-[10px] md:text-xs font-bold font-sans tracking-wider hidden sm:block text-neutral-400">{isSolved ? 'STATUS: DECRYPTED' : 'STATUS: ENCRYPTED'}</span>
             </>
           )}
           {gameMode === 'sandbox' && (
              <span className="text-xs font-bold text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded bg-yellow-900/10">SANDBOX MODE</span>
           )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl p-3 md:p-6 flex flex-col z-10 gap-6 pb-20">
        
        {/* Mission Briefing / Controls */}
        <section className="bg-black/60 border border-green-800/30 rounded-lg p-5 shadow-inner relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-600/50"></div>
          
          <div className="flex justify-between items-start mb-4 border-b border-green-900/30 pb-2">
            <h2 className="text-xs md:text-sm font-bold text-green-500 uppercase tracking-widest font-sans flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-sm"></span>
              {gameMode === 'puzzle' ? 'Mission Parameters' : 'Editor Configuration'}
            </h2>
            <button 
                onClick={toggleGameMode}
                className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-white border border-neutral-700 hover:border-white px-2 py-1 rounded transition-all"
            >
                Switch to {gameMode === 'puzzle' ? 'Editor' : 'Mission'}
            </button>
          </div>

          {gameMode === 'puzzle' ? (
              loading ? (
                <div className="space-y-2 animate-pulse">
                   <div className="h-4 bg-green-900/20 w-3/4 rounded"></div>
                   <div className="h-4 bg-green-900/20 w-1/2 rounded"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-sm text-green-300">
                  <p className="flex items-center gap-2"><span className="text-green-700 font-bold min-w-[80px]">OPERATION:</span> {puzzle?.topic}</p>
                  <p className="flex items-center gap-2"><span className="text-green-700 font-bold min-w-[80px]">DIFFICULTY:</span> <span className={`px-2 py-0.5 rounded text-xs font-bold shadow-sm ${puzzle?.difficulty === 'Hard' ? 'bg-red-900/40 text-red-400 border border-red-900/50' : 'bg-green-900/40 text-green-400 border border-green-900/50'}`}>{puzzle?.difficulty.toUpperCase()}</span></p>
                  <p className="md:col-span-2 text-xs text-green-500/60 mt-2 font-mono border-t border-green-900/30 pt-2">
                    // MISSION: Rotate the three rotors below until the frequency chart aligns.
                  </p>
                </div>
              )
          ) : (
              <div className="flex flex-col gap-2">
                  <label className="text-xs text-green-700 font-bold">INPUT TEXT TO ENCRYPT/DECRYPT:</label>
                  <input 
                    type="text" 
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
                    className="w-full bg-black/50 border border-green-700/50 rounded p-2 text-green-400 font-mono focus:outline-none focus:border-green-400 focus:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all placeholder-green-900"
                    placeholder="TYPE HERE..."
                  />
                  <p className="text-xs text-neutral-500 mt-1">// NOTE: In Sandbox mode, moving rotors changes the output below based on this input.</p>
              </div>
          )}
        </section>

        {/* The Machine Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Rotors Section */}
          <div className="lg:col-span-1 bg-[#121212] rounded-xl border border-neutral-700 p-6 flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            {/* Fake screws */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-neutral-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,1),1px_1px_0_rgba(255,255,255,0.1)]"></div>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neutral-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,1),1px_1px_0_rgba(255,255,255,0.1)]"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-neutral-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,1),1px_1px_0_rgba(255,255,255,0.1)]"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-neutral-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,1),1px_1px_0_rgba(255,255,255,0.1)]"></div>

            <h3 className="text-neutral-500 text-xs font-bold tracking-[0.2em] mb-6 relative z-10 font-sans border-b border-neutral-800 pb-2 w-full text-center">ROTOR ASSEMBLY</h3>
            
            <div className="flex justify-center items-center relative z-10 w-full gap-2">
              <Rotor id={0} position={rotors[0]} onChange={handleRotorChange} color="text-red-500" />
              <Rotor id={1} position={rotors[1]} onChange={handleRotorChange} color="text-yellow-500" />
              <Rotor id={2} position={rotors[2]} onChange={handleRotorChange} color="text-blue-500" />
            </div>

            <div className="mt-6 w-full text-center">
                 <div className="h-px bg-neutral-800 w-full mb-2"></div>
                 <span className="text-[9px] text-neutral-600 font-mono">GERMAN ENGINEERING // MODEL M3</span>
            </div>
          </div>

          {/* Decoding Screen */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Main Screen */}
            <div className="relative bg-black rounded-lg border-4 border-neutral-800 p-4 md:p-8 min-h-[220px] shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col justify-center items-center text-center overflow-hidden">
              {/* Screen Inner Shadow/Glow */}
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] pointer-events-none z-10 rounded-sm"></div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full z-10">
                   <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4"></div>
                   <div className="text-green-500 animate-pulse text-lg tracking-widest font-mono">ACQUIRING SIGNAL...</div>
                </div>
              ) : (
                <div className="w-full z-10 relative">
                  <div className="mb-2 text-[10px] text-green-800 font-mono uppercase tracking-widest text-left w-full border-b border-green-900/20 pb-1">
                      Output Stream
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-x-1 gap-y-2 leading-none py-4">
                    <ScrambledText 
                      text={decryptedAttempt} 
                      className={`text-2xl sm:text-3xl md:text-4xl font-bold font-['Special_Elite'] uppercase transition-all duration-300 ${isSolved ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-green-500/90 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`}
                    />
                  </div>
                  
                  {gameMode === 'puzzle' && !isSolved && (
                     <div className="mt-6 pt-4 border-t border-green-900/30 text-[10px] md:text-xs text-green-800 break-all font-mono select-none flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
                       <span className="text-[8px] uppercase tracking-widest mb-1 text-green-900 font-bold">Raw Intercept</span>
                       {encryptedText}
                     </div>
                  )}
                </div>
              )}

              {/* Win Overlay */}
              {isSolved && gameMode === 'puzzle' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 animate-fade-in backdrop-blur-sm p-4 rounded-sm">
                  <div className="text-center p-8 border-2 border-green-500 bg-green-900/10 rounded w-full max-w-sm shadow-[0_0_50px_rgba(34,197,94,0.2)] transform scale-100 animate-in zoom-in duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-[scanline_2s_linear_infinite]"></div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-['Orbitron'] tracking-tighter glitch" data-text="DECODED">DECODED</h2>
                    <p className="text-green-400 mb-8 font-sans text-sm tracking-widest uppercase">Intelligence Secured</p>
                    <button 
                      onClick={startNewGame}
                      className="w-full px-6 py-4 bg-green-600 hover:bg-green-500 text-black font-bold rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105 active:scale-95 tracking-wider"
                    >
                      NEXT INTERCEPT
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Tool */}
            <div className="relative">
              <FrequencyChart text={decryptedAttempt} />
            </div>

            {/* Controls */}
            <div className="flex justify-between md:justify-end gap-4 mt-2 px-2">
                <button 
                   onClick={() => setView('landing')}
                   className="md:hidden text-xs text-neutral-500 hover:text-white flex items-center gap-1"
                >
                  <span>&larr;</span> MENU
                </button>
                {gameMode === 'puzzle' && (
                  <button 
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-xs text-green-800 hover:text-green-500 underline decoration-dotted transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                    disabled={loading || isSolved}
                  >
                    {showSolution ? 'Hide Solution' : 'Request Decryption Key'}
                  </button>
                )}
            </div>
            
            {showSolution && !isSolved && gameMode === 'puzzle' && (
               <div className="bg-red-900/10 border border-red-500/30 p-4 text-xs text-red-400 text-center font-mono rounded animate-fade-in shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <span className="font-bold block mb-1 text-red-500 uppercase tracking-widest">⚠️ CLASSIFIED INTEL EXPOSED</span>
                  {puzzle?.message}
               </div>
            )}

          </div>
        </div>
      </main>

      {/* Game Footer */}
      <footer className="w-full p-4 text-center text-[10px] md:text-xs text-neutral-600 border-t border-neutral-800 z-10 bg-black font-sans">
        <p className="opacity-50 hover:opacity-100 transition-opacity">ENIGMA SIMULATOR // CLASSIFIED MATERIAL // DO NOT DISTRIBUTE // <a href="https://vickyiitp.tech" target="_blank" className="hover:text-green-500 transition-colors">VICKYIITP</a></p>
      </footer>
    </div>
  );
};

export default App;