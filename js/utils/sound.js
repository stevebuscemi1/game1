// Sound Management System
export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.backgroundMusic = null;
    this.musicVolume = 0.3;
    this.soundsEnabled = true;
    this.initialized = false;
    this.audioContextInitialized = false;
  }
  
  // Initialize audio context (requires user interaction)
  init() {
    if (this.initialized) return;
    
    // Setup background music
    this.backgroundMusic = document.getElementById('backgroundMusic');
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume;
      // Set the source explicitly to ensure it uses the external URL
      this.backgroundMusic.src = 'https://www.chosic.com/wp-content/uploads/2021/05/Adventure-320bit(chosic.com).mp3';
      this.backgroundMusic.load();
      this.tryAutoplay();
    }
    
    // Setup user interaction listener
    document.addEventListener('click', () => this.onUserInteraction(), { once: true });
    this.initialized = true;
  }
  
  // Try to autoplay background music
  tryAutoplay() {
    if (!this.backgroundMusic) return;
    
    const playPromise = this.backgroundMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        console.log('Background music started automatically');
      }).catch(error => {
        console.log('Autoplay prevented, will start on user interaction');
        // Set up to play on first interaction
        document.addEventListener('click', () => {
          if (this.backgroundMusic && this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
          }
        }, { once: true });
      });
    }
  }
  
  // Handle first user interaction for audio
  onUserInteraction() {
    // Start background music
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
    }
    
    // Initialize audio context if not already done
    if (!this.audioContextInitialized) {
      this.initAudioContext();
      this.audioContextInitialized = true;
    }
  }
  
  // Initialize Web Audio API
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Audio context initialized');
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }
  
  // Create sound effects
  createOscillator(frequency, duration, type = 'sine') {
    if (!this.soundsEnabled || !this.audioContext) return null;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      return { oscillator, gainNode };
    } catch (error) {
      console.error('Error creating oscillator:', error);
      return null;
    }
  }
  
  // Sound effect methods
  playPopSound() {
    const { oscillator, gainNode } = this.createOscillator(800, 0.1);
    if (!oscillator) return;
    
    try {
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('Error playing pop sound:', error);
    }
  }
  
  playSuccessSound() {
    const { oscillator, gainNode } = this.createOscillator(523.25, 0.3);
    if (!oscillator) return;
    
    try {
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  }
  
  playClickSound() {
    const { oscillator, gainNode } = this.createOscillator(600, 0.05);
    if (!oscillator) return;
    
    try {
      oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.05);
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  }
  
  playTurnChangeSound() {
    const { oscillator, gainNode } = this.createOscillator(400, 0.2);
    if (!oscillator) return;
    
    try {
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing turn change sound:', error);
    }
  }
  
  playCommandSound() {
    const { oscillator, gainNode } = this.createOscillator(700, 0.2);
    if (!oscillator) return;
    
    try {
      oscillator.frequency.setValueAtTime(700, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(900, this.audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Error playing command sound:', error);
    }
  }
  
  // Toggle sounds
  toggleSounds() {
    this.soundsEnabled = !this.soundsEnabled;
    console.log('Sounds enabled:', this.soundsEnabled);
    return this.soundsEnabled;
  }
  
  // Set music volume
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume;
    }
  }
  
  // Pause background music
  pauseMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }
  
  // Resume background music
  resumeMusic() {
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(e => console.log('Music resume failed:', e));
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();