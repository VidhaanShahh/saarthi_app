import React from 'react';
import { ScreenView, QuestionItem, Language } from '../../types';

interface HomeScreenProps {
  onNavigate: (screen: ScreenView) => void;
  questions: QuestionItem[];
  onSelectQuestion: (question: QuestionItem) => void;
  selectedLanguage: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  questions,
  onSelectQuestion,
  selectedLanguage
}) => {
  return (
    <main className="flex-grow pt-[80px] md:pt-[100px] px-container-padding max-w-[800px] mx-auto w-full flex flex-col gap-stack-gap pb-28">
      {/* Greeting */}
      <section className="text-center pt-4 pb-2">
        <h2 className="bold-headline mb-2">
          How can we help you today?
        </h2>
        <p className="font-bold text-base md:text-lg text-[#006c48]">
          Your voice assistant for legal rights, FIRs & welfare schemes
        </p>
      </section>

      {/* Voice Interaction Hub */}
      <section className="flex flex-col items-center justify-center py-6">
        <div className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#006c48] rounded-full opacity-20 pulse-ring pointer-events-none"></div>
          <div className="absolute inset-2 bg-[#006c48] rounded-full opacity-30 pulse-ring pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
          
          <button 
            onClick={() => onNavigate('voice')}
            aria-label="Tap to speak"
            className="relative z-10 w-28 h-28 md:w-36 md:h-36 bg-[#006c48] text-white rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(0,108,72,0.25)] active:scale-95 transition-transform duration-200 hover:opacity-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[48px] md:text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              mic
            </span>
          </button>
        </div>
        
        <div className="text-center mt-6">
          <span className="status-pill mb-2">Active Session</span>
          <p className="font-bold text-xl text-[#012d1d] mt-2 mb-1">Listening for your voice...</p>
          <p className="font-medium text-sm text-[#717973]">
            Ask in your own language ({selectedLanguage})
          </p>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Ask Saarthi */}
        <button 
          onClick={() => onNavigate('voice')}
          className="bold-card flex flex-col items-center justify-center gap-2 hover:border-[#006c48] transition-colors active:scale-95 cursor-pointer text-left"
        >
          <div className="w-12 h-12 rounded-full bg-[#012d1d] text-white flex items-center justify-center mb-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              support_agent
            </span>
          </div>
          <span className="font-bold text-sm text-[#012d1d] text-center">Ask Saarthi</span>
        </button>

        {/* Explain This */}
        <button 
          onClick={() => onNavigate('explain-this')}
          className="bold-card flex flex-col items-center justify-center gap-2 hover:border-[#006c48] transition-colors active:scale-95 cursor-pointer text-left"
        >
          <div className="w-12 h-12 rounded-full bg-[#00405c] text-white flex items-center justify-center mb-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              lightbulb
            </span>
          </div>
          <span className="font-bold text-sm text-[#012d1d] text-center">Explain This</span>
        </button>

        {/* Saved Information */}
        <button 
          onClick={() => onNavigate('saved')}
          className="bold-card flex flex-col items-center justify-center gap-2 hover:border-[#006c48] transition-colors active:scale-95 cursor-pointer text-left"
        >
          <div className="w-12 h-12 rounded-full bg-[#e2e3db] text-[#1a1c18] flex items-center justify-center mb-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              bookmark
            </span>
          </div>
          <span className="font-bold text-sm text-[#012d1d] text-center">Saved Info</span>
        </button>

        {/* Offline Help */}
        <button 
          onClick={() => onNavigate('offline')}
          className="bold-card flex flex-col items-center justify-center gap-2 hover:border-[#006c48] transition-colors active:scale-95 cursor-pointer text-left"
        >
          <div className="w-12 h-12 rounded-full bg-[#e2e3db] text-[#1a1c18] flex items-center justify-center mb-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              offline_bolt
            </span>
          </div>
          <span className="font-bold text-sm text-[#012d1d] text-center">Offline Help</span>
        </button>
      </section>

      {/* Recent Questions */}
      <section className="bold-card mt-2">
        <div className="flex items-center justify-between mb-4 border-b border-[#e2e3db] pb-3">
          <div>
            <span className="bold-label">Recent Conversations</span>
            <h3 className="font-bold text-xl text-[#012d1d]">History</h3>
          </div>
          <button 
            onClick={() => onNavigate('my-questions')}
            className="text-[#006c48] font-bold text-xs uppercase tracking-wider hover:underline"
          >
            View All
          </button>
        </div>

        <div className="flex flex-col">
          {questions.slice(0, 3).map((item, idx) => (
            <button
              key={item.id}
              onClick={() => onSelectQuestion(item)}
              className={`flex items-center justify-between py-3.5 hover:bg-[#f3f4ec] px-3 -mx-1 rounded-2xl transition-colors active:scale-[0.99] text-left ${
                idx < questions.length - 1 ? 'border-b border-[#e2e3db]' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 text-[#006c48]">
                  <span className="material-symbols-outlined">
                    {item.sourceType === 'PHONE' ? 'chat' : item.sourceType === 'APP' ? 'history' : 'description'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1a1c18]">{item.question}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bold-label !mb-0">{item.date}</span>
                    <span className="w-1 h-1 rounded-full bg-[#717973]"></span>
                    <span className="bold-label !mb-0">{item.language}</span>
                    <span className="w-1 h-1 rounded-full bg-[#717973]"></span>
                    <span className="bold-label !mb-0 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">
                        {item.sourceType === 'PHONE' ? 'smartphone' : item.sourceType === 'APP' ? 'apps' : 'sms'}
                      </span>
                      {item.sourceType}
                    </span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973]">chevron_right</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};
