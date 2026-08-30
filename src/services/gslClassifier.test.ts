import { describe, it, expect, beforeEach } from 'vitest'
import { GSLClassifier, Landmark3D } from './gslClassifier'

// Helper function to create synthetic 21-landmark 3D hand poses
const createSyntheticHand = (modifiers: Partial<Record<number, Partial<Landmark3D>>> = {}): Landmark3D[] => {
  const landmarks: Landmark3D[] = []

  // Default neutral flat hand pose relative to wrist (0, 0, 0)
  const basePositions: [number, number, number][] = [
    [0, 0, 0],          // 0: Wrist
    [-0.1, -0.05, 0],   // 1: Thumb CMC
    [-0.18, -0.12, 0],  // 2: Thumb MCP
    [-0.24, -0.18, 0],  // 3: Thumb IP
    [-0.3, -0.22, 0],   // 4: Thumb Tip
    [-0.08, -0.2, 0],   // 5: Index MCP
    [-0.09, -0.32, 0],  // 6: Index PIP
    [-0.1, -0.4, 0],    // 7: Index DIP
    [-0.11, -0.48, 0],  // 8: Index Tip
    [0, -0.22, 0],      // 9: Middle MCP
    [0, -0.35, 0],      // 10: Middle PIP
    [0, -0.44, 0],      // 11: Middle DIP
    [0, -0.52, 0],      // 12: Middle Tip
    [0.08, -0.2, 0],    // 13: Ring MCP
    [0.09, -0.31, 0],   // 14: Ring PIP
    [0.1, -0.39, 0],    // 15: Ring DIP
    [0.11, -0.46, 0],   // 16: Ring Tip
    [0.15, -0.17, 0],   // 17: Pinky MCP
    [0.17, -0.26, 0],   // 18: Pinky PIP
    [0.19, -0.33, 0],   // 19: Pinky DIP
    [0.21, -0.4, 0],    // 20: Pinky Tip
  ]

  for (let i = 0; i < 21; i++) {
    const [x, y, z] = basePositions[i]
    const custom = modifiers[i] || {}
    landmarks.push({
      x: custom.x !== undefined ? custom.x : x,
      y: custom.y !== undefined ? custom.y : y,
      z: custom.z !== undefined ? custom.z : z,
    })
  }

  return landmarks
}

