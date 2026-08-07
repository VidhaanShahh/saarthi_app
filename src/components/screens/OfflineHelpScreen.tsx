import React, { useState } from 'react';
import { ScreenView, OfflineGuide } from '../../types';

interface OfflineHelpScreenProps {
  onNavigate: (screen: ScreenView) => void;
  guides: OfflineGuide[];
}

export const OfflineHelpScreen: React.FC<OfflineHelpScreenProps> = ({ onNavigate, guides }) => {
  const [selectedGuide, setSelectedGuide] = useState<OfflineGuide | null>(null);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(true);

  return (
    <main className="flex-grow w-full max-w-[800px] mx-auto px-container-padding pt-[80px] md:pt-[100px] pb-32">
      {/* Offline Alert Banner */}
      <div className={`p-4 rounded-xl flex items-center justify-between gap-3 mb-6 transition-colors border ${
        isSimulatedOffline 
          ? 'bg-error-container/80 text-on-error-container border-error/30' 
          : 'bg-secondary-container text-on-secondary-container border-secondary/30'
      }`}>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px]">
            {isSimulatedOffline ? 'wifi_off' : 'wifi'}
          </span>
          <div>
            <p className="font-label-bold text-label-bold flex items-center gap-1.5">
              <span>●</span> {isSimulatedOffline ? "You're Offline" : "Connected Online"}
            </p>
            <p className="font-label-sm text-xs opacity-90">
              {isSimulatedOffline 
                ? 'Essential guides and saved voice answers are cached on your device.' 
                : 'All features and live Gemini AI model are active.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
          className="text-xs font-label-bold px-3 py-1.5 rounded-full border border-current hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          {isSimulatedOffline ? 'Go Online' : 'Simulate Offline'}
        </button>
      </div>

      {/* Detail Modal if guide selected */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant flex flex-col gap-4 animate-enter">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2 text-primary font-headline-md text-headline-md">
                <span className="material-symbols-outlined text-secondary">{selectedGuide.icon}</span>
                <span>{selectedGuide.title}</span>
              </div>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
              {selectedGuide.content}
            </p>

            <button
              onClick={() => setSelectedGuide(null)}
              className="mt-2 w-full py-2.5 bg-primary text-on-primary rounded-xl font-label-bold"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* Available Without Internet */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
            offline_pin
          </span>
          <h2 className="font-headline-md text-headline-md text-primary">Available Without Internet</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="card-level-1 p-5 flex items-start gap-4 cursor-pointer hover:border-secondary transition-all active:scale-[0.99]"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">{guide.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-label-bold text-label-bold text-on-surface">{guide.title}</h3>
                  <span className="text-xs bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full">
                    {guide.category}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {guide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Requires Internet */}
      <section className="opacity-60">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-outline">wifi</span>
          <h2 className="font-headline-md text-headline-md text-outline">Requires Internet</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-dashed border-outline-variant rounded-xl p-5 bg-surface-container-low flex items-center gap-4">
            <span className="material-symbols-outlined text-outline text-3xl">record_voice_over</span>
            <div>
              <h3 className="font-label-bold text-label-bold text-outline">Ask New AI Voice Question</h3>
              <p className="font-body-md text-xs text-outline mt-0.5">Live Gemini response requires active network.</p>
            </div>
          </div>

          <div className="border border-dashed border-outline-variant rounded-xl p-5 bg-surface-container-low flex items-center gap-4">
            <span className="material-symbols-outlined text-outline text-3xl">translate</span>
            <div>
              <h3 className="font-label-bold text-label-bold text-outline">Live Voice Translation</h3>
              <p className="font-body-md text-xs text-outline mt-0.5">Cloud translation service needed.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
