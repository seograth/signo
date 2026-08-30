// Web Audio API Sound Synthesizer for SigniFi

class AudioEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false

  constructor() {
    this.isMuted = localStorage.getItem('signifi_muted') === 'true'
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    localStorage.setItem('signifi_muted', String(this.isMuted))
    return this.isMuted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  // Pleasant pop when changing letters or clicking
  public playPop() {
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  }

  // Harmonic chord when a letter is successfully recognized and held
  public playSuccessChime() {
    const ctx = this.getContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04)

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.04)
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.04 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + i * 0.04)
      osc.stop(ctx.currentTime + i * 0.04 + 0.35)
    })
  }

  // Ascending celebration fanfare when a word is completed
  public playWordCompleteFanfare() {
    const ctx = this.getContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07)

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07)
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.07 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.5)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + i * 0.07)
      osc.stop(ctx.currentTime + i * 0.07 + 0.5)
    })
  }

  // Subtle charging tone as confidence ring fills up
  public playHoldTick(progress: number) {
    const ctx = this.getContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    // Pitch rises with hold progress
    const baseFreq = 440 + progress * 400
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime)

    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  }
}

export const audioEngine = new AudioEngine()
export default audioEngine
