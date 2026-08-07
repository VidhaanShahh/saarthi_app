import React, { useState } from 'react';
import { ScreenView, QuestionItem, SavedItem, Language } from './types';
import { INITIAL_QUESTIONS, INITIAL_SAVED_ITEMS, INITIAL_OFFLINE_GUIDES } from './data/initialData';

import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';

import { HomeScreen } from './components/screens/HomeScreen';
import { VoiceInteractionScreen } from './components/screens/VoiceInteractionScreen';
import { MyQuestionsScreen } from './components/screens/MyQuestionsScreen';
import { ConversationDetailScreen } from './components/screens/ConversationDetailScreen';
import { ListenAnswerScreen } from './components/screens/ListenAnswerScreen';
import { OfflineHelpScreen } from './components/screens/OfflineHelpScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { ExplainThisScreen } from './components/screens/ExplainThisScreen';
import { LanguageSelectionModal } from './components/screens/LanguageSelectionModal';
import { HumanHelpScreen } from './components/screens/HumanHelpScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('Marathi');
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);

  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(INITIAL_SAVED_ITEMS);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionItem | null>(INITIAL_QUESTIONS[0]);

  // Handlers
  const handleSelectQuestion = (q: QuestionItem) => {
    setSelectedQuestion(q);
    setCurrentScreen('conversation-detail');
  };

  const handleAddQuestion = (newQ: QuestionItem) => {
    setQuestions(prev => [newQ, ...prev]);
    setSelectedQuestion(newQ);
  };

  const handleToggleStar = (id: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        const nextStarred = !q.starred;
        if (nextStarred) {
          // add to saved items
          if (!savedItems.some(s => s.questionId === q.id)) {
            setSavedItems(sPrev => [
              {
                id: `s-${Date.now()}`,
                title: q.question,
                description: q.summary,
                category: q.category,
                starred: true,
                questionId: q.id
              },
              ...sPrev
            ]);
          }
        } else {
          setSavedItems(sPrev => sPrev.filter(s => s.questionId !== q.id));
        }
        return { ...q, starred: nextStarred };
      }
      return q;
    }));
  };

  const handleSaveQuestion = (q: QuestionItem) => {
    handleToggleStar(q.id);
  };

  const handleRemoveSaved = (savedId: string) => {
    const item = savedItems.find(s => s.id === savedId);
    if (item && item.questionId) {
      setQuestions(prev => prev.map(q => q.id === item.questionId ? { ...q, starred: false } : q));
    }
    setSavedItems(prev => prev.filter(s => s.id !== savedId));
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md relative antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Navigation Header */}
      {currentScreen !== 'voice' && currentScreen !== 'listen-answer' && (
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          selectedLanguage={selectedLanguage}
          onOpenLanguageModal={() => setShowLanguageModal(true)}
          onGoBack={() => setCurrentScreen('home')}
        />
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <LanguageSelectionModal
          selectedLanguage={selectedLanguage}
          onSelectLanguage={(lang) => {
            setSelectedLanguage(lang);
            setShowLanguageModal(false);
          }}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Screen Views */}
      {currentScreen === 'home' && (
        <HomeScreen
          onNavigate={(s) => setCurrentScreen(s)}
          questions={questions}
          onSelectQuestion={handleSelectQuestion}
          selectedLanguage={selectedLanguage}
        />
      )}

      {currentScreen === 'voice' && (
        <VoiceInteractionScreen
          onNavigate={(s) => setCurrentScreen(s)}
          onGoBack={() => setCurrentScreen('home')}
          selectedLanguage={selectedLanguage}
          onAddQuestion={handleAddQuestion}
          onSelectQuestion={handleSelectQuestion}
        />
      )}

      {currentScreen === 'my-questions' && (
        <MyQuestionsScreen
          onNavigate={(s) => setCurrentScreen(s)}
          questions={questions}
          onSelectQuestion={handleSelectQuestion}
          onToggleStar={handleToggleStar}
        />
      )}

      {currentScreen === 'conversation-detail' && (
        <ConversationDetailScreen
          question={selectedQuestion}
          onNavigate={(s) => setCurrentScreen(s)}
          onSaveQuestion={handleSaveQuestion}
          isSaved={!!selectedQuestion?.starred}
        />
      )}

      {currentScreen === 'listen-answer' && (
        <ListenAnswerScreen
          question={selectedQuestion}
          onGoBack={() => setCurrentScreen('conversation-detail')}
        />
      )}

      {currentScreen === 'offline' && (
        <OfflineHelpScreen
          onNavigate={(s) => setCurrentScreen(s)}
          guides={INITIAL_OFFLINE_GUIDES}
        />
      )}

      {currentScreen === 'saved' && (
        <SavedScreen
          onNavigate={(s) => setCurrentScreen(s)}
          savedItems={savedItems}
          questions={questions}
          onSelectQuestion={handleSelectQuestion}
          onRemoveSaved={handleRemoveSaved}
        />
      )}

      {currentScreen === 'explain-this' && (
        <ExplainThisScreen
          onNavigate={(s) => setCurrentScreen(s)}
          selectedLanguage={selectedLanguage}
        />
      )}

      {currentScreen === 'human-help' && (
        <HumanHelpScreen
          question={selectedQuestion}
          onNavigate={(s) => setCurrentScreen(s)}
          onGoBack={() => setCurrentScreen('conversation-detail')}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          onNavigate={(s) => setCurrentScreen(s)}
          selectedLanguage={selectedLanguage}
          onOpenLanguageModal={() => setShowLanguageModal(true)}
        />
      )}

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={(s) => setCurrentScreen(s)}
      />
    </div>
  );
}

export default App;
