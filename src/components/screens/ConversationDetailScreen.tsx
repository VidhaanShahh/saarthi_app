import React, { useState, useRef } from 'react';
import { ScreenView, QuestionItem } from '../../types';

interface ConversationDetailScreenProps {
  question: QuestionItem | null;
  onNavigate: (screen: ScreenView) => void;
  onSaveQuestion: (question: QuestionItem) => void;
  isSaved: boolean;
}

export const ConversationDetailScreen: React.FC<ConversationDetailScreenProps> = ({
  question,
  onNavigate,
  onSaveQuestion,
  isSaved
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showSimplified, setShowSimplified] = useState(false);
  const [followupInput, setFollowupInput] = useState('');
  const [showFollowupInput, setShowFollowupInput] = useState(false);

  if (!question) {
    return (
      <main className="w-full max-w-[800px] mx-auto mt-[80px] p-6 text-center">
        <p className="text-on-surface-variant">No question selected.</p>
        <button 
          onClick={() => onNavigate('home')} 
          className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-full"
        >
          Go Home
        </button>
      </main>
    );
  }

  // Simulate audio playback progress
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = `${question.question}. ${question.summary}. ${question.steps.map(s => `${s.number}. ${s.title}: ${s.description}`).join('. ')}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <main className="w-full max-w-[800px] mt-[80px] mx-auto px-container-padding py-stack-gap flex flex-col gap-6 pb-32">
      {/* User Question Bubble */}
      <div className="flex justify-end w-full">
        <div className="bg-primary-container text-on-primary-container p-5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-primary-fixed">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Saarthi Answer Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[16px] shadow-[0_4px_16px_rgba(27,67,50,0.06)] overflow-hidden flex flex-col w-full">
        {/* Trust Indicator Header */}
        <div className="bg-surface-container flex items-center justify-between px-6 py-3 border-b border-outline-variant">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-label-bold text-label-bold">Verified Information</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Source: {question.verifiedSource || 'Official Government Source'}
          </span>
        </div>

        {/* Audio Player Bar */}
        <div className="px-6 py-4 bg-inverse-on-surface flex items-center gap-4 border-b border-outline-variant">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex-shrink-0 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <div className="flex-grow flex flex-col gap-1">
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
              <span>0:00</span>
              <span>{question.audioDuration || '2:15'}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={audioProgress}
              onChange={(e) => setAudioProgress(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex-shrink-0 text-primary hover:bg-surface-variant rounded-full flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">volume_up</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          <p className="font-body-lg text-body-lg text-on-surface">
            {question.summary}
          </p>

          {/* Simplified Mode Banner */}
          {showSimplified && (
            <div className="bg-secondary-container/50 border border-secondary p-4 rounded-xl text-on-secondary-container animate-enter">
              <div className="flex items-center gap-2 mb-1 font-label-bold text-secondary">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>Simplified Explanation:</span>
              </div>
              <p className="font-body-md text-sm">{question.simplifiedSummary || question.summary}</p>
            </div>
          )}

          {/* Step-by-step list */}
          <ol className="flex flex-col gap-4">
            {question.steps.map((step) => (
              <li key={step.number} className="flex gap-4">
                <div className="w-8 h-8 flex-shrink-0 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center font-label-bold text-label-bold">
                  {step.number}
                </div>
                <div className="flex flex-col gap-1 pt-0.5">
                  <span className="font-label-bold text-label-bold text-on-surface">{step.title}</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">{step.description}</span>
                </div>
              </li>
            ))}
          </ol>

          {/* Follow-up Chips */}
          {question.followups && question.followups.length > 0 && (
            <div className="mt-2 pt-4 border-t border-outline-variant">
              <p className="text-xs font-label-bold text-outline uppercase tracking-wider mb-2">
                Suggested Follow-ups
              </p>
              <div className="flex flex-wrap gap-2">
                {question.followups.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFollowupInput(f);
                      setShowFollowupInput(true);
                    }}
                    className="text-xs font-label-bold bg-surface-container-high hover:bg-surface-variant text-primary px-3 py-1.5 rounded-full border border-outline-variant transition-colors"
                  >
                    "{f}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {showFollowupInput && (
            <div className="mt-2 p-3 bg-surface-container rounded-xl border border-outline-variant flex gap-2">
              <input
                type="text"
                value={followupInput}
                onChange={(e) => setFollowupInput(e.target.value)}
                placeholder="Ask follow-up question..."
                className="flex-1 bg-surface-container-lowest px-3 py-1.5 text-sm rounded-lg border border-outline-variant"
              />
              <button
                onClick={() => onNavigate('voice')}
                className="bg-primary text-on-primary text-xs font-label-bold px-4 py-1.5 rounded-lg"
              >
                Ask
              </button>
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onNavigate('listen-answer')}
            className="h-[56px] flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-primary font-label-bold text-label-bold active:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">menu_book</span>
            Read Along
          </button>

          <button 
            onClick={() => onSaveQuestion(question)}
            className={`h-[56px] flex items-center justify-center gap-2 rounded-xl font-label-bold text-label-bold transition-colors ${
              isSaved
                ? 'bg-secondary-container text-on-secondary-container border border-secondary'
                : 'bg-surface-container-lowest border border-outline-variant text-primary active:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
              star
            </span>
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button 
            onClick={() => setShowSimplified(!showSimplified)}
            className="h-[56px] flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-primary font-label-bold text-label-bold active:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">psychology</span>
            {showSimplified ? 'Standard View' : 'Explain Simpler'}
          </button>

          <button 
            onClick={() => setShowFollowupInput(!showFollowupInput)}
            className="h-[56px] flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-primary font-label-bold text-label-bold active:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">forum</span>
            Ask Follow-up
          </button>
        </div>
      </div>

      {/* Escalation / Help */}
      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant">Need more help with this issue?</p>
        <button 
          onClick={() => onNavigate('human-help')}
          className="h-[56px] px-8 bg-surface-container-lowest border-2 border-primary text-primary rounded-full font-label-bold text-label-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">support_agent</span>
          Talk to a Human
        </button>
      </div>
    </main>
  );
};
