import React, { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Camera as CameraIcon, CameraOff, AlertCircle, Loader2 } from 'lucide-react';

export default function Camera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Cleans up the media stream tracks when stopping or unmounting
  const stopTracks = (currentStream) => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
  };

  const startCamera = async () => {
    setError('');
    setIsInitializing(true);
    
    try {
      // Request video permissions from the browser
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success('Optical Sensor successfully linked.');
    } catch (err) {
      console.error('Camera Access Error:', err);
      // Generate user-friendly error messages based on common failures
      let errMessage = 'Camera access denied or unsupported.';
      if (err.name === 'NotAllowedError') errMessage = 'Permission denied by user.';
      else if (err.name === 'NotFoundError') errMessage = 'No camera hardware detected.';
      
      setError(errMessage);
      toast.error(`Optical Sensor Error: ${errMessage}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    stopTracks(stream);
    setStream(null);
    setIsActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    toast('Optical Sensor link severed.', { icon: '🔌', style: { border: '1px solid #1a1a1a' } });
  };

  // Cleanup on unmount to prevent memory leaks and persistent camera lights
  useEffect(() => {
    return () => stopTracks(stream);
  }, [stream]);

  return (
    <div className={`panel-glass ${isActive ? 'border-neon-green shadow-neon-green transform scale-105' : 'border-vault-border'} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <h2 className={`flex items-center gap-2 text-xl font-bold tracking-widest ${isActive ? 'text-neon-green' : 'text-gray-400'}`}>
          <CameraIcon size={20} className={isActive ? 'text-neon-green animate-[pulse_2s_infinite]' : 'text-gray-500'} />
          OPTICAL SENSOR
        </h2>
        
        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {isInitializing ? (
            <span className="text-yellow-400 text-xs font-mono tracking-widest flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> INIT...
            </span>
          ) : isActive ? (
            <span className="text-neon-green text-xs font-mono tracking-widest font-bold">● ACTIVE</span>
          ) : (
            <span className="text-gray-600 text-xs font-mono tracking-widest">○ IDLE</span>
          )}
        </div>
      </div>

      <div className="bg-black rounded-lg overflow-hidden border border-gray-800 aspect-[4/3] relative flex items-center justify-center mb-6 shadow-inner">
        {error ? (
          <div className="flex flex-col items-center gap-2 text-red-500 font-mono text-center p-4">
            <AlertCircle size={32} />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-500 ${!isActive ? 'opacity-0' : 'opacity-100'}`}
          ></video>
        )}
        
        {!isActive && !error && (
          <div className="flex flex-col items-center gap-2 text-gray-600 font-mono tracking-widest text-sm">
            <CameraOff size={32} className="opacity-50" />
            <span>SENSOR OFFLINE</span>
          </div>
        )}
        
        {/* Decorative Grid Overlay for Futuristic Look */}
        {isActive && !error && (
          <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wIDQwVjAiIHN0cm9rZT0icmdiYSg1NywgMjU1LCAyMCwgMC4xKSIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-20 mix-blend-screen"></div>
        )}
      </div>

      <div className="flex gap-4">
        {!isActive ? (
          <button 
            onClick={startCamera} 
            disabled={isInitializing}
            className={`btn-neon-green flex-1 tracking-widest text-sm flex justify-center items-center gap-2 ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isInitializing ? <Loader2 size={16} className="animate-spin"/> : <CameraIcon size={16} />}
            INITIATE LINK
          </button>
        ) : (
          <button 
            onClick={stopCamera} 
            className="btn-danger flex-1 tracking-widest text-sm flex justify-center items-center gap-2"
          >
            <CameraOff size={16} />
            SEVER LINK
          </button>
        )}
      </div>
    </div>
  );
}
