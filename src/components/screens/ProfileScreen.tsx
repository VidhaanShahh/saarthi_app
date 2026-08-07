import React, { useState } from 'react';
import { ScreenView, UserProfile, Language } from '../../types';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenView) => void;
  selectedLanguage: Language;
  onOpenLanguageModal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  selectedLanguage,
  onOpenLanguageModal
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ramesh Patil',
    phone: '+91 98234 56789',
    preferredLanguage: selectedLanguage,
    explanationStyle: 'Simple',
    notifications: true,
    isOnline: true
  });

  const [showAbout, setShowAbout] = useState(false);

  return (
    <main className="flex-grow w-full max-w-[800px] mx-auto px-container-padding pt-[80px] md:pt-[100px] pb-32">
      {/* Profile Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary font-headline-lg flex items-center justify-center text-2xl font-bold shrink-0">
          RP
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md text-primary">{profile.name}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">{profile.phone}</p>
          <span className="inline-block mt-1 text-xs font-label-bold bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full">
            Verified Citizen Account
          </span>
        </div>
      </div>

      {/* Settings Options */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col divide-y divide-outline-variant mb-6">
        {/* Preferred Language */}
        <button
          onClick={onOpenLanguageModal}
          className="p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">language</span>
            <div>
              <p className="font-label-bold text-label-bold text-on-surface">Preferred Language</p>
              <p className="font-body-md text-xs text-on-surface-variant">Voice and UI responses in {selectedLanguage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-bold text-sm text-secondary">{selectedLanguage}</span>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>
        </button>

        {/* Explanation Style */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">psychology</span>
            <div>
              <p className="font-label-bold text-label-bold text-on-surface">Explanation Depth</p>
              <p className="font-body-md text-xs text-on-surface-variant">
                {profile.explanationStyle === 'Simple' ? 'Simple ELI5 bullet points' : 'Detailed legal breakdown'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setProfile({
              ...profile,
              explanationStyle: profile.explanationStyle === 'Simple' ? 'Detailed' : 'Simple'
            })}
            className="px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant font-label-bold text-xs"
          >
            {profile.explanationStyle}
          </button>
        </div>

        {/* Notifications */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">notifications</span>
            <div>
              <p className="font-label-bold text-label-bold text-on-surface">Voice & Scheme Alerts</p>
              <p className="font-body-md text-xs text-on-surface-variant">Receive updates on FIR status & welfare forms</p>
            </div>
          </div>
          <button
            onClick={() => setProfile({ ...profile, notifications: !profile.notifications })}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
              profile.notifications ? 'bg-secondary' : 'bg-outline-variant'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              profile.notifications ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Sync Status */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">cloud_sync</span>
            <div>
              <p className="font-label-bold text-label-bold text-on-surface">Offline Sync Status</p>
              <p className="font-body-md text-xs text-on-surface-variant">Last synced today at 10:15 AM</p>
            </div>
          </div>
          <span className="text-xs font-label-bold bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full">
            Up to date
          </span>
        </div>

        {/* About Saarthi */}
        <button
          onClick={() => setShowAbout(true)}
          className="p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">info</span>
            <div>
              <p className="font-label-bold text-label-bold text-on-surface">About Saarthi</p>
              <p className="font-body-md text-xs text-on-surface-variant">Voice-first legal & welfare assistant v2.4</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-enter">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h2 className="font-headline-md text-headline-md text-primary">About Saarthi</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="font-body-md text-sm text-on-surface leading-relaxed">
              Saarthi is designed to bridge the digital and literacy divide for millions of citizens across India. Powered by multimodal Google Gemini models, Saarthi provides voice-first, verified legal guidance, FIR registration procedures, and government scheme navigation in multiple regional Indian languages.
            </p>

            <button
              onClick={() => setShowAbout(false)}
              className="w-full py-2.5 bg-primary text-on-primary rounded-xl font-label-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Button */}
      <button 
        onClick={() => onNavigate('home')}
        className="w-full py-3.5 bg-surface-container-lowest border border-error/30 text-error rounded-xl font-label-bold text-sm hover:bg-error-container/30 transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Sign Out Account
      </button>
    </main>
  );
};
