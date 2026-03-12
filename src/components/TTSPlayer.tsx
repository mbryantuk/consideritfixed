'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import styles from './TTSPlayer.module.css';

interface TTSPlayerProps {
  text: string;
}

export default function TTSPlayer({ text }: TTSPlayerProps) {
  const [isSpeaking, setIsLargeText] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleToggle = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsLargeText(false);
      setIsPaused(false);
    } else {
      // Clean up markdown-ish text for better reading
      const cleanText = text
        .replace(/#+\s/g, '') // remove headings
        .replace(/\*\*|\*/g, '') // remove bold/italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links but keep text
        .replace(/`[^`]+`/g, ''); // remove code

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => {
        setIsLargeText(false);
        setIsPaused(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsLargeText(true);
    }
  };

  const handlePause = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  if (!supported) return null;

  return (
    <div className={styles.container}>
      <button 
        onClick={handleToggle} 
        className={`${styles.button} ${isSpeaking ? styles.active : ''}`}
        title={isSpeaking ? "Stop Reading" : "Read Article Aloud"}
      >
        {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
        <span>{isSpeaking ? "Stop Reading" : "Listen to Guide"}</span>
      </button>

      {isSpeaking && (
        <button 
          onClick={handlePause} 
          className={styles.pauseButton}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      )}
    </div>
  );
}