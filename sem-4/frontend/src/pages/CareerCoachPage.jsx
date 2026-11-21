import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  BookOpen,
  ArrowRight,
  Bot
} from 'lucide-react';
import { api } from '../context/AuthContext';

export default function CareerCoachPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI Career Coach. I can analyze your resume weaknesses, generate a personalized learning roadmap, mock interview you, or review project ideas. What would you like to focus on today?",
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');

    // Append User Message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    
    setLoading(true);

    try {
      const response = await api.post('/coach/chat/', { message: text });
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: response.data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Failed to communicate with AI Coach:', error);
      const errorMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: "I encountered an issue connecting to the Career Coach API. Please configure your GEMINI_API_KEY in the `.env` settings or check backend terminal logs." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const presetPrompts = [
    { text: 'Roast My Resume Gaps', icon: Flame, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { text: 'Generate Learning Roadmap', icon: BookOpen, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { text: 'Practice Interview Prep', icon: HelpCircle, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' }
  ];

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm animate-fade-in">
      
      {/* Coach Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-dark-950/20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white p-2 rounded-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Career Assistant</h3>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Powered by Gemini LLM
            </p>
          </div>
        </div>
      </div>

      {/* Chat Logs */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/10 dark:bg-dark-950/10">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold ${
                isBot 
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-slate-200/50 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}>
                {isBot ? 'AI' : 'ME'}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                isBot 
                  ? 'bg-white dark:bg-dark-900 border border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-tl-none' 
                  : 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-500/10'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
              AI
            </div>
            <div className="bg-white dark:bg-dark-900 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Chip Prompts */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-850 flex flex-wrap gap-2 justify-center bg-slate-50/10 dark:bg-dark-950/10">
          {presetPrompts.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className={`inline-flex items-center gap-2 border px-4 py-2 rounded-full text-xs font-semibold hover:scale-105 active:scale-95 transition-all ${p.color}`}
              >
                <Icon className="h-4 w-4" />
                {p.text}
                <ArrowRight className="h-3 w-3" />
              </button>
            );
          })}
        </div>
      )}

      {/* Input panel */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-4 border-t border-slate-200 dark:border-slate-850 flex gap-3 bg-white dark:bg-dark-900"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about resume keywords, roadmap guides or jobs..."
          className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-800 bg-transparent rounded-xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}
