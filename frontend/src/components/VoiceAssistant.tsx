import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

interface Message {
  sender: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

// Browser Web Speech Recognition compatibility
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'coach',
      text: "Hello! I am your MindSync AI wellness coach. Completing your profile analysis helps me give personalized advice. Ask me anything about your digital habits!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onstart = () => {
        setIsListening(true);
      };

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSendMessage(transcript);
      };

      recog.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Load session inputs to query the API
  const getSessionData = () => {
    const req = localStorage.getItem('mindsync_assessment_request');
    const res = localStorage.getItem('mindsync_assessment_response');
    return {
      request: req ? JSON.parse(req) : null,
      response: res ? JSON.parse(res) : null
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    // Append user message
    const userMsg: Message = { sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    try {
      const { request, response } = getSessionData();
      
      // Fetch assistant response
      const apiRes = await api.chat(text, request, response);
      const coachText = apiRes.assistant_message;

      // Append coach message
      const coachMsg: Message = { sender: 'coach', text: coachText, timestamp: new Date() };
      setMessages(prev => [...prev, coachMsg]);

      // TTS voice synthesis
      if (ttsEnabled && window.speechSynthesis) {
        // Cancel active voices
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(coachText.replace(/\\n/g, ' '));
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'coach',
          text: "I'm having trouble connecting to the wellness engine. Please make sure the backend is active on port 8000.",
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleMicToggle = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group"
          id="wellness-assistant-btn"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-sm font-semibold">
            Wellness Coach
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[380px] max-w-[calc(100vw-32px)] h-[550px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/10 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">MindSync Wellness Coach</h4>
                <span className="text-[9px] text-blue-100 font-medium mt-0.5 block">AI Decision Support Assistant</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* TTS Audio toggle */}
              <button 
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
                title={ttsEnabled ? "Mute Coach voice" : "Unmute Coach voice"}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-blue-200" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages view */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`text-[8px] mt-1 block text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100/70 space-y-1.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Suggested Questions</span>
              <div className="flex flex-col gap-1.5">
                {[
                  "Why is my addiction score high?",
                  "What affects my wellness score?",
                  "How can I improve my digital habits?"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-left text-[11px] text-blue-600 hover:text-blue-700 bg-blue-50/40 hover:bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-blue-100/50 transition-colors font-medium"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input Area */}
          <div className="p-3 border-t border-slate-100 bg-white space-y-2">
            {isListening && (
              <div className="flex items-center gap-2 justify-center text-[10px] text-red-500 font-semibold bg-red-50 py-1 rounded-lg border border-red-100 animate-pulse">
                <Mic className="w-3.5 h-3.5" />
                <span>Listening for speech... Speak now</span>
              </div>
            )}
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-2"
            >
              {/* Mic STT toggle button */}
              <button
                type="button"
                onClick={handleMicToggle}
                className={`p-2 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white scale-105 animate-bounce' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Voice input (Speech to Text)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder="Type or dictate message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-slate-50 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 text-slate-700"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
