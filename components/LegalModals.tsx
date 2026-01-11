import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-green-500/30 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-green-500 font-['Orbitron']">{title}</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="Close Modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-neutral-300 font-sans text-sm leading-relaxed space-y-4">
          {content}
        </div>
        <div className="p-6 border-t border-white/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyContent = () => (
  <>
    <p><strong>1. Data Collection:</strong> We do not collect any personal data. This game runs entirely in your browser. No analytics or tracking cookies are used.</p>
    <p><strong>2. Local Storage:</strong> We may use local storage solely to save your game preferences (e.g., sound settings). This data never leaves your device.</p>
    <p><strong>3. External Services:</strong> This application interacts with Google Gemini API for generating puzzles. The content generated is processed transiently and is not stored by us.</p>
    <p><strong>4. Contact:</strong> For any privacy concerns, please contact themvaplatform@gmail.com.</p>
  </>
);

export const TermsContent = () => (
  <>
    <p><strong>1. Acceptance:</strong> By accessing Enigma Machine, you agree to these terms.</p>
    <p><strong>2. Usage:</strong> This game is for entertainment purposes only. Do not use the generated ciphers for securing sensitive real-world data.</p>
    <p><strong>3. Intellectual Property:</strong> The code, design, and assets are owned by Vicky Kumar (vickyiitp). You may view the source for educational purposes.</p>
    <p><strong>4. Disclaimer:</strong> The software is provided "as is", without warranty of any kind.</p>
  </>
);

export default Modal;