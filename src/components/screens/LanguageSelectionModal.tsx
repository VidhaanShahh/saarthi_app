import React from 'react';
import { Language } from '../../types';

interface LanguageSelectionModalProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onClose: () => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onClose
}) => {
  const languages: { id: Language; label: string; native: string; flag: string }[] = [
    { id: 'Marathi', label: 'Marathi', native: 'मराठी', flag: '🚩' },
    { id: 'Hindi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { id: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી', flag: '🌾' },
    { id: 'Bengali', label: 'Bengali', native: 'বাংলা', flag: '🌊' },
    { id: 'Tamil', label: 'Tamil', native: 'தமிழ்', flag: '🏛️' },
    { id: 'Telugu', label: 'Telugu', native: 'తెలుగు', flag: '🏺' },
    { id: 'English', label: 'English', native: 'English', flag: '🌐' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-surface rounded-t-2xl sm:rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-outline-variant flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-enter">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">Choose your language</h2>
            <p className="font-body-md text-xs text-on-surface-variant">You can change this anytime.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border flex flex-col items-start gap-1 text-left transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container border-secondary font-bold shadow-sm'
                    : 'bg-surface-container-lowest border-outline-variant hover:border-secondary text-on-surface'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xl">{lang.flag}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                </div>
                <span className="font-headline-md text-base mt-1">{lang.native}</span>
                <span className="font-label-sm text-xs opacity-70">{lang.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-primary text-on-primary rounded-xl font-label-bold text-sm shadow-sm"
        >
          Confirm Language
        </button>
      </div>
    </div>
  );
};
