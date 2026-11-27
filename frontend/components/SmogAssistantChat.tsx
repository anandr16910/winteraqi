import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  ExternalLink, 
  ShieldAlert, 
  Lightbulb, 
  RefreshCw 
} from 'lucide-react';
import { AssistantMessage, CityAirData, HouseholdProfile } from '../types';
import { askSmogAdvisor } from '../services/geminiService';

interface SmogAssistantChatProps {
  airData: CityAirData;
  profile: HouseholdProfile;
}

const QUICK_PROMPTS = [
  'Why is the botanical garden cleaner than the street right outside?',
  'Can I take my 3-year-old out to a filtered public library today?',
  'Does a 20th floor apartment have cleaner air than ground floor?',
  'What cooking oils cause the least indoor particulate spikes?'
];

export const SmogAssistantChat: React.FC<SmogAssistantChatProps> = ({ airData, profile }) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am your AuraGuard AI Clean Air Advisor for ${airData.city}. With ambient AQI at ${airData.aqi} (${airData.category}), remember that air quality is not identical everywhere in town! Botanical gardens, parks with dense canopies, and HVAC-filtered buildings offer cleaner air sanctuaries (30-85% cleaner). Ask me about any specific spot, mask fitting, DIY filters, or commute timing.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.text
    }));

    try {
      const response = await askSmogAdvisor(textToSend, airData, profile, history);
      const assistantMsg: AssistantMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: response.sources
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I am experiencing brief network congestion. During heavy winter smog, seek botanical gardens or filtered indoor sanctuaries and keep bedroom filtration active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="smog-assistant-heading" className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-950" aria-hidden="true">
            <Bot className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 id="smog-assistant-heading" className="text-base font-bold text-slate-100 flex items-center gap-1.5">
              AuraGuard Smog & Micro-Climate Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            </h2>
            <p className="text-xs text-slate-400">
              Powered by Gemini 2.5 with Google Search Grounding & Atmospheric Health Models
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation with AuraGuard AI"
        className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 pr-1"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-950'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Grounded sources if available */}
              {msg.groundingSources && msg.groundingSources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-400">Citations:</span>
                  {msg.groundingSources.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-teal-300 hover:text-teal-200 border border-slate-700 hover:border-teal-500 transition-colors"
                    >
                      <span>{s.title.length > 20 ? s.title.slice(0, 20) + '...' : s.title}</span>
                      <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}

              <span
                className={`text-[10px] mt-1.5 block text-right ${
                  msg.sender === 'user' ? 'text-slate-950 font-semibold' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5" aria-hidden="true">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3" role="status">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 flex-shrink-0" aria-hidden="true">
              <RefreshCw className="w-4 h-4 animate-spin motion-reduce:animate-none" />
            </div>
            <div className="bg-slate-950 border border-slate-800 text-slate-300 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping motion-reduce:animate-none" aria-hidden="true" />
              Consulting atmospheric medical databases and current {airData.city} micro-climate patterns...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="pt-2 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none" role="group" aria-label="Suggested questions">
        <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          Ask:
        </span>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 flex items-center gap-2 border-t border-slate-800"
      >
        <label htmlFor="smog-chat-input" className="sr-only">
          Ask about parks in {airData.city}, building filters, high-rise differences, or safe strolls
        </label>
        <input
          id="smog-chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about parks in ${airData.city}, building filters, high-rise differences, or safe strolls...`}
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-100 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
        >
          <span>Send</span>
          <Send className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
};
