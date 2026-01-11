import React, { useState } from 'react';
import { ALPHABET } from '../constants';

interface RotorProps {
  id: number;
  position: number;
  onChange: (id: number, newPosition: number) => void;
  color: string;
}

const Rotor: React.FC<RotorProps> = ({ id, position, onChange, color }) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    // Prevent default scrolling behavior if needed, though usually handled by parent
    const delta = e.deltaY > 0 ? 1 : -1;
    rotate(delta);
  };

  const rotate = (delta: number) => {
    setIsRotating(true);
    // Remove rotating class after animation
    setTimeout(() => setIsRotating(false), 200);

    const newPos = ((position + delta) % 26 + 26) % 26;
    onChange(id, newPos);
  };

  const increment = () => rotate(1);
  const decrement = () => rotate(-1);

  // Calculate visible letters
  const prevChar = ALPHABET[(position - 1 + 26) % 26];
  const currChar = ALPHABET[position];
  const nextChar = ALPHABET[(position + 1) % 26];

  return (
    <div className="flex flex-col items-center mx-1 md:mx-2">
      <div className={`text-[9px] md:text-[10px] mb-2 font-bold tracking-[0.2em] opacity-70 ${color}`}>ROTOR 0{id + 1}</div>
      
      <div className="relative group perspective-[500px]">
        {/* Metal Casing */}
        <div 
            className="relative bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 border-x border-y border-neutral-700 rounded-lg w-16 md:w-20 h-24 md:h-32 flex flex-col items-center justify-center shadow-2xl select-none overflow-hidden"
            onWheel={handleWheel}
            role="group"
            aria-label={`Rotor ${id + 1} control`}
        >
            {/* Gear Teeth Visuals (Side) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,#333_5px)] opacity-50"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,#333_5px)] opacity-50"></div>

            {/* Shadows for depth */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black to-transparent opacity-80 pointer-events-none z-10"></div>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent opacity-80 pointer-events-none z-10"></div>
            
            {/* Click handlers overlay */}
            <button 
            onClick={decrement}
            className="absolute top-0 inset-x-0 h-10 flex items-start pt-1 justify-center text-neutral-600 hover:text-green-400 hover:bg-green-500/5 transition z-20 focus:outline-none"
            aria-label={`Rotate Rotor ${id + 1} Up`}
            >
            <span className="sr-only">Up</span>
            <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
            </button>
            <button 
            onClick={increment}
            className="absolute bottom-0 inset-x-0 h-10 flex items-end pb-1 justify-center text-neutral-600 hover:text-green-400 hover:bg-green-500/5 transition z-20 focus:outline-none"
            aria-label={`Rotate Rotor ${id + 1} Down`}
            >
            <span className="sr-only">Down</span>
            <svg className="w-4 h-4 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </button>

            {/* Letters Ring */}
            <div className={`flex flex-col items-center justify-center space-y-2 font-mono text-base md:text-xl transform transition-transform duration-200 ${isRotating ? 'scale-[0.98]' : 'scale-100'}`} aria-hidden="true">
                <span className="text-neutral-700 transform scale-75 opacity-50">{prevChar}</span>
                <div className="relative">
                    <span className={`block font-bold text-2xl md:text-3xl ${color} drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] bg-neutral-900/50 px-2 rounded`}>{currChar}</span>
                    <div className={`absolute -inset-1 rounded blur-md opacity-20 ${color.replace('text-', 'bg-')}`}></div>
                </div>
                <span className="text-neutral-700 transform scale-75 opacity-50">{nextChar}</span>
            </div>

            {/* Magnifying Glass Effect / Highlight Bar */}
            <div className="absolute top-1/2 left-0 right-0 h-10 -translate-y-1/2 border-y border-white/5 bg-white/5 pointer-events-none z-0"></div>
        </div>

        {/* Mechanical notches outside */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-neutral-800 border border-neutral-700 rounded-r shadow-lg"></div>
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-neutral-800 border border-neutral-700 rounded-l shadow-lg"></div>
      </div>

      <div className="mt-2 text-[9px] md:text-[10px] text-neutral-600 text-center font-mono">
        <span className="text-neutral-500">POS:</span> <span className="text-neutral-300">{position.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default Rotor;