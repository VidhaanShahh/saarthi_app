export type Language = 'Marathi' | 'Hindi' | 'Gujarati' | 'Bengali' | 'Tamil' | 'Telugu' | 'English';

export type ScreenName =
  | 'Home'
  | 'Voice'
  | 'MyQuestions'
  | 'ConversationDetail'
  | 'ListenAnswer'
  | 'Offline'
  | 'Saved'
  | 'ExplainThis'
  | 'LanguageSelection'
  | 'HumanHelp'
  | 'Profile';

export type SourceType = 'PHONE' | 'APP' | 'SMS';

export interface QuestionStep {
  number: number;
  title: string;
  description: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  date: string;
  timestamp: number;
  language: Language;
  sourceType: SourceType;
  starred: boolean;
  category: 'Legal' | 'Housing' | 'Government Scheme' | 'Rights' | 'General';
  verifiedSource?: string;
  summary: string;
  steps: QuestionStep[];
  audioDuration?: string;
  audioDurationSeconds?: number;
  followups?: string[];
  simplifiedSummary?: string;
}

export interface SavedItem {
  id: string;
  title: string;
  description: string;
  category: string;
  starred: boolean;
  questionId?: string;
}

export interface OfflineGuide {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  content: string;
}

export interface DocumentExplanation {
  title: string;
  summary: string;
  keyPoints: string[];
  dueDate?: string;
  actionRequired?: string;
  source: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  preferredLanguage: Language;
  explanationStyle: 'Simple' | 'Detailed';
  notifications: boolean;
  isOnline: boolean;
}

// Navigation param types
export type RootStackParamList = {
  MainTabs: undefined;
  Voice: undefined;
  ConversationDetail: { question: QuestionItem };
  ListenAnswer: { question: QuestionItem };
  ExplainThis: undefined;
  HumanHelp: { question?: QuestionItem };
  LanguageSelection: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MyQuestions: undefined;
  Saved: undefined;
  Offline: undefined;
  Profile: undefined;
};
