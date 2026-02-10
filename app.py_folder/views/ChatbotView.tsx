
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Bot, User, Sparkles, X, Headphones, AlertCircle, MicOff, Mic, Loader2, Volume2, Power } from 'lucide-react';
import { getGeminiResponse } from '../geminiService';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const FormattedMessage = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-black text-indigo-900 drop-shadow-sm">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

const ChatbotView: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAgentMode = queryParams.get('mode') === 'agent';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceState, setVoiceState] = useState<'listening' | 'thinking' | 'speaking'>('listening');
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sessionRef = useRef<any>(null);
  
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    let initialText = "Namaste! I'm **RAAHI**, your smart Pune Travel companion. How can I help you today?";
    
    if (isAgentMode) {
      initialText = `Namaste! I'm your **RAAHI Travel Agent**. I'm excited to help you plan your perfect trip to Pune! 

To get started, please provide the following details:
1. **For how many days are you in this city?**
2. **What is the current season in which you are travelling?**
3. **How many people are with you?**
4. **What is your budget?**

Once you share these, I'll generate a complete itinerary including travel, stay, food, and sightseeing expenses!`;
    }

    setMessages([{
      id: 'init',
      text: initialText,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [isAgentMode]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const drawSiriWave = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      if (!isVoiceActive) return;

      const inputAnalyser = inputAnalyserRef.current;
      const outputAnalyser = outputAnalyserRef.current;
      
      let intensity = 0;
      if (inputAnalyser) {
        const dataArray = new Uint8Array(inputAnalyser.frequencyBinCount);
        inputAnalyser.getByteFrequencyData(dataArray);
        const peak = Math.max(...Array.from(dataArray));
        intensity = (peak / 255) * 100;
      }
      
      if (outputAnalyser && (voiceState === 'speaking' || voiceState === 'thinking')) {
        const dataArray = new Uint8Array(outputAnalyser.frequencyBinCount);
        outputAnalyser.getByteFrequencyData(dataArray);
        const outputPeak = Math.max(...Array.from(dataArray));
        intensity = Math.max(intensity, (outputPeak / 255) * 100);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      // Multi-layered Sine Wave Implementation for iOS 9 Look
      const drawWave = (color: string, opac: number, freq: number, amp: number, speed: number, offset: number, lineWidth: number) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opac;
        
        // Base vibration so it's always "alive"
        const breathing = Math.sin(phase * 0.05) * 5;
        const dynamicAmp = (amp + breathing + (intensity * 4.0)) * (voiceState === 'thinking' ? 0.3 : 1.0);

        for (let x = 0; x < width; x++) {
          // Normal distribution-like taper (Gaussian envelope) to pinch ends
          const mid = width / 2;
          const distFromMid = Math.abs(x - mid);
          const taper = Math.pow(Math.E, -Math.pow(distFromMid / (width / 3.5), 2));
          
          const y = centerY + Math.sin(x * freq + phase * speed + offset) * dynamicAmp * taper;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      // 7-Layer Wave System (Inspired by iOS 9 Siri Waveform)
      // Colors: Cyan, Magenta, White, Emerald, Indigo
      drawWave('#10b981', 0.9, 0.015, 60, 0.08, 0, 8);      // Emerald (Requested Bold Green)
      drawWave('#06b6d4', 0.6, 0.020, 45, 0.05, 1.2, 5);    // Cyan
      drawWave('#6366f1', 0.5, 0.012, 55, -0.04, 2.4, 6);   // Indigo
      drawWave('#f43f5e', 0.4, 0.025, 30, 0.12, 3.6, 4);    // Rose
      drawWave('#ffffff', 0.3, 0.010, 20, 0.03, 4.8, 3);    // White Core
      drawWave('#10b981', 0.2, 0.008, 15, -0.02, 6.0, 12);  // Emerald Background Glow
      drawWave('#06b6d4', 0.1, 0.030, 10, 0.15, 0.5, 2);    // Micro vibrations

      phase += 1;
      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const stopVoiceAssistant = useCallback(() => {
    if (sessionRef.current) { try { sessionRef.current.close(); } catch(e) {} sessionRef.current = null; }
    activeSourcesRef.current.forEach(source => { try { source.stop(); } catch(e) {} });
    activeSourcesRef.current.clear();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close().catch(console.error);
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') outputAudioContextRef.current.close().catch(console.error);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsVoiceActive(false);
    setVoiceState('listening');
    setTranscription('');
    nextStartTimeRef.current = 0;
  }, []);

  const startVoiceAssistant = async () => {
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const inputAnalyser = inputCtx.createAnalyser();
      inputAnalyser.fftSize = 256;
      inputAnalyser.smoothingTimeConstant = 0.85;
      inputAnalyserRef.current = inputAnalyser;
      const inputSource = inputCtx.createMediaStreamSource(stream);
      inputSource.connect(inputAnalyser);

      const outputAnalyser = outputCtx.createAnalyser();
      outputAnalyser.fftSize = 256;
      outputAnalyser.smoothingTimeConstant = 0.85;
      outputAnalyserRef.current = outputAnalyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsVoiceActive(true);
            setVoiceState('listening');
            setTimeout(() => drawSiriWave(), 100);
            
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(session => session && session.sendRealtimeInput({ media: pcmBlob })).catch(() => {});
            };
            inputSource.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputCtx.state !== 'closed') {
              setVoiceState('speaking');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const sourceNode = outputCtx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              
              sourceNode.connect(outputAnalyser);
              outputAnalyser.connect(outputCtx.destination);
              
              sourceNode.addEventListener('ended', () => {
                activeSourcesRef.current.delete(sourceNode);
                if (activeSourcesRef.current.size === 0) {
                  setVoiceState('listening');
                }
              });
              
              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.add(sourceNode);
            }

            if (message.serverContent?.turnComplete) {
               setVoiceState('listening');
            }

            if (message.serverContent?.modelTurn?.parts[0]?.text) {
              setTranscription(prev => (prev + ' ' + message.serverContent?.modelTurn?.parts[0]?.text).slice(-150));
            }
          },
          onclose: () => stopVoiceAssistant(),
          onerror: () => { setError("Connection lost."); stopVoiceAssistant(); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: isAgentMode 
            ? "You are RAAHI, a high-end Travel Agent for Pune. When provided with trip details (days, season, people, budget), create a detailed plan including travel mode (Metro/Bus/Cab), place suggestions, accommodation type, and a breakdown of food, stay, and transport expenses. Present it professionally."
            : "You are RAAHI, a friendly Pune commute expert. Keep responses helpful and concise.",
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { setError("Mic access failed."); stopVoiceAssistant(); }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const contextPrefix = isAgentMode ? "[AGENT MODE - TRIP PLANNING REQUEST] User Details: " : "";
    const botResponse = await getGeminiResponse(contextPrefix + input);
    
    setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: botResponse, sender: 'bot', timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white relative">
      <div className="bg-white border-b border-slate-200 p-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg">
            <Bot size={22} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 tracking-tight">RAAHI AI</h3>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              {isAgentMode ? 'Travel Agent Mode' : 'Online'}
            </span>
          </div>
        </div>
        <button 
          onClick={isVoiceActive ? stopVoiceAssistant : startVoiceAssistant}
          className={`p-3 rounded-2xl transition-all flex items-center space-x-2 ${isVoiceActive ? 'bg-rose-500 text-white shadow-rose-200 shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          {isVoiceActive ? <Power size={20} /> : <Headphones size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">{isVoiceActive ? 'Off' : 'Voice'}</span>
        </button>
      </div>

      {/* ENHANCED iOS 9 STYLE VOICE OVERLAY */}
      {isVoiceActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-between py-12 px-10 animate-in fade-in duration-700 bg-[#00050a] overflow-hidden">
          {/* Subtle Mesh Background Layers */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-emerald-600/30 blur-[180px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[70%] h-[70%] bg-indigo-600/20 blur-[200px] rounded-full animate-pulse [animation-delay:1s]" />
          </div>

          <div className="relative z-10 text-center space-y-6 pt-8">
            <div className="bg-white/5 backdrop-blur-2xl px-8 py-3 rounded-full border border-white/10 inline-flex items-center space-x-4 shadow-2xl">
               {voiceState === 'listening' ? (
                 <div className="flex space-x-2 items-center">
                   <div className="w-2 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0s]" />
                   <div className="w-2 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                   <div className="w-2 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                 </div>
               ) : voiceState === 'thinking' ? (
                 <Loader2 size={24} className="text-indigo-400 animate-spin" />
               ) : (
                 <div className="flex items-center space-x-2">
                   <Volume2 size={24} className="text-indigo-400 animate-pulse" />
                   <div className="flex space-x-1">
                     {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                   </div>
                 </div>
               )}
               <span className="text-[12px] font-black text-white/90 uppercase tracking-[0.3em]">
                 {voiceState === 'listening' ? 'Listening...' : voiceState === 'thinking' ? 'Processing...' : 'RAAHI Speaking'}
               </span>
            </div>
            <h2 className="text-white text-6xl font-black tracking-tighter drop-shadow-2xl">
              {voiceState === 'speaking' ? "I'm here." : "Go ahead..."}
            </h2>
          </div>

          {/* iOS 9 LIQUID WAVEFORM AREA - SIGNIFICANTLY ENLARGED */}
          <div className="relative w-full h-[36rem] flex items-center justify-center -my-12">
             <canvas ref={canvasRef} width={1200} height={700} className="w-full h-full max-w-2xl" />
             
             {/* Dynamic Central Bloom Glow */}
             <div className={`absolute w-80 h-80 rounded-full blur-[130px] transition-all duration-1000 ${
               voiceState === 'listening' ? 'bg-emerald-500/30 scale-125' : 
               voiceState === 'thinking' ? 'bg-indigo-500/40 scale-150 animate-pulse' : 
               'bg-indigo-400/50 scale-[2.2]'
             }`} />
          </div>

          {/* CONTROL SECTION WITH ADJUSTED PADDING */}
          <div className="relative z-10 w-full max-w-sm space-y-12 flex flex-col items-center pb-8">
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 rounded-[5rem] w-full text-center shadow-2xl ring-1 ring-white/5">
               <p className="text-emerald-100/95 text-xl font-bold italic leading-relaxed line-clamp-3">
                 "{transcription || (voiceState === 'listening' ? 'Tell me where you want to go in Pune...' : '...')}"
               </p>
            </div>
            
            <button 
              onClick={stopVoiceAssistant} 
              className="bg-white text-slate-950 p-9 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.25)] hover:scale-110 active:scale-95 transition-all group border-[6px] border-[#10b981]/20 hover:border-[#10b981]/40"
            >
              <X size={48} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm border ${m.sender === 'user' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                {m.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-[1.8rem] text-sm leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                <FormattedMessage text={m.text} />
                <p className={`text-[9px] mt-2 font-black uppercase opacity-50 ${m.sender === 'user' ? 'text-white' : 'text-slate-400'}`}>{m.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-400 px-2">
             <Loader2 size={18} className="animate-spin text-indigo-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">RAAHI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-20">
        <div className="flex items-center space-x-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAgentMode ? "Provide trip details..." : "Ask RAAHI..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-bold focus:outline-none ring-2 ring-transparent focus:ring-indigo-500/10 shadow-inner transition-all"
          />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-4 bg-indigo-600 text-white rounded-full shadow-lg active:scale-90 transition-all disabled:opacity-50"><Send size={22} /></button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotView;
