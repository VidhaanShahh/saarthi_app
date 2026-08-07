import React, { useState } from 'react';
import { ScreenView, QuestionItem } from '../../types';

interface HumanHelpScreenProps {
  question: QuestionItem | null;
  onNavigate: (screen: ScreenView) => void;
  onGoBack: () => void;
}

export const HumanHelpScreen: React.FC<HumanHelpScreenProps> = ({ question, onNavigate, onGoBack }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);

  const handleStartCall = () => {
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setCallConnected(true);
    }, 2500);
  };

  return (
    <main className="flex-grow w-full max-w-[800px] mx-auto px-container-padding pt-[80px] md:pt-[100px] pb-32">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-3 shadow-sm">
          <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            support_agent
          </span>
        </div>
        <h1 className="font-headline-md text-headline-md text-primary mb-2">
          Let's make sure you get the right help.
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
          Saarthi connects you directly to verified local legal aid paralegals, District Legal Services Authority (DLSA), and government helpline officers.
        </p>
      </div>

      {/* Simulated Call Modal */}
      {(isCalling || callConnected) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-8 shadow-2xl text-center flex flex-col items-center gap-6 animate-enter border border-outline-variant">
            {isCalling ? (
              <>
                <div className="w-20 h-20 rounded-full bg-secondary text-on-secondary flex items-center justify-center animate-ping">
                  <span className="material-symbols-outlined text-4xl">phone_in_talk</span>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-primary">Connecting to Legal Aid Officer...</p>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">Dialing National Legal Helpline 15100</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">support_agent</span>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-primary">Call Connected!</p>
                  <p className="font-body-md text-sm text-on-surface mt-1">
                    You are talking with Advocate Sharma (DLSA Legal Aid Officer).
                  </p>
                </div>
                <div className="bg-surface-container-high p-4 rounded-xl text-left text-xs space-y-1">
                  <p className="font-bold">Case Reference ID: #SAR-88392</p>
                  <p className="text-on-surface-variant">Question: "{question?.question || 'Legal Assistance'}"</p>
                </div>
                <button
                  onClick={() => setCallConnected(false)}
                  className="w-full py-3 bg-error text-on-error rounded-xl font-label-bold"
                >
                  End Helpline Call
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Details Cards */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <p className="font-label-bold text-xs text-secondary uppercase tracking-wider mb-1">YOUR QUESTION</p>
          <p className="font-body-lg text-body-lg text-on-surface font-semibold">
            {question ? question.question : 'How to file an FIR?'}
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <p className="font-label-bold text-xs text-secondary uppercase tracking-wider mb-1">WHAT SAARTHI UNDERSTOOD</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {question ? question.summary : 'Assistance with police station First Information Report registration and legal rights.'}
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <p className="font-label-bold text-xs text-secondary uppercase tracking-wider mb-1">VERIFIED HELPLINES AVAILABLE</p>
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg text-sm">
              <span className="font-medium">National Legal Services Authority (NALSA)</span>
              <span className="font-bold text-secondary">15100</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg text-sm">
              <span className="font-medium">Women Helpline</span>
              <span className="font-bold text-secondary">1091</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-lg text-sm">
              <span className="font-medium">Police National Emergency</span>
              <span className="font-bold text-secondary">112</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleStartCall}
          className="w-full h-[56px] bg-secondary text-on-secondary rounded-full font-label-bold text-label-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#005235] transition-colors active:scale-[0.98] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">call</span>
          Connect to Legal Aid Helpline
        </button>

        <button
          onClick={() => onNavigate('conversation-detail')}
          className="w-full h-[56px] bg-surface-container-lowest border border-outline-variant text-primary rounded-full font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">psychology</span>
          Explain Differently
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="w-full h-[56px] bg-transparent text-on-surface-variant font-label-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-variant rounded-full"
        >
          Try Another Question
        </button>
      </div>
    </main>
  );
};
