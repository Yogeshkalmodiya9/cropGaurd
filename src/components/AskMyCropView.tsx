import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Sprout,
  HelpCircle,
  RefreshCw,
  Mic,
  Bot,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ScanResult, ChatMessage } from '../types';
import { ask_crop_assistant } from '../services/api';

interface AskMyCropViewProps {
  currentScan: ScanResult;
  onNavigateTab: (tab: any) => void;
  onSelectAnotherScan: () => void;
}

export const AskMyCropView: React.FC<AskMyCropViewProps> = ({
  currentScan,
  onNavigateTab,
  onSelectAnotherScan,
}) => {
  const getInitialMessages = (scan: ScanResult): ChatMessage[] => [
    {
      id: 'msg-1',
      sender: 'farmer',
      text: `Kya mere ${scan.crop} ki yeh sthiti chintajanak hai?`,
      timestamp: '10:15 AM',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text:
        scan.status === 'Healthy'
          ? `Aapke ${scan.crop} ka patta poori tarah swasth aur hara dikh raha hai. Chlorophyll normal hai aur koi rog ke nishaan nahi hain. Khet ki standard dekhbhal jaari rakhein!`
          : `Aapke ${scan.crop} ke patte par ${scan.farmerConditionName || scan.disease} ke lakshan dikh rahe hain (${scan.severity} severity, lagbhag ${scan.affectedArea}% affected area). Yeh samay par dhyan dene se control ho sakta hai.\n\nTurant salah:\n• Kharab pattiyon ko tod kar khet se door dalein\n• Patti par zyada nami na jamne dein\n• Sifarish kiye gaye Treatment Plan ko follow karein`,
      timestamp: '10:15 AM',
      actions: ['View Treatment Plan', 'Find Expert'],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(currentScan));

  useEffect(() => {
    setMessages(getInitialMessages(currentScan));
  }, [currentScan.id, currentScan.crop]);

  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    { label: '💬 What happened?', query: `What caused ${currentScan.disease} in my ${currentScan.crop}?` },
    { label: '⚠️ Is it serious?', query: `Is this ${currentScan.disease} serious for my yield?` },
    { label: '🌿 Organic solution?', query: `What organic and low-risk treatments work for ${currentScan.disease}?` },
    { label: '🛡️ How to prevent it?', query: `How can I prevent ${currentScan.disease} from spreading across my field?` },
    { label: '📈 Is it getting worse?', query: `How quickly does this condition escalate if untreated?` },
  ];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuestion.trim();
    if (!q || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'farmer',
      text: q,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const answer = await ask_crop_assistant(q, currentScan);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'I could not reach the pathology model. Please check your network or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-14 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          Ask My Crop <span className="text-xl">🌿</span>
        </h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Ask questions about your uploaded crop, its condition, and treatments.
        </p>
      </div>

      {/* Current Scan Context Card (Matching Reference Screen 3) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 shadow-inner">
            <img
              src={currentScan.imageUrl}
              alt={currentScan.crop}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-0.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Current Scan Context</span>
            </div>
            <div className="text-base font-bold text-neutral-900 flex items-center gap-1.5">
              <span>{currentScan.cropIcon}</span>
              <span>{currentScan.crop}</span>
              <span className="text-neutral-400">·</span>
              <span className="text-red-600 font-semibold">{currentScan.disease}</span>
            </div>
            <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-3 font-mono">
              <span>
                Severity: <strong className="text-neutral-800">{currentScan.severity}</strong> ({currentScan.affectedArea}%)
              </span>
              <span>·</span>
              <span>
                Confidence: <strong className="text-neutral-800">{currentScan.confidence}%</strong>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onSelectAnotherScan}
          className="self-start sm:self-center px-4 py-2 rounded-xl border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs font-semibold text-neutral-700 transition-colors"
        >
          Change Image
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'farmer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/70 rounded-tr-none'
                      : 'bg-neutral-50 text-neutral-800 border border-neutral-200/80 rounded-tl-none'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1 text-[11px]">
                      <Sprout className="w-3.5 h-3.5" />
                      <span>CropGuard Advisor</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line font-normal">{msg.text}</div>

                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-2.5 border-t border-neutral-200/60">
                      {msg.actions.map((act) => (
                        <button
                          key={act}
                          onClick={() => {
                            if (act.includes('Treatment')) onNavigateTab('health');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>{act}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 mt-1 px-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl rounded-tl-none p-3.5 text-xs text-neutral-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Pathologist AI is writing guidance...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-5 py-2.5 border-t border-neutral-100 bg-neutral-50/50 overflow-x-auto flex items-center gap-2">
          {quickQuestions.map((q) => (
            <button
              key={q.label}
              onClick={() => handleSendMessage(q.query)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-neutral-700 hover:text-emerald-800 border border-neutral-200 hover:border-emerald-300 font-medium whitespace-nowrap transition-all shadow-2xs"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Bottom Input Field */}
        <div className="p-4 border-t border-neutral-200 bg-white rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask a question about your crop, disease spread, treatments..."
              disabled={isLoading}
              className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-200 text-white rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-neutral-400 mt-2 text-center">
            CropGuard AI answers are grounded in crop pathology guidelines. Always verify chemical applications with local agricultural authorities.
          </p>
        </div>
      </div>
    </div>
  );
};
