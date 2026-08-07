import React from 'react';
import { ScreenView, SavedItem, QuestionItem } from '../../types';

interface SavedScreenProps {
  onNavigate: (screen: ScreenView) => void;
  savedItems: SavedItem[];
  questions: QuestionItem[];
  onSelectQuestion: (question: QuestionItem) => void;
  onRemoveSaved: (id: string) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  onNavigate,
  savedItems,
  questions,
  onSelectQuestion,
  onRemoveSaved
}) => {
  return (
    <main className="flex-grow w-full max-w-[800px] mx-auto px-container-padding pt-[80px] md:pt-[100px] pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-md text-headline-md text-on-background">Saved Information</h1>
        <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-bold">
          {savedItems.length} Saved
        </span>
      </div>

      {savedItems.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">bookmark_border</span>
          <p className="font-body-lg text-body-lg text-on-surface">No saved items yet</p>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Tap the star icon on any question or guide to bookmark it for quick access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedItems.map((item) => {
            const matchingQ = questions.find(q => q.id === item.questionId || q.question.toLowerCase().includes(item.title.toLowerCase()));
            
            return (
              <div 
                key={item.id}
                className="card-level-1 border-l-4 border-l-secondary p-5 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-label-bold bg-surface-variant text-on-surface-variant px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <h2 className="font-headline-md text-headline-md text-primary mt-2">{item.title}</h2>
                  </div>
                  <button 
                    onClick={() => onRemoveSaved(item.id)}
                    className="p-1 hover:bg-surface-variant rounded-full text-outline hover:text-error transition-colors"
                    aria-label="Delete saved item"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant">
                  {item.description}
                </p>

                <div className="flex gap-2 pt-2 border-t border-outline-variant">
                  <button
                    onClick={() => {
                      if (matchingQ) {
                        onSelectQuestion(matchingQ);
                        onNavigate('conversation-detail');
                      } else {
                        onNavigate('home');
                      }
                    }}
                    className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-label-bold text-xs flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Open
                  </button>

                  <button
                    onClick={() => {
                      if (matchingQ) {
                        onSelectQuestion(matchingQ);
                        onNavigate('listen-answer');
                      } else {
                        onNavigate('home');
                      }
                    }}
                    className="flex-1 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-bold text-xs flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    Listen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};
