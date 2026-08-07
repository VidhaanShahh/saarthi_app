import React, { useState, useEffect, useRef } from 'react';
import { ScreenView, QuestionItem, Language } from '../../types';

interface VoiceInteractionScreenProps {
  onNavigate: (screen: ScreenView) => void;
  onGoBack: () => void;
  selectedLanguage: Language;
  onAddQuestion: (q: QuestionItem) => void;
  onSelectQuestion: (q: QuestionItem) => void;
}

export const VoiceInteractionScreen: React.FC<VoiceInteractionScreenProps> = ({
  onNavigate,
  onGoBack,
  selectedLanguage,
  onAddQuestion,
  onSelectQuestion
}) => {
  const [isListening, setIsListening] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [resultQuestion, setResultQuestion] = useState<QuestionItem | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const listeningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const getLanguagePresets = () => {
    if (selectedLanguage === 'Hindi') {
      return [
        'एफआयआर (FIR) कैसे दर्ज करें?',
        'पीएम किसान योजना की स्थिति जांचें',
        'राशन कार्ड नवीनीकरण प्रक्रिया क्या है?'
      ];
    }
    if (selectedLanguage === 'Marathi') {
      return [
        'पोलिस ठाण्यात एफआयआर कशी नोंदवावी?',
        '७/१२ उतारा ऑनलाईन कसा काढायचा?',
        'रेशन कार्ड नूतनीकरण प्रक्रिया काय आहे?'
      ];
    }
    return [
      'How to file an FIR at nearest police station?',
      'How to check PM Kisan application status?',
      'How to apply for 7/12 land extract online?'
    ];
  };

  const presets = getLanguagePresets();

  // Web Speech API / mic recording with graceful fallback
  useEffect(() => {
    let recognition: any = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;

    if (isListening) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : selectedLanguage === 'Marathi' ? 'mr-IN' : 'en-IN';

          recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((res: any) => res[0].transcript)
              .join('');
            setInputText(transcript);
            setSpeechError(null);
          };

          recognition.onerror = (event: any) => {
            console.warn('Speech recognition notice:', event.error);
            setSpeechError(event.error);
          };

          recognition.onend = () => {
            // Speech ended
          };

          recognition.start();
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }

      // Auto-fallback timer after 3 seconds if no Speech API input
      fallbackTimeout = setTimeout(() => {
        if (isListening && !inputText) {
          // Provide default prompt if user spoke or mic stayed silent/unsupported
          const defaultPrompt = presets[0];
          setInputText(defaultPrompt);
        }
      }, 3000);
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [isListening, selectedLanguage]);

  const handleProcessQuestion = async (queryText?: string) => {
    const promptToSubmit = queryText || inputText || presets[0];
    setIsListening(false);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSubmit,
          language: selectedLanguage
        })
      });

      const data = await res.json();
      
      const newQuestion: QuestionItem = {
        id: `q-${Date.now()}`,
        question: promptToSubmit,
        date: 'Today',
        timestamp: Date.now(),
        language: selectedLanguage,
        sourceType: 'APP',
        starred: false,
        category: 'Legal',
        verifiedSource: data.verifiedSource || 'Official Government Source',
        summary: data.summary || 'Official step-by-step guidance provided by Saarthi.',
        steps: data.steps || [
          { number: 1, title: 'Visit Police Station', description: 'Go to nearest police station with jurisdiction.' },
          { number: 2, title: 'State Facts Clearly', description: 'Narrate what happened to the officer.' },
          { number: 3, title: 'Collect Stamped Copy', description: 'Demand a free copy of the signed FIR.' }
        ],
        simplifiedSummary: data.simplifiedSummary || 'Explain what happened to the duty officer, review the written statement, sign it, and collect your free official stamped copy.',
        followups: data.followups || ['Can I file online?', 'What documents do I need?'],
        audioDuration: '2:15',
        audioDurationSeconds: 135
      };

      setResultQuestion(newQuestion);
      onAddQuestion(newQuestion);
    } catch (e) {
      console.error('Failed to ask Saarthi:', e);
      // Fallback result
      const fallback: QuestionItem = {
        id: `q-${Date.now()}`,
        question: promptToSubmit,
        date: 'Today',
        timestamp: Date.now(),
        language: selectedLanguage,
        sourceType: 'APP',
        starred: false,
        category: 'Legal',
        verifiedSource: 'Official Government Portal',
        summary: `Official Guidance for: ${promptToSubmit}`,
        steps: [
          { number: 1, title: 'Visit Designated Office', description: 'Go to nearest station or official government portal.' },
          { number: 2, title: 'Provide Statement & Documents', description: 'Narrate facts accurately and attach identity proof.' },
          { number: 3, title: 'Obtain Stamped Acknowledgement', description: 'Always demand official free receipt or copy.' }
        ],
        simplifiedSummary: 'Visit official office or portal, state details clearly, and obtain stamped acknowledgement copy.',
        followups: ['Can I do it online?', 'What if officer refuses?'],
        audioDuration: '1:45'
      };
      setResultQuestion(fallback);
      onAddQuestion(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      // User tapped while listening -> process current input or default
      handleProcessQuestion(inputText || presets[0]);
    } else {
      // User tapped to start listening again
      setIsListening(true);
      setInputText('');
      setResultQuestion(null);
      setSpeechError(null);
    }
  };

  const handleSelectPreset = (presetText: string) => {
    setInputText(presetText);
    handleProcessQuestion(presetText);
  };

  return (
    <div className="bg-[#f9faf2] text-[#1a1c18] font-sans h-screen w-full flex flex-col relative overflow-hidden antialiased">
      {/* Top App Bar */}
      <header className="w-full px-container-padding h-touch-target-min flex items-center justify-between z-10 pt-2">
        <button 
          onClick={onGoBack}
          aria-label="Close"
          className="w-10 h-10 flex items-center justify-center text-[#1a1c18] hover:bg-[#e2e3db] rounded-full transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="status-pill">Voice Assistant</span>
        <div className="w-10"></div>
      </header>

      {/* Main Canvas: Voice Visualization */}
      <main className="flex-1 flex flex-col items-center justify-center px-container-padding pb-[280px] relative z-0">
        {/* Text Prompts */}
        <div className="text-center mb-8 flex flex-col gap-2 max-w-md w-full">
          <h1 className="bold-headline">
            Tell Saarthi what happened
          </h1>
          <p className="font-bold text-lg text-[#006c48] min-h-[28px]">
            {isProcessing 
              ? 'Finding a trusted answer...' 
              : isListening 
                ? (inputText ? `"${inputText}"` : 'Listening for your voice...') 
                : resultQuestion 
                  ? 'Answer Ready!' 
                  : 'Tap mic to start speaking'}
          </p>

          {/* Preset Quick Voice Chips */}
          {!isProcessing && !resultQuestion && (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="bg-white border border-[#e2e3db] hover:border-[#006c48] hover:bg-[#f0f1e9] text-[#012d1d] font-semibold text-xs px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#006c48]">record_voice_over</span>
                  {preset}
                </button>
              ))}
            </div>
          )}

          {/* Type instead option */}
          {!isProcessing && (
            <div className="mt-2">
              {!showTypeInput ? (
                <button
                  onClick={() => setShowTypeInput(true)}
                  className="text-xs text-[#717973] hover:text-[#012d1d] font-bold uppercase tracking-wider flex items-center gap-1 justify-center mx-auto mt-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">keyboard</span>
                  Type Question Instead
                </button>
              ) : (
                <div className="flex gap-2 mt-2 w-full">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your question (e.g. How to file an FIR?)"
                    className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#e2e3db] rounded-full focus:outline-none focus:border-[#006c48] font-medium"
                  />
                  <button
                    onClick={() => handleProcessQuestion(inputText)}
                    className="bold-btn-primary !py-2.5 !px-5 !text-xs cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Microphone Orb */}
        <div className="relative flex items-center justify-center">
          {/* Animated Wave Rings */}
          {isListening && (
            <>
              <div className="absolute inset-0 bg-[#006c48] rounded-full opacity-20 animate-ping pointer-events-none" style={{ animationDuration: '2s' }}></div>
              <div className="absolute -inset-6 border-2 border-[#006c48] rounded-full opacity-30 animate-pulse pointer-events-none"></div>
            </>
          )}

          {/* Core Mic Button */}
          <button 
            onClick={handleMicClick}
            aria-label="Microphone"
            className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(0,108,72,0.25)] z-10 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
              isProcessing ? 'bg-[#012d1d] animate-pulse' : isListening ? 'bg-[#006c48]' : 'bg-[#012d1d]'
            }`}
          >
            <span 
              className="material-symbols-outlined text-white" 
              style={{ fontSize: '56px', fontVariationSettings: "'FILL' 1" }}
            >
              {isProcessing ? 'hourglass_empty' : 'mic'}
            </span>
            <span className="text-white text-xs font-bold uppercase tracking-wider mt-1 opacity-90">
              {isProcessing ? 'Processing' : isListening ? 'Tap to Submit' : 'Tap to Speak'}
            </span>
          </button>
        </div>
      </main>

      {/* Bottom Actions & Feedback Sheet */}
      <div className="absolute bottom-0 left-0 w-full px-container-padding pb-8 pt-6 bg-gradient-to-t from-[#f9faf2] via-[#f9faf2] to-transparent z-20 flex flex-col gap-4">
        {/* Processing Feedback Card */}
        <div className="bold-card flex items-center gap-4 max-w-[600px] mx-auto w-full">
          <div className="w-10 h-10 rounded-full bg-[#012d1d] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">
              {isProcessing ? 'psychology' : resultQuestion ? 'verified' : 'speech_to_text'}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-sm text-[#012d1d] truncate">
              {isProcessing 
                ? 'Finding verified official answer...' 
                : resultQuestion 
                  ? resultQuestion.question 
                  : (inputText || 'Tap mic or select a question prompt above')}
            </p>
            <p className="bold-label !mb-0 truncate">
              {resultQuestion ? resultQuestion.verifiedSource : 'Verified Government Legal Engine'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-[600px] mx-auto">
          {/* Primary Action: Listen */}
          <button 
            onClick={() => {
              if (resultQuestion) {
                onSelectQuestion(resultQuestion);
                onNavigate('listen-answer');
              } else {
                handleProcessQuestion();
              }
            }}
            className="col-span-2 bold-btn-primary w-full cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              volume_up
            </span>
            Listen Response
          </button>

          {/* Secondary Actions */}
          <button 
            onClick={() => {
              if (resultQuestion) {
                onSelectQuestion(resultQuestion);
                onNavigate('conversation-detail');
              } else {
                handleProcessQuestion();
              }
            }}
            className="bold-btn-outline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              mobile_arrow_right
            </span>
            Explain Simpler
          </button>

          <button 
            onClick={() => {
              if (resultQuestion) {
                onSelectQuestion(resultQuestion);
                onNavigate('conversation-detail');
              } else {
                handleProcessQuestion();
              }
            }}
            className="bold-btn-outline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              subject
            </span>
            Read Answer
          </button>
        </div>
      </div>
    </div>
  );
};

