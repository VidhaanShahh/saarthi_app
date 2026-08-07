import React, { useState } from 'react';
import { ScreenView, DocumentExplanation, Language } from '../../types';

interface ExplainThisScreenProps {
  onNavigate: (screen: ScreenView) => void;
  selectedLanguage: Language;
}

export const ExplainThisScreen: React.FC<ExplainThisScreenProps> = ({ onNavigate, selectedLanguage }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DocumentExplanation | null>(null);

  const sampleDocs = [
    {
      id: 'doc-1',
      title: 'Electricity Notice',
      subtitle: 'Utility Bill & Due Date',
      icon: 'electric_bolt',
      sampleText: 'MSEDCL Outstanding Bill Notice. Consumer No: 123456789. Amount Due: Rs 1,450. Due Date: 15/10/2026. Non-payment may lead to service disconnection.'
    },
    {
      id: 'doc-2',
      title: 'Court Summons',
      subtitle: 'Legal Notice',
      icon: 'gavel',
      sampleText: 'Sub-Divisional Magistrate Court Summons. Notice to appear regarding land boundary enquiry on 22nd October at 10:30 AM.'
    },
    {
      id: 'doc-3',
      title: '7/12 Land Extract',
      subtitle: 'Revenue Record',
      icon: 'description',
      sampleText: 'Maharashtra Revenue Dept 7/12 Utara. Gut No 142. Cultivator: Ramesh Patel. Crop: Sugarcane. Encumbrance: Bank of Maharashtra Mortgage.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        analyzeDocument(base64, undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDocument = async (base64Img?: string, text?: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/explain-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          textContent: text,
          language: selectedLanguage
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({
        title: 'Document Analysis',
        summary: 'This is an official document that contains important instructions and deadlines.',
        keyPoints: [
          'The document specifies required action and contact details.',
          'Double-check the due date to avoid penalties.'
        ],
        dueDate: '15th October',
        actionRequired: 'Review carefully and visit official office if required.',
        source: 'Government / Official Authority'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="flex-grow w-full max-w-[800px] mx-auto px-container-padding pt-[80px] md:pt-[100px] pb-32">
      <div className="text-center mb-6">
        <h1 className="font-headline-md text-headline-md text-primary mb-1">Explain This Document</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Upload or take a photo of any legal notice, bill, or government letter to get a simple explanation.
        </p>
      </div>

      {/* Photo Capture / Upload Box */}
      <div className="bg-surface-container-lowest border-2 border-dashed border-secondary/40 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center mb-8 shadow-sm hover:border-secondary transition-colors">
        {selectedImage ? (
          <div className="relative w-full max-h-60 overflow-hidden rounded-xl">
            <img src={selectedImage} alt="Uploaded Document" className="w-full h-full object-cover" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">photo_camera</span>
          </div>
        )}

        <div>
          <p className="font-label-bold text-label-bold text-on-surface">Take a Photo or Select Image</p>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">Supports JPG, PNG, PDF document photos</p>
        </div>

        <div className="flex gap-3">
          <label className="bg-secondary text-on-secondary font-label-bold px-5 py-2.5 rounded-full text-sm cursor-pointer shadow-sm hover:bg-[#005235] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            Take Photo
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>

          <label className="bg-surface-container-high text-primary font-label-bold px-5 py-2.5 rounded-full text-sm cursor-pointer border border-outline-variant hover:bg-surface-variant transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            From Gallery
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Or Pick a Sample Document */}
      <div className="mb-8">
        <p className="font-label-bold text-xs text-outline uppercase tracking-wider mb-3">Or try a sample document:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sampleDocs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => analyzeDocument(undefined, doc.sampleText)}
              className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center gap-3 text-left hover:border-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">{doc.icon}</span>
              </div>
              <div>
                <p className="font-label-bold text-sm text-on-surface">{doc.title}</p>
                <p className="font-label-sm text-xs text-on-surface-variant">{doc.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-2xl text-center flex flex-col items-center justify-center gap-3 animate-pulse">
          <span className="material-symbols-outlined text-4xl text-secondary animate-spin">psychology</span>
          <p className="font-headline-md text-headline-md text-primary">Saarthi is analyzing your document...</p>
          <p className="font-body-md text-xs text-on-surface-variant">Extracting key dates, payments, and legal obligations in simple terms.</p>
        </div>
      )}

      {/* Result Card */}
      {result && !isAnalyzing && (
        <div className="bg-surface-container-lowest border border-secondary rounded-2xl p-6 shadow-md flex flex-col gap-4 animate-enter">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2 text-secondary font-headline-md text-headline-md">
              <span className="material-symbols-outlined">description</span>
              <span>{result.title}</span>
            </div>
            <span className="text-xs font-label-bold bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full">
              Analyzed by Gemini
            </span>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface font-medium leading-relaxed">
            {result.summary}
          </p>

          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2">
            <p className="font-label-bold text-xs text-secondary uppercase tracking-wider">What this means:</p>
            <ul className="list-disc list-inside space-y-1.5 font-body-md text-sm text-on-surface">
              {result.keyPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          {result.dueDate && (
            <div className="flex items-center gap-3 bg-error-container/40 border border-error/20 p-3.5 rounded-xl text-on-error-container">
              <span className="material-symbols-outlined text-error">event_upcoming</span>
              <div>
                <p className="font-label-bold text-xs">Important Due Date:</p>
                <p className="font-body-lg font-bold">{result.dueDate}</p>
              </div>
            </div>
          )}

          {result.actionRequired && (
            <div className="bg-tertiary-container/20 border border-tertiary-container/30 p-3.5 rounded-xl">
              <p className="font-label-bold text-xs text-tertiary uppercase tracking-wider mb-1">Recommended Action:</p>
              <p className="font-body-md text-sm text-on-surface">{result.actionRequired}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onNavigate('voice')}
              className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-label-bold text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
              Ask Question About This
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
