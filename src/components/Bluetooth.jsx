import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Bluetooth as BluetoothIcon, BluetoothOff, AlertCircle, Loader2 } from 'lucide-react';

export default function Bluetooth() {
  const [device, setDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const scanForDevices = async () => {
    setError('');
    
    // Explicit browser support check
    if (!navigator.bluetooth) {
      setError('Web Bluetooth API is not supported in this browser.');
      toast.error('Proximity Radar: Browser unsupported.');
      return;
    }

    try {
      setIsScanning(true);
      // Wait for user to interact with the device picker
      const selectedDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      });
      setDevice(selectedDevice);
      setIsScanning(false);
      toast.success(`Successfully paired with ${selectedDevice.name || 'Unknown Device'}`);
    } catch (err) {
      console.error('Bluetooth Error:', err);
      setIsScanning(false);
      
      // Specifically handle User Canceled vs Hardware issues
      if (err.name === 'NotFoundError') {
        toast('Device selection cancelled.', { icon: 'ℹ️', style: { border: '1px solid #1a1a1a' } });
      } else {
        const errMessage = err.message || 'Device selection failed.';
        setError(errMessage);
        toast.error(`Proximity Radar Error: ${errMessage}`);
      }
    }
  };

  return (
    <div className={`panel-glass ${device ? 'border-neon-green shadow-neon-green transform scale-105' : 'border-vault-border'} transition-all duration-300 flex flex-col`}>
      <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
        <h2 className={`flex items-center gap-2 text-xl font-bold tracking-widest ${device || isScanning ? 'text-neon-green' : 'text-gray-400'}`}>
          <BluetoothIcon size={20} className={device || isScanning ? 'text-neon-green' : 'text-gray-500'} />
          PROXIMITY RADAR
        </h2>
        
        {/* Status Indicators */}
        <div className="flex flex-col items-end">
          {isScanning ? (
            <span className="text-yellow-400 text-xs font-mono tracking-widest font-bold flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> SCANNING
            </span>
          ) : device ? (
            <span className="text-neon-green text-xs font-mono font-bold tracking-widest">● CONNECTED</span>
          ) : (
            <span className="text-gray-600 text-xs font-mono tracking-widest">○ DISCONNECTED</span>
          )}
        </div>
      </div>

      <div className="bg-black rounded-lg border border-gray-800 aspect-[4/3] flex-1 p-4 mb-6 font-mono flex flex-col justify-center relative shadow-inner overflow-hidden">
        {/* Animated Radar Background Decor */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-gray-800 opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full border border-gray-800 opacity-40 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full border border-gray-800 opacity-60 pointer-events-none"></div>
        {isScanning && (
          <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] border-r-2 border-neon-green rounded-full animate-[spin_2s_linear_infinite] opacity-50 origin-[0%_0%] pointer-events-none"></div>
        )}

        <div className="relative z-10 text-center">
            {error ? (
              <div className="flex flex-col items-center gap-2 text-red-500 mt-4">
                 <AlertCircle size={32} />
                 <p className="text-sm">{error}</p>
              </div>
            ) : device ? (
              <div className="mt-4 flex flex-col items-center">
                  <div className="bg-neon-green text-black rounded-full p-2 mb-2 animate-bounce">
                      <BluetoothIcon size={24} />
                  </div>
                  <p className="text-neon-green font-bold text-lg mb-2">{device.name || 'UNKNOWN DEVICE'}</p>
                  <div className="bg-gray-900 inline-block px-3 py-1 rounded text-xs text-gray-400 font-mono tracking-wider border border-gray-700">
                     ID: {device.id ? device.id.substring(0, 16) + '...' : 'N/A'}
                  </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-600 mt-4 opacity-80">
                 <BluetoothOff size={32} className="mb-2 opacity-50" />
                 <p className="italic tracking-widest text-sm text-center">NO DEVICE PAIRED</p>
              </div>
            )}
        </div>
      </div>

      <div className="flex gap-4 mt-auto">
        <button 
          onClick={scanForDevices} 
          className={`btn-neon-green flex-1 tracking-widest text-sm flex justify-center items-center gap-2 ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isScanning}
        >
          {isScanning ? (
            <><Loader2 size={16} className="animate-spin" /> SCANNING O-GRID...</>
          ) : (
            <><BluetoothIcon size={16} /> SCAN PROXIMITY</>
          )}
        </button>
      </div>
    </div>
  );
}
