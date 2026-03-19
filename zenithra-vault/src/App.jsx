import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';
import Camera from './components/Camera';
import Voice from './components/Voice';
import Bluetooth from './components/Bluetooth';

function App() {
  return (
    <div className="min-h-screen bg-vault-bg p-4 md:p-8 relative overflow-hidden font-sans text-gray-200">
      {/* Global Toast Notifications Configured with Theme */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#111111',
            color: '#fff',
            border: '1px solid #1a1a1a',
            borderRadius: '8px',
          },
          success: {
            iconTheme: { primary: '#39ff14', secondary: '#111' },
            style: { border: '1px solid #39ff14', boxShadow: '0 0 10px rgba(57,255,20,0.2)' }
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#111' },
            style: { border: '1px solid #ef4444', boxShadow: '0 0 10px rgba(239,68,68,0.2)' }
          }
        }} 
      />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-neon-green filter blur-[120px] mix-blend-screen opacity-[0.15]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-neon-blue filter blur-[150px] mix-blend-screen opacity-[0.15]"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col h-full">
        {/* Global Status Bar */}
        <div className="flex justify-between items-center bg-black bg-opacity-60 border-t border-l border-r border-gray-800 px-4 py-2 rounded-t-xl text-xs font-mono tracking-widest text-gray-400 mb-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-neon-green text-opacity-80" />
            <span className="text-gray-300">SYSTEM SECURE</span>
          </div>
          <div>ALL MODULES READY</div>
        </div>

        {/* Main Header */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-vault-panel bg-opacity-80 p-6 rounded-b-xl border border-vault-border mb-8 shadow-lg backdrop-blur-md">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue tracking-[0.2em] drop-shadow-md">
              ZENITHRA
            </h1>
            <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500 mt-2">
              VAULT INTERFACE
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-black px-5 py-2 rounded-full border border-gray-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <div className="w-3 h-3 rounded-full bg-neon-green animate-[pulse_2s_infinite] shadow-[0_0_8px_#39ff14]"></div>
            <span className="font-mono text-neon-green tracking-widest text-sm font-bold">SYSTEM ONLINE</span>
          </div>
        </header>

        {/* Module Grid Container */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20 flex-1">
          <Camera />
          <Voice />
          <Bluetooth />
        </main>
        
        <footer className="mt-16 pb-4 text-center text-gray-600 font-mono text-xs tracking-widest opacity-70">
          ZENITHRA SECURE SYSTEMS // SECURE CONNECTION ESTABLISHED // V2.0.0
        </footer>
      </div>
      
      {/* Subtle Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 z-50"></div>
    </div>
  );
}

export default App;
