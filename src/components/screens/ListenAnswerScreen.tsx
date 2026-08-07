import React, { useState, useEffect } from 'react';
import { QuestionItem } from '../../types';

interface ListenAnswerScreenProps {
  question: QuestionItem | null;
  onGoBack: () => void;
}

export const ListenAnswerScreen: React.FC<ListenAnswerScreenProps> = ({ question, onGoBack }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const fallbackQuestionText = question
    ? `${question.summary} ${question.steps.map(s => `${s.title}: ${s.description}`).join(' ')}`
    : "To file a First Information Report (FIR), visit your nearest police station. It is best to go to the station with jurisdiction over the area where the incident occurred. You must provide all details of the incident clearly to the duty officer. The officer will write down your complaint. After it is written, they must read it back to you. Once you confirm the details are correct, sign the report and always ask for a free copy of the FIR.";

  const sentences = fallbackQuestionText.split(/(?<=[.!?])\s+/);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setHighlightIndex((prev) => (prev + 1) % sentences.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sentences.length]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.pause();
      } else {
        window.speechSynthesis.resume();
      }
    }
  };

  const handleReplay = () => {
    setHighlightIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      {/* Header */}
      <header className="w-full px-container-padding h-touch-target-min flex items-center justify-between border-b border-outline-variant bg-surface sticky top-0 z-40">
        <button 
          onClick={onGoBack}
          aria-label="Go Back"
          className="w-touch-target-min h-touch-target-min flex items-center justify-center text-primary hover:bg-surface-variant transition-colors rounded-full"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary text-center flex-grow">
          Listen to Answer
        </h1>

        <div className="w-touch-target-min h-touch-target-min flex items-center justify-center"></div>
      </header>

      <main className="flex-grow px-container-padding py-stack-gap flex flex-col max-w-[800px] mx-auto w-full pb-16">
        {/* Context Title */}
        <h2 className="font-headline-md text-headline-md text-on-background mb-4 text-center font-bold">
          {question ? question.question : 'How to file an FIR'}
        </h2>

        {/* Playback Visuals */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-stack-gap mb-stack-gap flex flex-col items-center">
          {/* Waveform Animation */}
          <div className="flex items-end justify-center h-24 gap-2 mb-stack-gap w-full overflow-hidden px-4 pt-4">
            {[100, 60, 80, 40, 90, 50, 70, 30, 80, 50, 90, 60, 70].map((h, i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{
                  height: isPlaying ? `${h}%` : '20%',
                  animationDelay: `${(i * 0.1) % 0.8}s`,
                  opacity: isPlaying ? 1 : 0.4
                }}
              />
            ))}
          </div>

          {/* Primary Playback Controls */}
          <div className="flex justify-center items-center gap-6 w-full my-2">
            <button 
              onClick={handleReplay}
              aria-label="Replay" 
              className="w-16 h-16 rounded-full flex items-center justify-center text-primary bg-surface-variant hover:bg-surface-dim transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-4xl">replay</span>
            </button>

            <button 
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'} 
              className="w-20 h-20 rounded-full flex items-center justify-center bg-primary text-on-primary hover:bg-on-primary-fixed-variant transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <button 
              onClick={handleTogglePlay}
              aria-label="Play" 
              className="w-16 h-16 rounded-full flex items-center justify-center text-primary bg-surface-variant hover:bg-surface-dim transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </button>
          </div>

          <div className="flex justify-center items-center gap-8 mt-2 w-full">
            <span className="font-label-bold text-label-bold text-on-surface-variant text-center w-16">Replay</span>
            <span className="font-label-bold text-label-bold text-primary text-center w-20">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
            <span className="font-label-bold text-label-bold text-on-surface-variant text-center w-16">Play</span>
          </div>
        </div>

        {/* Read Along Text Area */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-stack-gap flex-grow flex flex-col p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              menu_book
            </span>
            <h3 className="font-headline-md text-headline-md text-secondary font-bold">Read Along</h3>
          </div>

          <div className="font-body-lg text-body-lg text-on-surface space-y-4 leading-relaxed">
            <p>
              {sentences.map((sentence, idx) => (
                <span
                  key={idx}
                  className={`inline-block mr-1 transition-all duration-300 rounded ${
                    idx === highlightIndex ? 'highlight-text scale-[1.01]' : ''
                  }`}
                >
                  {sentence}{' '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
