// Client-Side GSL Neural Network & Robust Geometric Feature Classifier

import { GSL_ALPHABET, GslLetter } from './gslDictionary'

export interface Landmark3D {
  x: number
  y: number
  z: number
}

export interface PredictionResult {
  letter: string
  index: number
  letterInfo: GslLetter
  confidence: number
  allProbabilities: number[]
  topThree: { letter: string; confidence: number }[]
  isTargetMatch: (targetLetter: string) => boolean
}

// Finger state analysis
interface FingerAnalysis {
  thumbExt: boolean
  indexExt: boolean
  middleExt: boolean
  ringExt: boolean
  pinkyExt: boolean
  thumbTouchesIndex: boolean
  thumbTouchesMiddle: boolean
  thumbTouchesRing: boolean
  thumbTouchesPinky: boolean
  indexMiddleTogether: boolean
  middleRingTogether: boolean
  fingerCurlCount: number
}

export interface MotionVector {
  dx: number
  dy: number
  dz: number
  velocity: number
}

export class TrajectoryTracker {
  private positionBuffer: Landmark3D[][] = []
  private readonly maxFrames = 15

  public pushFrame(landmarks: Landmark3D[]): MotionVector[] {
    if (!landmarks || landmarks.length < 21) return []

    this.positionBuffer.push(landmarks)
    if (this.positionBuffer.length > this.maxFrames) {
      this.positionBuffer.shift()
    }

    if (this.positionBuffer.length < 2) return []

    const current = this.positionBuffer[this.positionBuffer.length - 1]
    const previous = this.positionBuffer[this.positionBuffer.length - 2]

    return current.map((lm, idx) => {
      const prevLm = previous[idx] || lm
      const dx = lm.x - prevLm.x
      const dy = lm.y - prevLm.y
      const dz = (lm.z || 0) - (prevLm.z || 0)
      return {
        dx,
        dy,
        dz,
        velocity: Math.sqrt(dx * dx + dy * dy + dz * dz),
      }
    })
  }

  public reset() {
    this.positionBuffer = []
  }
}

export class GSLClassifier {
  private isReady = false
  private weights: any = null
  private probabilityHistory: number[][] = []
  private readonly historySize = 3
  private loadPromise: Promise<void> | null = null
  public trajectoryTracker = new TrajectoryTracker()

  constructor() {
    this.loadModel()
  }

  /**
   * Asynchronously lazy-loads model weights to prevent main JS bundle inflation
   */
  public async loadModel(): Promise<void> {
    if (this.isReady) return
    if (this.loadPromise) return this.loadPromise

    this.loadPromise = (async () => {
      try {
        const modelModule = await import('../assets/gsl_model.json')
        this.weights = modelModule.default || modelModule
        this.isReady = true
      } catch (e) {
        console.warn('Could not lazy-load gsl_model.json, using fallback geometric engine.', e)
        this.isReady = false
      }
    })()

    return this.loadPromise
  }

  /**
   * Resets temporal smoothing buffer on letter change
   */
  public resetHistory() {
    this.probabilityHistory = []
    this.trajectoryTracker.reset()
  }

  /**
   * Normalizes 21 3D hand landmarks:
   * 1. Translates all landmarks relative to the wrist (landmark 0) as origin (0,0,0).
   * 2. Scale normalizes by Euclidean distance between wrist (0) and middle MCP (9).
   */
  public normalizeLandmarks(landmarks: Landmark3D[]): number[] {
    if (!landmarks || landmarks.length < 21) {
      return new Array(63).fill(0)
    }

    const wrist = landmarks[0]
    const centered: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < 21; i++) {
      centered.push({
        x: landmarks[i].x - wrist.x,
        y: landmarks[i].y - wrist.y,
        z: landmarks[i].z - wrist.z,
      })
    }

    // Scale by distance between wrist (0) and middle MCP (9)
    const midMcp = centered[9]
    const scale = Math.sqrt(midMcp.x * midMcp.x + midMcp.y * midMcp.y + midMcp.z * midMcp.z)
    const effectiveScale = scale > 1e-5 ? scale : 1.0

