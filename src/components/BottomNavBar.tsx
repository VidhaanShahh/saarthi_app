import React from 'react';
import { ScreenView } from '../types';

interface BottomNavBarProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentScreen, onNavigate }) => {
  // Hide on sub-screens like voice interaction or transactional dead ends if required
  if (['voice', 'human-help', 'listen-answer'].includes(currentScreen)) {
    return null;
  }

  const navItems = [
    { id: 'home' as ScreenView, label: 'Home', icon: 'home' },
    { id: 'my-questions' as ScreenView, label: 'My Questions', icon: 'question_answer' },
    { id: 'saved' as ScreenView, label: 'Saved', icon: 'bookmark' },
    { id: 'offline' as ScreenView, label: 'Offline', icon: 'offline_pin' },
    { id: 'profile' as ScreenView, label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-2 pb-safe h-20 bg-surface dark:bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_12px_0_rgba(27,67,50,0.05)] rounded-t-xl md:hidden">
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 transition-all duration-200 active:scale-90 ${
              isActive
                ? 'bg-secondary-container text-on-secondary-container font-label-bold rounded-full px-3.5 py-1'
                : 'text-on-surface-variant hover:opacity-80'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label-bold text-[10px] leading-tight mt-0.5 text-center whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
