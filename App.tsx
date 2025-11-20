import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Bell, BellOff, Volume2, Zap, Music, WifiOff, Wifi } from 'lucide-react';
import { SCHEDULE_DATA } from './constants';
import { getCurrentScheduleItem, formatTime, isExactStartTime } from './utils/timeUtils';
import { audioService } from './services/audioService';
import { CurrentActivityCard } from './components/CurrentActivityCard';
import { ScheduleList } from './components/ScheduleList';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(true);
  const [lastTriggeredId, setLastTriggeredId] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Main Clock Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Network Status Listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Current Item Logic
  const currentItem = getCurrentScheduleItem(SCHEDULE_DATA, currentTime);
  
  // Next Item Logic
  const currentIndex = SCHEDULE_DATA.findIndex(i => i.id === currentItem?.id);
  const nextItem = currentIndex !== -1 && currentIndex < SCHEDULE_DATA.length - 1 
    ? SCHEDULE_DATA[currentIndex + 1] 
    : SCHEDULE_DATA[0]; // Loop back to start or null

  // Alarm Logic
  useEffect(() => {
    if (!isEnabled) return;

    SCHEDULE_DATA.forEach(item => {
      if (isExactStartTime(item.startTime, currentTime)) {
        // Prevent double triggering in the same minute window
        if (lastTriggeredId !== item.id) {
          console.log(`Triggering alarm for: ${item.activity}`);
          audioService.triggerAlarm();
          setLastTriggeredId(item.id);
          
          // Reset last triggered after a minute to allow cycle to work next day
          setTimeout(() => setLastTriggeredId(null), 60000);
        }
      }
    });
  }, [currentTime, isEnabled, lastTriggeredId]);

  // Enable/Disable Handler
  const toggleEnabled = useCallback(() => {
    if (!isEnabled) {
      // Initialize audio context on user gesture
      audioService.playBeep(0.1).catch(e => console.error("Audio play failed", e));
      // Try to vibrate briefly to trigger permissions if needed
      audioService.vibrate(200);
    }
    setIsEnabled(prev => !prev);
  }, [isEnabled]);

  const handleTest = () => {
    audioService.triggerAlarm();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      audioService.setCustomSound(file);
      setCustomFileName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daily Focus</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 text-sm">Stay on track with your goals</p>
              {isOffline && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-200 text-gray-600 text-xs font-medium">
                  <WifiOff className="w-3 h-3" /> Offline Mode
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-slate-700">
              {formatTime(currentTime).split(' ')[0]}
              <span className="text-sm ml-1 text-slate-400">{formatTime(currentTime).split(' ')[1]}</span>
            </div>
            <div className="flex justify-end items-center gap-2 text-xs text-slate-400">
               <div className="flex items-center gap-1">
                 {isEnabled ? <Bell className="w-3 h-3 text-green-500" /> : <BellOff className="w-3 h-3 text-red-500" />}
                 {isEnabled ? 'Alarms Active' : 'Alarms Silent'}
               </div>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="mb-6">
          <div className="flex gap-3 mb-3">
            <button
              onClick={toggleEnabled}
              className={`
                flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-lg font-bold transition-all shadow-lg
                ${isEnabled 
                  ? 'bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.01]'
                }
              `}
            >
              {isEnabled ? (
                <>
                  <Pause className="w-6 h-6" /> Stop Tracking
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" /> Start Schedule
                </>
              )}
            </button>
            
            <button
              onClick={handleTest}
              className="w-[20%] flex flex-col items-center justify-center rounded-xl bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 hover:text-slate-900 hover:border-gray-300 transition-all shadow-sm active:scale-95"
              title="Test Alarm"
            >
               <Zap className="w-5 h-5 mb-1" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Test</span>
            </button>
          </div>

          {/* Sound Selection */}
          <div className="flex flex-col items-center justify-center">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="audio/*" 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors py-2 group"
            >
                <Music className="w-4 h-4 group-hover:text-blue-500" />
                <span>Sound: <span className="font-medium text-slate-700">{customFileName || "Default Alarm"}</span></span>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">Change</span>
            </button>

            {!isEnabled && (
              <p className="text-center text-xs text-slate-400 mt-1">
                <Volume2 className="w-3 h-3 inline mr-1" />
                Tap Start to enable sound & vibration
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Active Card */}
          <div>
             <div className="sticky top-6">
               <CurrentActivityCard item={currentItem} nextItem={nextItem} />
             </div>
          </div>

          {/* Right Column: Full List */}
          <div>
            <ScheduleList items={SCHEDULE_DATA} activeId={currentItem?.id || null} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;