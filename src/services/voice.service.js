// Voice service using Web Speech API (free, built into browsers)

class VoiceService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentUtterance = null;
    this.isInitialized = false;

    // Load voices (they may load asynchronously)
    this.loadVoices();

    // Some browsers fire voiceschanged event when voices are loaded
    if (this.synth.addEventListener) {
      this.synth.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    this.isInitialized = true;
  }

  // Check if speech synthesis is supported
  isSupported() {
    return 'speechSynthesis' in window;
  }

  // Get available voices
  getVoices() {
    return this.voices;
  }

  // Get a good English voice
  getDefaultVoice() {
    // Try to find a high-quality English voice
    const preferredVoices = [
      'Google US English',
      'Microsoft David Desktop - English (United States)',
      'Alex',
      'Samantha'
    ];

    for (const name of preferredVoices) {
      const voice = this.voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }

    // Fallback to any English voice
    const englishVoice = this.voices.find(v => v.lang.startsWith('en'));
    return englishVoice || this.voices[0];
  }

  // Speak text
  speak(text, options = {}) {
    if (!this.isSupported()) {
      console.error('Speech synthesis not supported');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    // Cancel any ongoing speech
    this.stop();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice
      if (options.voice) {
        utterance.voice = options.voice;
      } else {
        utterance.voice = this.getDefaultVoice();
      }

      // Set parameters
      utterance.rate = options.rate || 1.0;  // Speed (0.1 to 10)
      utterance.pitch = options.pitch || 1.0;  // Pitch (0 to 2)
      utterance.volume = options.volume || 1.0;  // Volume (0 to 1)
      utterance.lang = options.lang || 'en-US';

      // Event listeners
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  // Stop speaking
  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  // Pause speaking
  pause() {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  // Resume speaking
  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synth.speaking;
  }

  // Check if paused
  isPaused() {
    return this.synth.paused;
  }

  // Speech Recognition (Speech-to-Text)
  isRecognitionSupported() {
    return typeof window !== 'undefined' &&
           ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  startListening(onResult, onError) {
    if (!this.isRecognitionSupported()) {
      const error = new Error('Speech recognition not supported in this browser');
      if (onError) onError(error);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.continuous = false;  // Stop after one result
    this.recognition.interimResults = false;  // Only final results
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Handle results
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    // Handle errors
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (onError) onError(new Error(`Recognition error: ${event.error}`));
    };

    // Handle end
    this.recognition.onend = () => {
      this.recognition = null;
    };

    // Start recognition
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      if (onError) onError(error);
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      this.recognition = null;
    }
  }

  isListening() {
    return this.recognition !== null;
  }
}

// Create singleton instance
const voiceService = new VoiceService();

export default voiceService;