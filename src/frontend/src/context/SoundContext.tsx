import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface SoundContextValue {
  muted: boolean;
  toggleMute: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playComplete: (score: number) => void;
}

export const SoundContext = createContext<SoundContextValue>({
  muted: false,
  toggleMute: () => {},
  playCorrect: () => {},
  playIncorrect: () => {},
  playComplete: () => {},
});

export function useSoundContext() {
  return useContext(SoundContext);
}

type AudioContextType = typeof AudioContext;

function getAudioContext(): AudioContext | null {
  try {
    const Ctx: AudioContextType =
      window.AudioContext ||
      (window as { webkitAudioContext?: AudioContextType })
        .webkitAudioContext ||
      AudioContext;
    if (!Ctx) return null;
    return new Ctx();
  } catch {
    return null;
  }
}

function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  maxGain: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem("numbuddy_muted") === "true";
    } catch {
      return false;
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = getAudioContext();
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("numbuddy_muted", muted ? "true" : "false");
    } catch {}
  }, [muted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const playCorrect = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    // C5 then E5
    playNote(ctx, 523, now, 0.12, 0.25);
    playNote(ctx, 659, now + 0.15, 0.12, 0.25);
  }, [muted, getCtx]);

  const playIncorrect = useCallback(() => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Single G3, soft
    playNote(ctx, 196, now, 0.18, 0.15);
  }, [muted, getCtx]);

  const playComplete = useCallback(
    (score: number) => {
      if (muted) return;
      const ctx = getCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      if (score >= 4) {
        // C5 → E5 → G5 → C6
        const freqs = [523, 659, 784, 1047];
        freqs.forEach((freq, i) => {
          playNote(ctx, freq, now + i * 0.14, 0.12, 0.22);
        });
      } else {
        // E4 → G4
        playNote(ctx, 330, now, 0.12, 0.18);
        playNote(ctx, 392, now + 0.14, 0.12, 0.18);
      }
    },
    [muted, getCtx],
  );

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <SoundContext.Provider
      value={{ muted, toggleMute, playCorrect, playIncorrect, playComplete }}
    >
      {children}
    </SoundContext.Provider>
  );
}
