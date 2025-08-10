// js/utils/sound.js
// Enhanced Sound Manager with background music

export class SoundManager {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.isInitialized = false;
        this.masterVolume = 0.7;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.backgroundMusic = null;
        this.isMuted = false;
        
        // Sound effect URLs (using base64 encoded simple sounds)
        this.soundUrls = {
            click: this.generateBeepSound(800, 0.1),
            pop: this.generateBeepSound(600, 0.15),
            turnChange: this.generateBeepSound(400, 0.2),
            command: this.generateBeepSound(1000, 0.1),
            success: this.generateBeepSound(1200, 0.3),
            error: this.generateBeepSound(300, 0.5)
        };
        
        this.initializeAudioContext();
    }

    // Generate simple beep sound using Web Audio API
    generateBeepSound(frequency, duration) {
        if (!this.audioContext) return null;
        
        const sampleRate = this.audioContext.sampleRate;
        const numSamples = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            // Create a simple beep with envelope
            const envelope = Math.exp(-t * 5);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        
        return buffer;
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSoundBuffers();
            this.setupBackgroundMusic();
        } catch (error) {
            console.warn('Audio context not supported:', error);
            this.soundEnabled = false;
        }
    }

    createSoundBuffers() {
        if (!this.audioContext) return;

        Object.keys(this.soundUrls).forEach(soundName => {
            const buffer = this.soundUrls[soundName];
            if (buffer) {
                this.sounds[soundName] = buffer;
            }
        });
    }

    setupBackgroundMusic() {
        // Create background music using Web Audio API
        if (!this.audioContext) return;
        
        // Create a simple ambient background music
        this.createAmbientMusic();
    }

    createAmbientMusic() {
        if (!this.audioContext) return;
        
        // Create oscillator for background music
        this.musicOscillator = this.audioContext.createOscillator();
        this.musicGain = this.audioContext.createGain();
        
        // Set up a simple ambient tone
        this.musicOscillator.type = 'sine';
        this.musicOscillator.frequency.setValueAtTime(110, this.audioContext.currentTime); // A2 note
        
        // Create a gentle gain envelope
        this.musicGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.musicGain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 2);
        
        // Connect nodes
        this.musicOscillator.connect(this.musicGain);
        this.musicGain.connect(this.audioContext.destination);
        
        // Start the oscillator
        this.musicOscillator.start();
        
        // Add some variation over time
        this.addMusicVariation();
    }

    addMusicVariation() {
        if (!this.musicOscillator || !this.audioContext) return;
        
        // Create subtle frequency variations
        const varyFrequency = () => {
            if (!this.musicOscillator || !this.musicEnabled) return;
            
            const baseFreq = 110;
            const variation = Math.sin(this.audioContext.currentTime * 0.1) * 10;
            this.musicOscillator.frequency.setValueAtTime(
                baseFreq + variation, 
                this.audioContext.currentTime
            );
            
            // Schedule next variation
            setTimeout(varyFrequency, 5000 + Math.random() * 5000);
        };
        
        // Start variations after a delay
        setTimeout(varyFrequency, 3000);
    }

    init() {
        if (this.isInitialized) return;
        
        // Resume audio context if suspended (required by some browsers)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(error => {
                console.warn('Failed to resume audio context:', error);
            });
        }
        
        this.isInitialized = true;
    }

    playSound(soundName, volume = 1.0) {
        if (!this.soundEnabled || this.isMuted || !this.audioContext || !this.sounds[soundName]) {
            return;
        }

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[soundName];
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.value = volume * this.masterVolume;
            source.start(0);
        } catch (error) {
            console.warn(`Failed to play ${soundName} sound:`, error);
        }
    }

    playClickSound() {
        this.playSound('click', 0.5);
    }

    playPopSound() {
        this.playSound('pop', 0.6);
    }

    playTurnChangeSound() {
        this.playSound('turnChange', 0.4);
    }

    playCommandSound() {
        this.playSound('command', 0.3);
    }

    playSuccessSound() {
        this.playSound('success', 0.7);
    }

    playErrorSound() {
        this.playSound('error', 0.5);
    }

    // Background music control
    playBackgroundMusic() {
        if (!this.musicEnabled || this.isMuted || !this.audioContext) return;
        
        if (this.musicGain) {
            this.musicGain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 1);
        }
    }

    pauseBackgroundMusic() {
        if (this.musicGain) {
            this.musicGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        }
    }

    // Mute/unmute all sounds
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            // Mute background music
            if (this.musicGain) {
                this.musicGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            }
            
            // Update mute button icon
            const muteButton = document.getElementById('muteBtn');
            if (muteButton) {
                muteButton.classList.add('muted');
                const icon = muteButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-volume-mute';
                }
            }
        } else {
            // Unmute background music if enabled
            if (this.musicEnabled) {
                this.playBackgroundMusic();
            }
            
            // Update mute button icon
            const muteButton = document.getElementById('muteBtn');
            if (muteButton) {
                muteButton.classList.remove('muted');
                const icon = muteButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-volume-up';
                }
            }
        }
        
        return this.isMuted;
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.musicEnabled && !this.isMuted) {
            this.playBackgroundMusic();
        } else {
            this.pauseBackgroundMusic();
        }
        
        return this.musicEnabled;
    }

    cleanup() {
        if (this.audioContext) {
            // Stop background music
            if (this.musicOscillator) {
                this.musicOscillator.stop();
                this.musicOscillator = null;
            }
            
            // Close audio context
            this.audioContext.close().catch(error => {
                console.warn('Failed to close audio context:', error);
            });
        }
    }
}

// Export singleton instance
export const soundManager = new SoundManager();
