import { ALPHABET } from "../constants";

// Helper to sanitize input
export const cleanText = (text: string): string => {
  return text.toUpperCase().replace(/[^A-Z]/g, "");
};

// Polyalphabetic substitution (Vigenère-like) based on rotor positions
// In this game, each of the 3 rotors controls the shift for a specific position in the cycle (modulo 3).
// Rotor 1 controls index 0, 3, 6...
// Rotor 2 controls index 1, 4, 7...
// Rotor 3 controls index 2, 5, 8...
export const encryptMessage = (message: string, rotorSettings: number[]): string => {
  const chars = message.toUpperCase().split("");
  const result = chars.map((char, index) => {
    if (!ALPHABET.includes(char)) return char; // Keep spaces/punctuation
    
    // We only count alphabetic characters for the rotation index to keep words recognizable
    // Actually, to make it harder/more realistic, usually spaces are removed. 
    // BUT for gameplay fun, we'll keep spaces but NOT shift them, and NOT increment the rotor index on them.
    // Let's stick to a simpler model: Index based on position in string including spaces? 
    // No, index based on ALPHABETIC index.
    
    const alphaIndex = ALPHABET.indexOf(char);
    // Determine which rotor applies. We count only letters found so far? 
    // Let's use simple string index for deterministic behavior that's easy to understand visually.
    const rotorIndex = index % 3; 
    const shift = rotorSettings[rotorIndex];
    
    const newIndex = (alphaIndex + shift) % 26;
    return ALPHABET[newIndex];
  });
  
  return result.join("");
};

// Decrypt is just shifting backwards
export const decryptMessage = (encryptedMessage: string, rotorSettings: number[]): string => {
  const chars = encryptedMessage.toUpperCase().split("");
  
  return chars.map((char, index) => {
    if (!ALPHABET.includes(char)) return char;
    
    const alphaIndex = ALPHABET.indexOf(char);
    const rotorIndex = index % 3;
    const shift = rotorSettings[rotorIndex];
    
    // Javascript modulo bug with negative numbers: ((n % m) + m) % m
    const newIndex = ((alphaIndex - shift) % 26 + 26) % 26;
    return ALPHABET[newIndex];
  }).join("");
};

// Generate a random key for the puzzle
export const generateRandomKey = (): number[] => {
  return [
    Math.floor(Math.random() * 26),
    Math.floor(Math.random() * 26),
    Math.floor(Math.random() * 26)
  ];
};
