/**
 * Audio Engine (Tone.js Wrapper)
 * 
 * Provides procedural audio generation capabilities using Tone.js.
 * Designed for use in web-based projects (games, apps) within the workspace.
 * 
 * Note: This module requires a browser environment with Web Audio API support.
 */

import * as Tone from 'tone';

export interface SoundParams {
  duration?: string;
  frequency?: string | number;
  type?: "sine" | "square" | "sawtooth" | "triangle";
  volume?: number;
}

export const AudioEngine = {
  /**
   * Initialize the audio context (must be called after user interaction)
   */
  async initialize() {
    await Tone.start();
    console.log('Audio Engine Initialized');
  },

  /**
   * Generate and play a simple sound effect
   * @param type The type of sound (e.g., 'ui-click', 'explosion', 'powerup')
   * @param params Custom parameters
   */
  generateSoundEffect(type: string, params: SoundParams = {}) {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    
    switch (type) {
      case 'ui-click':
        synth.triggerAttackRelease(params.frequency || "C6", params.duration || "32n");
        break;
      case 'error':
        const errorSynth = new Tone.MembraneSynth().toDestination();
        errorSynth.triggerAttackRelease(params.frequency || "A1", params.duration || "8n");
        break;
      case 'powerup':
        const now = Tone.now();
        synth.triggerAttackRelease("C4", "8n", now);
        synth.triggerAttackRelease("E4", "8n", now + 0.1);
        synth.triggerAttackRelease("G4", "8n", now + 0.2);
        synth.triggerAttackRelease("C5", "8n", now + 0.3);
        break;
      default:
        synth.triggerAttackRelease(params.frequency || "C4", params.duration || "8n");
    }
  },

  /**
   * Generate a background music pattern
   * @param mood 'happy', 'tense', 'ambient'
   * @param bpm Beats per minute
   */
  generateBackgroundMusic(mood: string, bpm: number = 120) {
    Tone.Transport.bpm.value = bpm;
    
    // Clear existing transport
    Tone.Transport.cancel();

    if (mood === 'happy') {
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      const loop = new Tone.Loop(time => {
        synth.triggerAttackRelease("C4", "8n", time);
        synth.triggerAttackRelease("E4", "8n", time + 0.5);
        synth.triggerAttackRelease("G4", "8n", time + 1.0);
      }, "2n").start(0);
    } else if (mood === 'tense') {
      const synth = new Tone.MembraneSynth().toDestination();
      const loop = new Tone.Loop(time => {
        synth.triggerAttackRelease("C2", "8n", time);
        synth.triggerAttackRelease("C2", "8n", time + 0.25);
      }, "4n").start(0);
    } else {
      // Ambient
      const synth = new Tone.AMSynth().toDestination();
      const loop = new Tone.Loop(time => {
        synth.triggerAttackRelease("A3", "1m", time);
      }, "1m").start(0);
    }

    Tone.Transport.start();
  },

  /**
   * Create an ambient soundscape
   * @param environment 'forest', 'space', 'city'
   */
  generateAmbience(environment: string) {
    const noise = new Tone.Noise("pink").start();
    const filter = new Tone.AutoFilter({
      frequency: "8m",
      min: 800,
      max: 15000
    }).toDestination();
    
    noise.connect(filter);
    
    if (environment === 'space') {
      filter.frequency.value = "1m";
      filter.min = 100;
      filter.max = 500;
    }
    
    // Ramp volume up
    noise.volume.value = -Infinity;
    noise.volume.rampTo(-10, 2);
  },

  /**
   * Stop all audio
   */
  stopAll() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    // Note: This doesn't stop individual scheduled events if they aren't on transport, 
    // but for this simple engine we rely on Transport for loops.
  }
};
