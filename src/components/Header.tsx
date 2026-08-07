import React from 'react';
import { ScreenView, Language } from '../types';
import { SaarthiLogo } from './SaarthiLogo';

interface HeaderProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  selectedLanguage: Language;
  onOpenLanguageModal: () => void;
  onGoBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  selectedLanguage,
  onOpenLanguageModal,
  onGoBack
}) => {
  // Translate language display label
  const languageLabels: Record<Language, string> = {
    Marathi: 'मराठी',
    Hindi: 'हिन्दी',
    Gujarati: 'ગુજરાતી',
    Bengali: 'বাংলা',
    Tamil: 'தமிழ்',
    Telugu: 'తెలుగు',
    English: 'English'
  };

  const isSubPage = [
    'voice', 
    'conversation-detail', 
    'listen-answer', 
    'explain-this', 
    'language-selection', 
    'human-help'
  ].includes(currentScreen);

  return (
    <>
      {/* Mobile TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-container-padding h-touch-target-min bg-surface dark:bg-surface-dim border-b border-outline-variant shadow-sm transition-all duration-200 md:hidden">
        <div className="flex items-center gap-2">
          {isSubPage ? (
            <button
              onClick={() => onGoBack ? onGoBack() : onNavigate('home')}
              aria-label="Go back"
              className="w-10 h-10 -ml-2 flex items-center justify-center text-primary hover:bg-surface-variant rounded-full transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined">
                {currentScreen === 'voice' ? 'close' : 'arrow_back'}
              </span>
            </button>
          ) : (
            <button 
              onClick={onOpenLanguageModal}
              className="p-1 rounded-full hover:bg-surface-variant transition-colors"
              aria-label="Select Language"
            >
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                language
              </span>
            </button>
          )}

          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer flex items-center"
          >
            <SaarthiLogo size="sm" showText={true} />
          </div>
        </div>

        <button
          onClick={onOpenLanguageModal}
          className="font-label-bold text-label-bold text-primary dark:text-primary-fixed-dim hover:bg-surface-variant px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 border border-primary/20"
        >
          {languageLabels[selectedLanguage] || selectedLanguage}
        </button>
      </header>

      {/* Desktop TopAppBar (Visible on md+) */}
      <header className="hidden md:flex fixed top-0 left-0 w-full z-50 justify-between items-center px-container-padding h-20 bg-surface shadow-sm border-b border-outline-variant">
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <SaarthiLogo size="lg" showText={true} />
        </div>

        <nav className="flex gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`font-label-bold text-label-bold px-4 py-2 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              currentScreen === 'home'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Home
          </button>

          <button
            onClick={() => onNavigate('my-questions')}
            className={`font-label-bold text-label-bold px-4 py-2 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              currentScreen === 'my-questions'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">question_answer</span>
            My Questions
          </button>

          <button
            onClick={() => onNavigate('saved')}
            className={`font-label-bold text-label-bold px-4 py-2 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              currentScreen === 'saved'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            Saved
          </button>

          <button
            onClick={() => onNavigate('offline')}
            className={`font-label-bold text-label-bold px-4 py-2 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              currentScreen === 'offline'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">offline_pin</span>
            Offline
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`font-label-bold text-label-bold px-4 py-2 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-2 ${
              currentScreen === 'profile'
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Profile
          </button>
        </nav>

        <button
          onClick={onOpenLanguageModal}
          className="font-label-bold text-label-bold text-primary border border-primary rounded-full px-4 py-2 hover:bg-surface-variant transition-all duration-200 active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">language</span>
          <span>{languageLabels[selectedLanguage] || selectedLanguage}</span>
        </button>
      </header>
    </>
  );
};
