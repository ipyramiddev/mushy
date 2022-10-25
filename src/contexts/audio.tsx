import { createContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

interface IAudioContextProvider {
  children: React.ReactNode;
}

/**
 * An audio element provider with the intention that only one 
 * audio source is played at any given time during a session. 
 * The main way that components should interact with this context 
 * is by calling the `trigger()` method. The `AudioContext` listens 
 * for route changes to react to most events that should cause audio 
 * playback to stop. In addition, it exposes a `clear()` method for 
 * components to stop playback and clear the source on non-route changes.
 */
export interface IAudioContext {

  /**
   * Triggers a reaction on the audio player. Passing in the same source will
   * pause the player. Passing in a new source will switch to playing the
   * new source. Playback will not start until the audio has been loaded enough
   * to play.
   * 
   * @param source source to be played
   */
  trigger: (source: string) => void;
  /**
   * Stops playback if necessary and clears the current source from the audio object.
   * Generally you only need to call this for intra-page events that should stop playback.
   */
  clear: () => void;
  isPlaying: boolean;
}

const AudioContext = createContext({} as IAudioContext);

export function AudioContextProvider({ children }: IAudioContextProvider) {
  const location = useLocation();
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    clear();
  }, [location])
  const audioRef = useRef<HTMLAudioElement>(null);

  
  const trigger = (source: string) => {
    const audio: HTMLAudioElement | null = audioRef.current;
    if (source && audio) {
        if (audio.src !== source) {
            audio.pause();
            setPlaying(false);
            audio.src = source;
            audio.oncanplaythrough = () => {
              audio.play();
              setPlaying(true);
            }
        } else if (audio.paused) {
            audio.play();
            setPlaying(true);
        } else {
            audio.pause();
            setPlaying(false);
        }
    }
  }

  const isPlaying = playing;

  const clear = () => {
    const audio: HTMLAudioElement | null = audioRef.current;
    if (audio) {
        audio.pause();
        audio.src = '';
    }
  }

  return (
    <AudioContext.Provider value={{ trigger, clear, isPlaying }}>
      <>
        {children}
        <audio ref={audioRef}/>
      </>
    </AudioContext.Provider>
  );
}

export default AudioContext;
