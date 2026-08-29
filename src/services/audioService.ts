// Audio Service: Singleton managing HTML5 Audio and Web Audio API Analyser

type PlaybackCallback = (state: {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isLoading: boolean;
  buffered: number;
}) => void;

type FrequencyCallback = (data: Uint8Array) => void;

class AudioService {
  private audio: HTMLAudioElement;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private frequencyData: Uint8Array | null = null;
  private animationFrameId: number | null = null;

  private onStateChange: PlaybackCallback | null = null;
  private onFrequencyChange: FrequencyCallback | null = null;
  private onTrackEnded: (() => void) | null = null;
  private onError: ((err: string) => void) | null = null;

  private isInitialized = false;

  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audio.preload = 'auto';

    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.notifyState();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.notifyState();
    });

    this.audio.addEventListener('progress', () => {
      this.notifyState();
    });

    this.audio.addEventListener('ended', () => {
      if (this.onTrackEnded) this.onTrackEnded();
    });

    this.audio.addEventListener('play', () => {
      this.ensureAudioContext();
      this.startVisualizerLoop();
      this.notifyState();
    });

    this.audio.addEventListener('pause', () => {
      this.stopVisualizerLoop();
      this.notifyState();
    });

    this.audio.addEventListener('waiting', () => {
      this.notifyState(true);
    });

    this.audio.addEventListener('playing', () => {
      this.notifyState(false);
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback error encountered:', e);
      if (this.onError) {
        this.onError('Unable to play audio stream.');
      }
    });
  }

  private ensureAudioContext() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.isInitialized = true;
    } catch {
      // If CORS prevents createMediaElementSource, fallback gracefully
      this.isInitialized = false;
    }
  }

  private startVisualizerLoop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const updateLoop = () => {
      if (this.analyser && this.frequencyData && this.onFrequencyChange) {
        this.analyser.getByteFrequencyData(this.frequencyData as unknown as Uint8Array<ArrayBuffer>);
        this.onFrequencyChange(this.frequencyData);
      }
      if (!this.audio.paused) {
        this.animationFrameId = requestAnimationFrame(updateLoop);
      }
    };

    this.animationFrameId = requestAnimationFrame(updateLoop);
  }

  private stopVisualizerLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private notifyState(isLoadingOverride?: boolean) {
    if (!this.onStateChange) return;

    let buffered = 0;
    if (this.audio.buffered.length > 0) {
      buffered = this.audio.buffered.end(this.audio.buffered.length - 1);
    }

    const isLoading = isLoadingOverride ?? (this.audio.readyState < 3 && !this.audio.paused);

    this.onStateChange({
      currentTime: this.audio.currentTime || 0,
      duration: isNaN(this.audio.duration) ? 0 : this.audio.duration,
      isPlaying: !this.audio.paused && !this.audio.ended,
      isLoading,
      buffered,
    });
  }

  // Public Controls
  public async loadAndPlay(url: string, startTime = 0): Promise<void> {
    if (this.audio.src !== url) {
      this.audio.src = url;
      this.audio.currentTime = startTime;
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    try {
      await this.audio.play();
    } catch (err) {
      console.warn('Autoplay prevented or network error:', err);
    }
  }

  public async play(): Promise<void> {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    await this.audio.play();
  }

  public pause(): void {
    this.audio.pause();
  }

  public seek(seconds: number): void {
    if (!isNaN(seconds) && isFinite(seconds)) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || 0));
    }
  }

  public setVolume(val: number): void {
    this.audio.volume = Math.max(0, Math.min(1, val));
  }

  public setPlaybackRate(rate: number): void {
    this.audio.playbackRate = rate;
  }

  public setCallbacks(callbacks: {
    onStateChange?: PlaybackCallback;
    onFrequencyChange?: FrequencyCallback;
    onTrackEnded?: () => void;
    onError?: (err: string) => void;
  }) {
    if (callbacks.onStateChange) this.onStateChange = callbacks.onStateChange;
    if (callbacks.onFrequencyChange) this.onFrequencyChange = callbacks.onFrequencyChange;
    if (callbacks.onTrackEnded) this.onTrackEnded = callbacks.onTrackEnded;
    if (callbacks.onError) this.onError = callbacks.onError;
  }

  public getAudioElement(): HTMLAudioElement {
    return this.audio;
  }
}

export const audioService = new AudioService();