describe('GSLClassifier Unit Tests', () => {
  let classifier: GSLClassifier

  beforeEach(async () => {
    classifier = new GSLClassifier()
    await classifier.loadModel()
    classifier.resetHistory()
  })

  describe('normalizeLandmarks()', () => {
    it('returns empty zero array if landmarks array is invalid or incomplete', () => {
      const result = classifier.normalizeLandmarks([])
      expect(result).toHaveLength(63)
      expect(result.every((val) => val === 0)).toBe(true)
    })

    it('translates wrist (landmark 0) to origin (0, 0, 0)', () => {
      // Offset all positions by (10, 20, 30)
      const offsetHand = createSyntheticHand().map((lm) => ({
        x: lm.x + 10,
        y: lm.y + 20,
        z: lm.z + 30,
      }))

      const normalized = classifier.normalizeLandmarks(offsetHand)

      // First 3 values correspond to Wrist x, y, z normalized
      expect(normalized[0]).toBeCloseTo(0, 4)
      expect(normalized[1]).toBeCloseTo(0, 4)
      expect(normalized[2]).toBeCloseTo(0, 4)
    })

    it('scales normalized coordinates consistently regardless of hand size or distance', () => {
      const hand1 = createSyntheticHand()
      const hand2 = createSyntheticHand().map((lm) => ({
        x: lm.x * 2.5,
        y: lm.y * 2.5,
        z: lm.z * 2.5,
      }))

      const norm1 = classifier.normalizeLandmarks(hand1)
      const norm2 = classifier.normalizeLandmarks(hand2)

      for (let i = 0; i < 63; i++) {
        expect(norm1[i]).toBeCloseTo(norm2[i], 3)
      }
    })
  })

  describe('predict() & Gesture Disambiguation', () => {
    it('returns null when provided empty or invalid landmark arrays', () => {
      expect(classifier.predict([])).toBeNull()
    })

    it('returns structured PredictionResult with 24 normalized probabilities and top 3 candidates', () => {
      const hand = createSyntheticHand()
      const prediction = classifier.predict(hand)

      expect(prediction).not.toBeNull()
      if (prediction) {
        expect(prediction.letter).toBeTypeOf('string')
        expect(prediction.confidence).toBeGreaterThanOrEqual(0)
        expect(prediction.confidence).toBeLessThanOrEqual(1)
        expect(prediction.allProbabilities).toHaveLength(24)
        expect(prediction.topThree).toHaveLength(3)
        expect(typeof prediction.isTargetMatch).toBe('function')
      }
    })

    it('predicts Letter Beta (Β) for all 4 fingers straight & together', () => {
      const betaPose = createSyntheticHand()
      const prediction = classifier.predict(betaPose)

      expect(prediction).not.toBeNull()
      if (prediction) {
        expect(prediction.letter).toBe('Β')
        expect(prediction.confidence).toBeGreaterThanOrEqual(0.3)
      }
    })

    it('predicts Letter Iota (Ι) when pinky finger is extended and thumb is tucked', () => {
      // Curl index, middle, ring, thumb; keep pinky extended
      const iotaPose = createSyntheticHand({
        4: { x: 0, y: 0.1, z: 0 },  // Thumb tucked in
        8: { x: -0.08, y: -0.1 },  // Index curled
        12: { x: 0, y: -0.1 },     // Middle curled
        16: { x: 0.08, y: -0.1 },   // Ring curled
        20: { x: 0.21, y: -0.6 },   // Pinky extended
      })

      const prediction = classifier.predict(iotaPose)

      expect(prediction).not.toBeNull()
      if (prediction) {
        expect(['Ι', 'Υ']).toContain(prediction.letter)
      }
    })

    it('predicts valid Greek fingerspelling letter for tight fist pose', () => {
      // Curl all 4 main fingers down into tight fist
      const fistPose = createSyntheticHand({
        8: { x: -0.08, y: -0.1, z: 0 },  // Index curled
        12: { x: 0, y: -0.1, z: 0 },     // Middle curled
        16: { x: 0.08, y: -0.1, z: 0 },   // Ring curled
        20: { x: 0.15, y: -0.1, z: 0 },   // Pinky curled
        4: { x: -0.2, y: -0.25, z: 0 },   // Thumb up
      })

      const prediction = classifier.predict(fistPose)

      expect(prediction).not.toBeNull()
      if (prediction) {
        expect(prediction.letter).toBeTypeOf('string')
        expect(prediction.confidence).toBeGreaterThan(0)
      }
    })
  })

  describe('resetHistory()', () => {
    it('clears smoothing history buffer on demand', () => {
      classifier.predict(createSyntheticHand())
      classifier.predict(createSyntheticHand())
      classifier.resetHistory()

      // After reset, prediction shouldn't crash and returns valid result
      const prediction = classifier.predict(createSyntheticHand())
      expect(prediction).not.toBeNull()
    })
  })

  describe('TrajectoryTracker', () => {
    it('calculates spatial motion vectors and velocities across consecutive frames', () => {
      const tracker = classifier.trajectoryTracker
      tracker.reset()

      const frame1 = createSyntheticHand()
      const frame2 = createSyntheticHand().map((lm) => ({
        x: lm.x + 0.05,
        y: lm.y - 0.05,
        z: lm.z,
      }))

      const vectors1 = tracker.pushFrame(frame1)
      expect(vectors1).toHaveLength(0) // Needs at least 2 frames

      const vectors2 = tracker.pushFrame(frame2)
      expect(vectors2).toHaveLength(21)
      expect(vectors2[0].dx).toBeCloseTo(0.05, 4)
      expect(vectors2[0].dy).toBeCloseTo(-0.05, 4)
      expect(vectors2[0].velocity).toBeGreaterThan(0)
    })
  })
})
