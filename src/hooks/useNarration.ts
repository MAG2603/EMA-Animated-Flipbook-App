
import { useState, useRef } from 'react';

type VoiceLanguage = 'id-ID' | 'en-US';

export const useNarration = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<VoiceLanguage>('en-US');
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to speech synthesis objects
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Find voice for language
  const getVoiceForLanguage = (language: VoiceLanguage): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a voice for the specific language
    const voice = voices.find(voice => voice.lang.startsWith(language.substring(0, 2)));
    
    if (!voice) {
      console.warn(`No voice found for language ${language}. Using default.`);
    }
    
    return voice || null;
  };

  // Speak text with selected voice
  const speak = (text: string) => {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Set voice based on language
      setTimeout(() => {
        const voice = getVoiceForLanguage(currentLanguage);
        if (voice) utterance.voice = voice;
        
        utterance.lang = currentLanguage;
        utterance.volume = volume;
        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };
        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setError('An error occurred with the narration feature.');
          setIsPlaying(false);
          setIsPaused(false);
        };
        
        window.speechSynthesis.speak(utterance);
      }, 100); // Small delay to ensure voices are loaded
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setError('Your browser might not support the text-to-speech feature.');
    }
  };

  // Pause narration
  const pause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Resume narration
  const resume = () => {
    if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Stop narration
  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Toggle language
  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'en-US' ? 'id-ID' : 'en-US');
  };

  // Adjust volume
  const adjustVolume = (newVolume: number) => {
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    setVolume(clampedVolume);
    
    // Update current utterance if playing
    if (utteranceRef.current) {
      utteranceRef.current.volume = clampedVolume;
    }
  };
  
  return {
    isPlaying,
    isPaused,
    currentLanguage,
    volume,
    error,
    speak,
    pause,
    resume,
    stop,
    toggleLanguage,
    adjustVolume
  };
};
