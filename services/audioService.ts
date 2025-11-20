class AudioService {
  private audioCtx: AudioContext | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;

  // Direct download link for the provided Google Drive file (Default)
  private readonly DEFAULT_ALARM_URL = 'https://docs.google.com/uc?export=download&id=1HbYFSCAKJHW2XaWsa1fZy_qkTDDDFTLA';

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize with default sound
      this.activeAudio = new Audio(this.DEFAULT_ALARM_URL);
      this.activeAudio.preload = 'auto';
    }
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  /**
   * Sets a custom audio file as the alarm sound.
   */
  public setCustomSound(file: File) {
    if (typeof window !== 'undefined') {
      // Clean up previous object URL if it exists to avoid memory leaks
      if (this.currentObjectUrl) {
        URL.revokeObjectURL(this.currentObjectUrl);
      }
      
      this.currentObjectUrl = URL.createObjectURL(file);
      this.activeAudio = new Audio(this.currentObjectUrl);
      this.activeAudio.preload = 'auto';
    }
  }

  /**
   * Plays the alarm sound for a specific duration (default 2s).
   * Uses the active audio (default or custom) if available, falls back to oscillator.
   */
  public async playBeep(duration: number = 2.0) {
    let playedCustom = false;

    if (this.activeAudio) {
      try {
        // Reset audio to start
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
        
        // Ensure volume is up
        this.activeAudio.volume = 1.0;
        
        // Attempt to play
        const playPromise = this.activeAudio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          playedCustom = true;

          // Stop playback after the duration (clip the sound)
          setTimeout(() => {
            if (this.activeAudio) {
              this.activeAudio.pause();
              this.activeAudio.currentTime = 0;
            }
          }, duration * 1000);
        }
      } catch (error) {
        console.warn('Audio playback failed, falling back to system beep.', error);
        playedCustom = false;
      }
    }

    // If audio file failed (or didn't exist), use the oscillator
    if (!playedCustom) {
      await this.playOscillatorBeep(duration);
    }
  }

  private async playOscillatorBeep(duration: number) {
    this.initContext();
    
    if (!this.audioCtx) return;

    // Resume context if suspended (browser policy)
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    // Play a distinct digital alarm beep (Square wave)
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    // Square wave sounds more like a digital watch/alarm
    oscillator.type = 'square';
    
    // Standard alarm frequency
    oscillator.frequency.setValueAtTime(880, this.audioCtx.currentTime); 
    
    // Constant volume, then quick fade out at the very end
    gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start();
    oscillator.stop(this.audioCtx.currentTime + duration);
  }

  public vibrate(duration: number = 2000) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      // Vibrate for the specified duration
      navigator.vibrate(duration);
    }
  }

  public triggerAlarm() {
    // Trigger both sound and vibration
    // We don't await the sound here so vibration starts immediately
    this.playBeep(2.0);
    this.vibrate(2000);
  }
}

export const audioService = new AudioService();