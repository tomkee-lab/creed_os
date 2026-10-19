/**
 * Zero-Dependency Web Audio API Synthesizer
 * Inspired by scratch-audio and piezo buzzer frequency generators.
 * Provides micro:bit buzzer emulation and musical note playback.
 */

const NOTE_FREQUENCIES: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5
};

export class WebAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentWaveform: OscillatorType = 'square';
  private masterGain: GainNode | null = null;
  private tempoBpm: number = 120;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public async resume(): Promise<void> {
    if (typeof window === 'undefined') return;
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume warning:', err);
      }
    }
  }

  public setWaveform(wave: OscillatorType) {
    this.currentWaveform = wave;
  }

  public setVolume(volumePct: number) {
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;
    const vol = this.isMuted ? 0 : (Math.max(0, Math.min(100, volumePct)) / 100 * 0.7);
    this.masterGain.gain.setValueAtTime(vol, ctx.currentTime);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    const ctx = this.getAudioContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    const ctx = this.getAudioContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, ctx.currentTime);
    }
  }

  public setTempo(bpm: number) {
    this.tempoBpm = Math.max(30, Math.min(300, bpm));
  }

  public stopAll() {
    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, now + 0.05);
      } catch {}
    }
  }

  public playTone(freq: number, durationMs: number = 250, wave?: OscillatorType) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = wave || this.currentWaveform;
      osc.frequency.setValueAtTime(Math.max(20, Math.min(6000, freq)), ctx.currentTime);

      const now = ctx.currentTime;
      const durationSec = Math.max(0.02, durationMs / 1000);

      // Attack - Sustain - Release Envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
      gain.gain.setValueAtTime(0.35, now + durationSec - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + durationSec + 0.01);
    } catch (e) {
      console.warn('WebAudio tone warning:', e);
    }
  }

  public playNote(note: string, beats: number = 1) {
    const freq = NOTE_FREQUENCIES[note.toUpperCase()] || 440;
    // Standard beat duration derived from tempo (60 / tempoBpm * 1000 ms)
    const beatDurationMs = (60 / this.tempoBpm) * 1000;
    const durationMs = beats * beatDurationMs;
    this.playTone(freq, durationMs);
  }

  public playEffect(effect: string) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const type = (effect || '').toUpperCase();

      if (type === 'MISSION_START' || type === 'START') {
        // Crisp dual rising chime for mission launch sequence (587Hz -> 880Hz)
        [587.33, 880.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.09;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.setValueAtTime(0.4, start);
          gain.gain.linearRampToValueAtTime(0.0001, start + 0.14);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(start);
          osc.stop(start + 0.15);
        });
      } else if (type === 'MOTOR_STEP') {
        // Restrained mechanical stepper motor step pulse (tactile physical feedback, 580Hz -> 280Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.045);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.045);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'SONAR_PING') {
        // Pure hydroacoustic / LiDAR distance ping for obstacle detection
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(960, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === 'LASER') {
        // High-frequency downward frequency sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (type === 'SIREN') {
        // Pitch oscillating alert
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(950, now + 0.15);
        osc.frequency.linearRampToValueAtTime(600, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.33);
      } else if (type === 'FANFARE') {
        // Ascending major triad arpeggio
        const notes = [261.63, 329.63, 392.0, 523.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.08;
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.15, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(start);
          osc.stop(start + 0.1);
        });
      } else if (type === 'POWER_UP') {
        // Rising chirp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.23);
      } else if (type === 'ALARM' || type === 'ERROR') {
        // Staccato dual warning buzz pulses for errors
        [0, 0.12].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + offset;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(360, start);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.setValueAtTime(0.25, start);
          gain.gain.linearRampToValueAtTime(0.0001, start + 0.09);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(start);
          osc.stop(start + 0.1);
        });
      } else if (type === 'JUMP') {
        // Springy acoustic boing jump effect
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.23);
      } else if (type === 'CHIRP') {
        // Cheerful droid double warble chirp
        [0, 0.08].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + offset;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(idx === 0 ? 600 : 920, start);
          osc.frequency.exponentialRampToValueAtTime(idx === 0 ? 900 : 1400, start + 0.07);
          gain.gain.setValueAtTime(0.18, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.075);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(start);
          osc.stop(start + 0.08);
        });
      } else if (type === 'SUCCESS' || type === 'CHEER') {
        // Celebratory victory fanfare arpeggio (C5 - E5 - G5 - C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.08;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.setValueAtTime(0.35, start);
          gain.gain.linearRampToValueAtTime(0.0001, start + (idx === 3 ? 0.35 : 0.12));
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(start);
          osc.stop(start + (idx === 3 ? 0.36 : 0.13));
        });
      } else {
        // Default BLIP
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (e) {
      console.warn('WebAudio playEffect warning:', e);
    }
  }

  public playJumpBoing() {
    this.playEffect('JUMP');
  }

  public playDanceRhythm(style: string = 'CHIPTUNE', beats: number = 4) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const beatDur = 60 / this.tempoBpm;
      const totalBeats = Math.max(1, Math.min(16, beats));

      for (let b = 0; b < totalBeats; b++) {
        const beatTime = now + b * beatDur;
        const isKickBeat = b % 2 === 0;

        // Kick Drum or Snare Hit
        const drumOsc = ctx.createOscillator();
        const drumGain = ctx.createGain();

        if (isKickBeat) {
          // Punchy Sub-Kick
          drumOsc.type = 'sine';
          drumOsc.frequency.setValueAtTime(140, beatTime);
          drumOsc.frequency.exponentialRampToValueAtTime(45, beatTime + 0.09);
          drumGain.gain.setValueAtTime(0.3, beatTime);
          drumGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.12);
        } else {
          // Snappy Noise/Square Snare
          drumOsc.type = 'square';
          drumOsc.frequency.setValueAtTime(260, beatTime);
          drumOsc.frequency.exponentialRampToValueAtTime(80, beatTime + 0.08);
          drumGain.gain.setValueAtTime(0.2, beatTime);
          drumGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.1);
        }

        drumOsc.connect(drumGain);
        drumGain.connect(this.masterGain);
        drumOsc.start(beatTime);
        drumOsc.stop(beatTime + 0.13);

        // Melodic Chiptune Arpeggio Pulse
        const synthNotes = [261.63, 329.63, 392.0, 523.25, 659.25];
        const pitch = synthNotes[b % synthNotes.length];
        const synthOsc = ctx.createOscillator();
        const synthGain = ctx.createGain();
        const synthWave: OscillatorType = style.toUpperCase().includes('FUNK') ? 'sawtooth' : 'square';

        synthOsc.type = synthWave;
        synthOsc.frequency.setValueAtTime(pitch, beatTime + 0.04);
        synthGain.gain.setValueAtTime(0.12, beatTime + 0.04);
        synthGain.gain.exponentialRampToValueAtTime(0.001, beatTime + beatDur * 0.7);

        synthOsc.connect(synthGain);
        synthGain.connect(this.masterGain);
        synthOsc.start(beatTime + 0.04);
        synthOsc.stop(beatTime + beatDur * 0.75);
      }
    } catch (e) {
      console.warn('Dance rhythm playback warning:', e);
    }
  }

  public speakVoice(text: string, voicePersona: string = 'Friendly', pitch: number = 1.1, rate: number = 1.05) {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const pLower = (voicePersona || '').toLowerCase();
      if (pLower.includes('robot')) {
        utterance.pitch = 0.75;
        utterance.rate = 0.95;
      } else if (pLower.includes('hero')) {
        utterance.pitch = 0.85;
        utterance.rate = 1.0;
      } else if (pLower.includes('cadet')) {
        utterance.pitch = 1.35;
        utterance.rate = 1.15;
      } else {
        utterance.pitch = pitch || 1.1;
        utterance.rate = rate || 1.05;
      }

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('zira'))
        ) || voices.find((v) => v.lang.startsWith('en'));
        if (preferred) utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis warning:', e);
    }
  }
}

export const webAudioSynth = new WebAudioSynthesizer();

if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    webAudioSynth.resume();
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}
