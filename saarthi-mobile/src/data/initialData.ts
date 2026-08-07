import { QuestionItem, SavedItem, OfflineGuide } from '../types';

export const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-1',
    question: 'How to file an FIR?',
    date: 'Today',
    timestamp: Date.now(),
    language: 'Marathi',
    sourceType: 'PHONE',
    starred: true,
    category: 'Legal',
    verifiedSource: 'Official Government Source',
    summary: 'To file an FIR (First Information Report), follow these official steps:',
    audioDuration: '2:15',
    audioDurationSeconds: 135,
    steps: [
      {
        number: 1,
        title: 'Visit the nearest police station',
        description: 'Go to the police station that has jurisdiction over the area where the incident occurred.'
      },
      {
        number: 2,
        title: 'Explain the event',
        description: 'Provide a clear, truthful, and detailed account of the incident to the duty officer. You can do this verbally or in writing.'
      },
      {
        number: 3,
        title: 'Review and Sign',
        description: 'The officer will write down your statement. Read it carefully before signing to ensure all details are accurate.'
      },
      {
        number: 4,
        title: 'Get a copy',
        description: 'Demand a free copy of the FIR with the official stamp and signature of the registering officer. This is your legal right.'
      }
    ],
    simplifiedSummary: 'Visit your nearest police station, narrate what happened, double-check what officer writes, sign it, and demand a free copy immediately.',
    followups: ['Can I do it online?', 'What if police refuse to register FIR?', 'What documents do I need?']
  },
  {
    id: 'q-2',
    question: 'Tenant rights',
    date: 'Yesterday',
    timestamp: Date.now() - 86400000,
    language: 'Hindi',
    sourceType: 'APP',
    starred: false,
    category: 'Housing',
    verifiedSource: 'Model Tenancy Act & State Rent Control',
    summary: 'Key legal protections guaranteed to tenants under Indian housing regulations:',
    audioDuration: '1:45',
    audioDurationSeconds: 105,
    steps: [
      {
        number: 1,
        title: 'Right to Essential Services',
        description: 'Landlords cannot cut off electricity, water, or basic amenities even during disputes.'
      },
      {
        number: 2,
        title: 'Written Agreement & Notice',
        description: 'Eviction requires a minimum 30-day written notice with valid legal grounds.'
      },
      {
        number: 3,
        title: 'Security Deposit Refund',
        description: 'Security deposit must be refunded within 1 month of handing over vacant possession.'
      }
    ],
    simplifiedSummary: 'Landlords cannot cut water/power or throw you out without a 1-month written notice and legal reason.',
    followups: ['How much security deposit is legally allowed?', 'What if landlord increases rent suddenly?']
  },
  {
    id: 'q-3',
    question: 'Required documents',
    date: '3 days ago',
    timestamp: Date.now() - 3 * 86400000,
    language: 'Marathi',
    sourceType: 'SMS',
    starred: false,
    category: 'Government Scheme',
    verifiedSource: 'Revenue Department & Land Registration Portal',
    summary: 'Essential documents needed for land title verification and property registration:',
    audioDuration: '2:00',
    audioDurationSeconds: 120,
    steps: [
      {
        number: 1,
        title: '7/12 Extract (Satbara Utara)',
        description: 'Official land registry record showing ownership history and agricultural usage.'
      },
      {
        number: 2,
        title: 'Aadhaar & PAN Card',
        description: 'Identity proof for both buyer and seller.'
      },
      {
        number: 3,
        title: 'Encumbrance Certificate',
        description: 'Proof that the land is free from active bank loans or legal dues.'
      }
    ],
    simplifiedSummary: 'You need 7/12 extract, Aadhaar, PAN card, and Encumbrance certificate from sub-registrar office.',
    followups: ['How to get 7/12 extract online?', 'Cost of stamp duty in Maharashtra?']
  }
];

export const INITIAL_SAVED_ITEMS: SavedItem[] = [
  {
    id: 's-1',
    title: 'FIR procedure',
    description: 'Step-by-step guide on how to file a First Information Report at your local police station.',
    category: 'Legal',
    starred: true,
    questionId: 'q-1'
  },
  {
    id: 's-2',
    title: 'Documents required',
    description: 'List of essential documents needed for property registration and land disputes.',
    category: 'Government Scheme',
    starred: true,
    questionId: 'q-3'
  },
  {
    id: 's-3',
    title: 'Consumer complaint process',
    description: 'Detailed workflow on registering a grievance with the consumer protection forum online.',
    category: 'Legal',
    starred: true
  },
  {
    id: 's-4',
    title: 'Government scheme eligibility',
    description: 'Criteria and forms required to apply for rural agricultural subsidies and welfare programs.',
    category: 'Government Scheme',
    starred: true
  }
];

export const INITIAL_OFFLINE_GUIDES: OfflineGuide[] = [
  {
    id: 'off-1',
    title: 'FIR basics',
    description: 'How to file a First Information Report',
    icon: 'gavel',
    category: 'Legal',
    content: 'FIR is an official written document prepared by police when they receive information about a cognizable offence. Visit police station, give your statement, sign it, and demand a free stamped copy.'
  },
  {
    id: 'off-2',
    title: 'Government schemes',
    description: 'Details on essential welfare programs',
    icon: 'account-balance',
    category: 'Welfare',
    content: 'Key government schemes include PM-Kisan (Rs 6,000/year agricultural support), PM Awas Yojana (housing subsidy), and Ayushman Bharat (Rs 5 Lakh health coverage per family).'
  },
  {
    id: 'off-3',
    title: 'Emergency contacts',
    description: 'Police, ambulance, and helplines',
    icon: 'phone-alert',
    category: 'Emergency',
    content: 'National Emergency: 112 | Police: 100 | Ambulance: 108 | Women Helpline: 1091 | Cyber Crime: 1930 | Legal Aid Helpline: 15100'
  },
  {
    id: 'off-4',
    title: 'Saved answers',
    description: 'Your previously saved voice replies',
    icon: 'bookmark',
    category: 'Personal',
    content: 'Access all your saved answers and voice recordings locally without requiring an active internet connection.'
  }
];
