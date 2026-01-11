import React, { useEffect, useState, useRef } from 'react';

interface ScrambledTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

const ScrambledText: React.FC<ScrambledTextProps> = ({ 
  text, 
  className = "", 
  scrambleSpeed = 30,
}) => {
  // We track the display text separately from the input text
  const [displayText, setDisplayText] = useState(text);
  const previousTextRef = useRef(text);
  
  useEffect(() => {
    // If text hasn't changed meaningfully (just re-render), do nothing
    if (text === previousTextRef.current) return;

    let iterations = 0;
    const maxIterations = 5; // How many "random" frames before locking in
    
    const interval = setInterval(() => {
      const newDisplay = text.split("").map((char, index) => {
        // If char matches target, keep it
        // Or if we've passed the iteration count for this position (staggered reveal)
        // But for enigma, all letters change at once usually.
        // Let's do a global scramble:
        if (char === " " || char === "\u00A0") return char;
        
        // Random chance to show the correct letter vs random garbage
        if (iterations >= maxIterations) {
            return char;
        }
        
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");

      setDisplayText(newDisplay);
      iterations++;

      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplayText(text); // Ensure final state is correct
      }
    }, scrambleSpeed);

    previousTextRef.current = text;
    return () => clearInterval(interval);
  }, [text, scrambleSpeed]);

  return (
    <span className={className}>
      {displayText.split("").map((char, i) => (
        <span key={i} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default ScrambledText;