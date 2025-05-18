
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useNarration } from "@/hooks/useNarration";
import { VolumeX, Volume1, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface NarrationControlsProps {
  text: string;
}

export const NarrationControls = ({ text }: NarrationControlsProps) => {
  const {
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
  } = useNarration();
  
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const handlePlayPause = () => {
    if (!text) {
      toast.error("No text available to narrate.");
      return;
    }
    
    if (!isPlaying) {
      speak(text);
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };
  
  const handleStop = () => {
    if (isPlaying) {
      stop();
    }
  };
  
  // Handle language toggle
  const handleLanguageToggle = () => {
    toggleLanguage();
    
    if (isPlaying) {
      // Restart narration in new language
      const wasPlaying = true;
      stop();
      setTimeout(() => {
        if (wasPlaying) speak(text);
      }, 100);
    }
    
    toast.info(`Switched to ${currentLanguage === 'en-US' ? 'Indonesian' : 'English'}`);
  };
  
  // Volume control
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    adjustVolume(newVolume);
  };
  
  const handleVolumeIconClick = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  // Display appropriate volume icon based on level
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handlePlayPause}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 bg-secondary"
      >
        {isPlaying && !isPaused ? "Pause" : isPaused ? "Resume" : "Bacakan"}
      </Button>
      
      {isPlaying && (
        <Button
          onClick={handleStop}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
        >
          Stop
        </Button>
      )}
      
      <Button
        onClick={handleLanguageToggle}
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
      >
        {currentLanguage === 'en-US' ? '🇺🇸' : '🇮🇩'}
      </Button>
      
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleVolumeIconClick} 
          className="p-1"
        >
          <VolumeIcon className="h-4 w-4" />
        </Button>
        
        {showVolumeSlider && (
          <div 
            className="absolute -left-16 bottom-10 p-3 bg-background border shadow-md rounded-md z-10 min-w-[120px]"
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Slider 
              value={[volume]} 
              min={0} 
              max={1} 
              step={0.05} 
              onValueChange={handleVolumeChange}
            />
          </div>
        )}
      </div>
      
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
};
