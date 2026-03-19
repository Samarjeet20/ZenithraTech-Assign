import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Mic, MicOff, AlertCircle, Loader2 } from 'lucide-react';

export default function Voice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const recognitionRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  // Setup the SpeechRecognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition is not supported in this browser.');
      toast.error('Audio Receptor: Browser unsupported.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Handles live transcription updates
    recognitionRef.current.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
      }
      setTranscript(currentTranscript.trim());
    };

    // Handles API errors gracefully
    recognitionRef.current.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
      setIsInitializing(false);
      if (event.error !== 'no-speech') {
        const errorMsg = event.error === 'not-allowed' ? 'Microphone access denied by user.' : `Error: ${event.error}`;
        setError(errorMsg);
        toast.error(`Audio Receptor Error: ${errorMsg}`);
        setIsListening(false);
      }
    };

    // Ensures UI state updates when recognition ends naturally
    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsInitializing(false);
    };

    // Cleanup API on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scrolls to the newest transcript
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    setError('');
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast('Audio Receptor deactivated.', { icon: '🔇', style: { border: '1px solid #1a1a1a' } });
    } else {
      setTranscript('');
      setIsInitializing(true);
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setIsInitializing(false);
        toast.success('Audio Receptor listening.');
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsInitializing(false);
        // Fallback for unexpected start failures
        toast.error('Failed to start Audio Receptor.');
      }
    }
  };

  const isUnsupported = !!error && !isListening && error.includes('supported');

  return (
    <div className={`panel-glass ${isListening ? 'border-neon-blue shadow-neon-blue transform scale-105' : 'border-vault-border'} transition-all duration-300 flex flex-col`}>
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <h2 className={`flex items-center gap-2 text-xl font-bold tracking-widest ${isListening ? 'text-neon-blue' : 'text-gray-400'}`}>
          <Mic size={20} className={isListening ? 'text-neon-blue animate-[pulse_2s_infinite]' : 'text-gray-500'} />
          AUDIO RECEPTOR
        </h2>
        
        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {isInitializing ? (
            <span className="text-yellow-400 text-xs font-mono tracking-widest flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> INIT
            </span>
          ) : isListening ? (
             <span className="text-neon-blue text-xs font-mono tracking-widest font-bold flex items-center gap-1">
               ● LISTENING
             </span>
          ) : (
            <span className="text-gray-600 text-xs font-mono tracking-widest">○ IDLE</span>
          )}
        </div>
      </div>

      <div className="bg-black rounded-lg border border-gray-800 aspect-[4/3] flex-1 p-4 overflow-y-auto font-mono text-sm mb-6 relative text-gray-300 shadow-inner">
        {error ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-red-500">
             <AlertCircle size={32} />
             <p className="text-center">{error}</p>
          </div>
        ) : transcript ? (
          <p className="leading-relaxed whitespace-pre-wrap pb-8">{transcript}</p>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-80">
            <MicOff size={32} className="mb-2 opacity-50" />
            <p className="text-center italic tracking-widest">AWAITING AUDIO INPUT</p>
          </div>
        )}
        <div ref={endOfMessagesRef} />

        {/* Animated Audio Equalizer Visualizer */}
        {isListening && !error && (
            <div className="absolute bottom-4 right-4 flex gap-1 h-6 items-end opacity-50 bg-black bg-opacity-50 p-1 rounded">
                <div className="w-1 bg-neon-blue animate-[bounce_0.8s_infinite] h-[30%]"></div>
                <div className="w-1 bg-neon-blue animate-[bounce_1.2s_infinite] h-[100%]"></div>
                <div className="w-1 bg-neon-blue animate-[bounce_0.5s_infinite] h-[60%]"></div>
                <div className="w-1 bg-neon-blue animate-[bounce_1.0s_infinite] h-[80%]"></div>
                <div className="w-1 bg-neon-blue animate-[bounce_0.9s_infinite] h-[40%]"></div>
            </div>
        )}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleListening} 
          disabled={isUnsupported || isInitializing}
          className={`${isListening ? 'btn-danger' : 'btn-neon-blue'} flex-1 tracking-widest text-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isInitializing ? (
             <><Loader2 size={16} className="animate-spin"/> INIT...</>
          ) : isListening ? (
             <><MicOff size={16} /> TERMINATE CAPTURE</>
          ) : (
             <><Mic size={16} /> BEGIN CAPTURE</>
          )}
        </button>
      </div>
    </div>
  );
}
