import bossWinTrack from "../../assets/audio/bossWin.mp3";

type Tone = {
  frequency: number;
  duration: number;
  gain?: number;
  type?: OscillatorType;
};

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextConstructor =
    window.AudioContext ??
    (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextConstructor();
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

function playSequence(sequence: Tone[]) {
  const context = getAudioContext();
  if (!context) return;

  let startAt = context.currentTime;

  for (const tone of sequence) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = tone.type ?? "sine";
    oscillator.frequency.setValueAtTime(tone.frequency, startAt);

    const peakGain = tone.gain ?? 0.035;
    gainNode.gain.setValueAtTime(0.0001, startAt);
    gainNode.gain.exponentialRampToValueAtTime(peakGain, startAt + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startAt);
    oscillator.stop(startAt + tone.duration + 0.02);

    startAt += tone.duration + 0.02;
  }
}

function playAudioFile(src: string, volume = 0.68) {
  if (typeof window === "undefined") return;

  const audio = new Audio(src);
  audio.volume = volume;
  audio.preload = "auto";

  void audio.play().catch(() => {
    playSequence([
      { frequency: 392, duration: 0.06, type: "triangle" },
      { frequency: 523, duration: 0.08, type: "triangle" },
      { frequency: 659, duration: 0.1, type: "triangle" },
      { frequency: 880, duration: 0.18, type: "triangle", gain: 0.05 },
    ]);
  });
}

export const sounds = {
  click: () =>
    playSequence([
      { frequency: 440, duration: 0.05, type: "square", gain: 0.018 },
      { frequency: 620, duration: 0.04, type: "square", gain: 0.012 },
    ]),
  correct: () =>
    playSequence([
      { frequency: 523, duration: 0.06, type: "triangle" },
      { frequency: 659, duration: 0.08, type: "triangle" },
      { frequency: 784, duration: 0.1, type: "triangle" },
    ]),
  wrong: () =>
    playSequence([
      { frequency: 320, duration: 0.08, type: "sawtooth", gain: 0.02 },
      { frequency: 240, duration: 0.1, type: "sawtooth", gain: 0.02 },
    ]),
  bossWin: () => playAudioFile(bossWinTrack),
  gameOver: () =>
    playSequence([
      { frequency: 330, duration: 0.08, type: "sawtooth", gain: 0.02 },
      { frequency: 247, duration: 0.1, type: "sawtooth", gain: 0.02 },
      { frequency: 196, duration: 0.18, type: "sawtooth", gain: 0.025 },
    ]),
};
