import React, { useState } from 'react';
import { ScreenView, QuestionItem } from '../../types';

interface MyQuestionsScreenProps {
  onNavigate: (screen: ScreenView) => void;
  questions: QuestionItem[];
  onSelectQuestion: (question: QuestionItem) => void;
  onToggleStar: (id: string) => void;
}

export const MyQuestionsScreen: React.FC<MyQuestionsScreenProps> = ({
  onNavigate,
  questions,
  onSelectQuestion,
  onToggleStar
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = questions.filter(q => {
    if (activeFilter === 'starred' && !q.starred) return false;
    if (searchQuery && !q.question.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="flex-grow w-full max-w-[800px] mx-auto px-container-padding pt-[80px] md:pt-[100px] pb-32">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-md text-headline-md text-on-background">My Questions</h1>
          <div className="flex items-center gap-2 text-outline">
            <span className="material-symbols-outlined text-[20px]">history</span>
            <span className="font-label-sm text-label-sm">History</span>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous questions..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-lowest border border-outline-variant rounded-full focus:outline-none focus:border-secondary"
            />
          </div>

          <button
            onClick={() => setActiveFilter(activeFilter === 'all' ? 'starred' : 'all')}
            className={`px-4 py-2 rounded-full font-label-bold text-xs flex items-center gap-1 border transition-colors ${
              activeFilter === 'starred'
                ? 'bg-secondary-container text-on-secondary-container border-secondary'
                : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {activeFilter === 'starred' ? 'star' : 'star_outline'}
            </span>
            Starred
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">question_answer</span>
            <p className="font-body-lg text-body-lg text-on-surface">No questions found</p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Ask Saarthi a question using voice or text.
            </p>
          </div>
        ) : (
          filteredQuestions.map((item) => (
            <article
              key={item.id}
              className="card-level-1 p-container-padding flex flex-col gap-2 cursor-pointer transition-all duration-200 hover:border-secondary/50"
            >
              <div className="flex justify-between items-start w-full">
                <div 
                  onClick={() => onSelectQuestion(item)} 
                  className="flex gap-4 items-center flex-1"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span 
                      className="material-symbols-outlined text-on-secondary-container" 
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {item.category === 'Legal' ? 'gavel' : item.category === 'Housing' ? 'home_work' : 'description'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-body-lg text-body-lg text-on-surface font-semibold">{item.question}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{item.language}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(item.id);
                  }}
                  className="p-1 hover:bg-surface-variant rounded-full text-secondary"
                  aria-label="Star question"
                >
                  <span 
                    className="material-symbols-outlined" 
                    style={{ fontVariationSettings: item.starred ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.starred ? 'star' : 'star_outline'}
                  </span>
                </button>
              </div>

              <div 
                onClick={() => onSelectQuestion(item)}
                className="mt-2 flex items-center gap-2 border-t border-outline-variant pt-3 w-full justify-between"
              >
                <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                    {item.sourceType === 'PHONE' ? 'call' : item.sourceType === 'APP' ? 'smartphone' : 'chat'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {item.sourceType}
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Floating Voice Hub */}
      <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 md:hidden">
        <button 
          onClick={() => onNavigate('voice')}
          className="w-[72px] h-[72px] bg-secondary text-on-secondary rounded-full shadow-[0_4px_12px_rgba(27,67,50,0.2)] flex items-center justify-center flex-col gap-1 transition-transform active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            mic
          </span>
        </button>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full text-center">
          <span className="font-label-bold text-[10px] tracking-wide text-on-background bg-surface/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
            Tap to Speak
          </span>
        </div>
      </div>
    </main>
  );
};