    const normalizedFlat: number[] = []
    for (let i = 0; i < 21; i++) {
      normalizedFlat.push(centered[i].x / effectiveScale)
      normalizedFlat.push(centered[i].y / effectiveScale)
      normalizedFlat.push(centered[i].z / effectiveScale)
    }

    return normalizedFlat
  }

  /**
   * Computes anatomical finger states to disambiguate close-finger signs
   */
  private analyzeFingers(lm: Landmark3D[]): FingerAnalysis {
    const dist = (i: number, j: number) => {
      const dx = lm[i].x - lm[j].x
      const dy = lm[i].y - lm[j].y
      const dz = (lm[i].z || 0) - (lm[j].z || 0)
      return Math.sqrt(dx * dx + dy * dy + dz * dz)
    }

    // Reference scale: distance between wrist (0) and middle MCP (9)
    const refScale = dist(0, 9) || 0.2

    // Finger extensions: compare tip distance to wrist vs PIP knuckle distance to wrist
    const thumbExt = dist(4, 2) > 0.45 * refScale && dist(4, 9) > 0.5 * refScale
    const indexExt = dist(8, 0) > dist(6, 0) * 1.15 && lm[8].y < lm[6].y
    const middleExt = dist(12, 0) > dist(10, 0) * 1.15 && lm[12].y < lm[10].y
    const ringExt = dist(16, 0) > dist(14, 0) * 1.15 && lm[16].y < lm[14].y
    const pinkyExt = dist(20, 0) > dist(18, 0) * 1.15 && lm[20].y < lm[18].y

    const thumbTouchesIndex = dist(4, 8) < 0.35 * refScale
    const thumbTouchesMiddle = dist(4, 12) < 0.35 * refScale
    const thumbTouchesRing = dist(4, 16) < 0.35 * refScale
    const thumbTouchesPinky = dist(4, 20) < 0.35 * refScale
    const indexMiddleTogether = dist(8, 12) < 0.30 * refScale
    const middleRingTogether = dist(12, 16) < 0.30 * refScale

    let curlCount = 0
    if (!indexExt) curlCount++
    if (!middleExt) curlCount++
    if (!ringExt) curlCount++
    if (!pinkyExt) curlCount++

    return {
      thumbExt,
      indexExt,
      middleExt,
      ringExt,
      pinkyExt,
      thumbTouchesIndex,
      thumbTouchesMiddle,
      thumbTouchesRing,
      thumbTouchesPinky,
      indexMiddleTogether,
      middleRingTogether,
      fingerCurlCount: curlCount,
    }
  }

  /**
   * Fast In-Browser Forward Pass with Anatomical Invariant Scoring
   */
  public predict(landmarks: Landmark3D[]): PredictionResult | null {
    if (!landmarks || landmarks.length < 21) return null

    const input = this.normalizeLandmarks(landmarks)
    const analysis = this.analyzeFingers(landmarks)
    let rawProbabilities: number[] = []

    if (this.isReady && this.weights && this.weights.layers) {
      rawProbabilities = this.forwardPass(input)
    } else {
      rawProbabilities = new Array(24).fill(1 / 24)
    }

    // Apply anatomical booster for close-finger signs to prevent confusion
    const boosted = [...rawProbabilities]

    // Letter Α (Alpha): Tight fist with thumb up
    if (analysis.fingerCurlCount >= 3 && analysis.thumbExt) {
      boosted[0] = Math.max(boosted[0] * 2.2, 0.5)
    }

    // Letter Β (Beta): All 4 fingers straight & together
    if (analysis.indexExt && analysis.middleExt && analysis.ringExt && analysis.pinkyExt) {
      boosted[1] = Math.max(boosted[1] * 2.5, 0.55)
    }

    // Letter Γ (Gamma) / Λ (Lambda): Thumb & Index open at angle, other 3 curled
    if (analysis.indexExt && analysis.thumbExt && !analysis.middleExt && !analysis.ringExt && !analysis.pinkyExt) {
      boosted[2] = Math.max(boosted[2] * 2.0, 0.45) // Γ
      boosted[10] = Math.max(boosted[10] * 2.0, 0.45) // Λ
    }

    // Letter Δ (Delta): Index pointing straight up, thumb touches other fingers in circle
    if (analysis.indexExt && !analysis.middleExt && !analysis.ringExt && !analysis.pinkyExt) {
      boosted[3] = Math.max(boosted[3] * 2.2, 0.5)
    }

    // Letter Ε (Epsilon): All 4 fingers curled touching thumb (including pinky!)
    if (analysis.fingerCurlCount === 4 && analysis.thumbTouchesIndex && analysis.thumbTouchesPinky) {
      boosted[4] = Math.max(boosted[4] * 2.2, 0.5)
    }

    // Letter Η (Eta): Index & Middle together horizontally, others curled
    if (analysis.indexExt && analysis.middleExt && analysis.indexMiddleTogether && !analysis.ringExt && !analysis.pinkyExt) {
      boosted[6] = Math.max(boosted[6] * 2.5, 0.55)
    }

    // Letter Ι (Iota): Pinky pointing up, other 4 closed in fist
    if (analysis.pinkyExt && !analysis.indexExt && !analysis.middleExt && !analysis.ringExt && !analysis.thumbExt) {
      boosted[8] = Math.max(boosted[8] * 2.5, 0.55)
    }

    // Letter Μ (Mu, index 12 -> array index 11): 3 fingers (Index, Middle, Ring) grouped together over thumb
    if (analysis.indexMiddleTogether && analysis.middleRingTogether && !analysis.thumbTouchesPinky) {
      boosted[11] = Math.max(boosted[11] * 3.5, 0.65)
      boosted[12] *= 0.2 // Suppress N (Nu) when 3 fingers are grouped
      boosted[4] *= 0.2  // Suppress E (Epsilon)
    } 
    // Letter Ν (Nu, index 13 -> array index 12): 2 fingers (Index, Middle) grouped together over thumb, Ring separate/tucked
    else if (analysis.indexMiddleTogether && !analysis.middleRingTogether && !analysis.thumbTouchesPinky) {
      boosted[12] = Math.max(boosted[12] * 3.5, 0.65)
      boosted[11] *= 0.2 // Suppress M (Mu) when only 2 fingers are grouped
      boosted[4] *= 0.2  // Suppress E (Epsilon)
    }

    // Letter Ο (Omicron): All fingers in round O touching thumb
    if (analysis.thumbTouchesIndex && analysis.fingerCurlCount >= 3) {
      boosted[14] = Math.max(boosted[14] * 2.2, 0.5)
    }

    // Letter Σ (Sigma): Tight fist, thumb folded across fingers
    if (analysis.fingerCurlCount === 4 && !analysis.thumbExt) {
      boosted[17] = Math.max(boosted[17] * 2.2, 0.5)
    }

    // Letter Υ (Upsilon): Thumb and Pinky extended (shaka sign)
    if (analysis.thumbExt && analysis.pinkyExt && !analysis.indexExt && !analysis.middleExt && !analysis.ringExt) {
      boosted[19] = Math.max(boosted[19] * 2.5, 0.6)
    }

    // Letter Φ (Phi): Thumb & Index circle (OK sign), Middle, Ring, Pinky open
    if (analysis.thumbTouchesIndex && analysis.middleExt && analysis.ringExt && analysis.pinkyExt) {
      boosted[20] = Math.max(boosted[20] * 2.5, 0.6)
    }

    // Letter Ψ (Psi): Index, Middle, Ring open up like trident
    if (analysis.indexExt && analysis.middleExt && analysis.ringExt && !analysis.pinkyExt) {
      boosted[22] = Math.max(boosted[22] * 2.5, 0.6)
    }

    // Renormalize probabilities sum to 1
    const sum = boosted.reduce((a, b) => a + b, 0)
    const normalizedProbs = boosted.map((p) => (sum > 0 ? p / sum : 1 / 24))

    // Smooth probabilities over recent frames to eliminate micro-jitter
    this.probabilityHistory.push(normalizedProbs)
    if (this.probabilityHistory.length > this.historySize) {
      this.probabilityHistory.shift()
    }

    const smoothed = new Array(24).fill(0)
    for (const hist of this.probabilityHistory) {
      for (let i = 0; i < 24; i++) {
        smoothed[i] += hist[i] / this.probabilityHistory.length
      }
    }

    // Find highest probability
    let maxIdx = 0
    let maxProb = smoothed[0] || 0
    for (let i = 1; i < smoothed.length; i++) {
      if (smoothed[i] > maxProb) {
        maxProb = smoothed[i]
        maxIdx = i
      }
    }

    const classIndex = maxIdx + 1
    const letterInfo = GSL_ALPHABET.find((l) => l.index === classIndex) || GSL_ALPHABET[0]

    const indexedProbs = smoothed.map((prob, idx) => ({
      letter: GSL_ALPHABET[idx]?.letter || '?',
      confidence: Math.round(prob * 100) / 100,
    }))
    indexedProbs.sort((a, b) => b.confidence - a.confidence)

    return {
      letter: letterInfo.letter,
      index: classIndex,
      letterInfo,
      confidence: Math.min(Math.max(maxProb, 0), 1),
      allProbabilities: smoothed,
      topThree: indexedProbs.slice(0, 3),
      isTargetMatch: (targetLetter: string) => {
        // Strict & Reliable: Must be Rank 1 (>= 0.40) or strong Rank 2 (>= 0.32), or Rank 1-3 for M (>= 0.25)
        const top1 = indexedProbs[0]
        const top2 = indexedProbs[1]
        const top3 = indexedProbs[2]
        if (top1 && top1.letter === targetLetter && top1.confidence >= 0.40) return true
        if (top2 && top2.letter === targetLetter && top2.confidence >= 0.32) return true
        if (targetLetter === 'Μ' && (top1?.letter === 'Μ' || top2?.letter === 'Μ' || top3?.letter === 'Μ') && (top1?.confidence >= 0.25 || top2?.confidence >= 0.25 || top3?.confidence >= 0.25)) return true
        return false
      },
    }
  }

  private forwardPass(inputVector: number[]): number[] {
    let currentActivation = new Float32Array(inputVector)

    for (const layer of this.weights.layers) {
      if (layer.type === 'Dense') {
        const W = layer.weights
        const b = layer.biases
        const inDim = W.length
        const outDim = b.length
        const nextActivation = new Float32Array(outDim)

        for (let j = 0; j < outDim; j++) {
          let sum = b[j]
          for (let i = 0; i < inDim; i++) {
            sum += currentActivation[i] * W[i][j]
          }
          nextActivation[j] = sum
        }
        currentActivation = nextActivation
      } else if (layer.type === 'BatchNormalization') {
        const gamma = layer.gamma
        const beta = layer.beta
        const mean = layer.mean
        const variance = layer.variance
        const epsilon = layer.epsilon || 1e-3

        for (let i = 0; i < currentActivation.length; i++) {
          const std = Math.sqrt(variance[i] + epsilon)
          const normalized = (currentActivation[i] - mean[i]) / std
          currentActivation[i] = gamma[i] * normalized + beta[i]
        }
      } else if (layer.type === 'Activation') {
        if (layer.activation === 'relu') {
          for (let i = 0; i < currentActivation.length; i++) {
            currentActivation[i] = Math.max(0, currentActivation[i])
          }
        }
      }
    }

    let maxVal = -Infinity
    for (let i = 0; i < currentActivation.length; i++) {
      if (currentActivation[i] > maxVal) maxVal = currentActivation[i]
    }

    let expSum = 0
    const expVals = new Float32Array(currentActivation.length)
    for (let i = 0; i < currentActivation.length; i++) {
      expVals[i] = Math.exp(currentActivation[i] - maxVal)
      expSum += expVals[i]
    }

    const outputProbabilities: number[] = []
    for (let i = 0; i < currentActivation.length; i++) {
      outputProbabilities.push(expSum > 0 ? expVals[i] / expSum : 1 / 24)
    }

    return outputProbabilities
  }
}

export const gslClassifier = new GSLClassifier()
export default gslClassifier
