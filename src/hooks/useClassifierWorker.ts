import { useEffect, useRef, useCallback } from 'react'
import { wrap, Remote } from 'comlink'
import type { ClassifierWorkerAPI } from '../services/classifier.worker'
import { Landmark3D, PredictionResult, gslClassifier } from '../services/gslClassifier'

export const useClassifierWorker = () => {
  const workerRef = useRef<Worker | null>(null)
  const remoteRef = useRef<Remote<ClassifierWorkerAPI> | null>(null)

  useEffect(() => {
    try {
      const worker = new Worker(
        new URL('../services/classifier.worker.ts', import.meta.url),
        { type: 'module' }
      )
      const remote = wrap<ClassifierWorkerAPI>(worker)
      remote.loadModel().catch((err) => {
        console.warn('Worker loadModel error:', err)
      })

      workerRef.current = worker
      remoteRef.current = remote
    } catch (e) {
      console.warn('Could not instantiate Classifier Web Worker, using main thread fallback.', e)
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
        remoteRef.current = null
      }
    }
  }, [])

  const predict = useCallback(async (landmarks: Landmark3D[]): Promise<PredictionResult | null> => {
    if (remoteRef.current) {
      try {
        const result = await remoteRef.current.predict(landmarks)
        if (result) {
          // Re-attach helper function isTargetMatch
          const isTargetMatch = (targetLetter: string) => {
            const top1 = result.topThree[0]
            const top2 = result.topThree[1]
            const top3 = result.topThree[2]
            if (top1 && top1.letter === targetLetter && top1.confidence >= 0.40) return true
            if (top2 && top2.letter === targetLetter && top2.confidence >= 0.32) return true
            if (targetLetter === 'Μ' && (top1?.letter === 'Μ' || top2?.letter === 'Μ' || top3?.letter === 'Μ') && ((top1 && top1.confidence >= 0.25) || (top2 && top2.confidence >= 0.25) || (top3 && top3.confidence >= 0.25))) return true
            return false
          }
          return {
            ...result,
            isTargetMatch,
          }
        }
        return result
      } catch (err) {
        console.warn('Worker prediction failed, using fallback:', err)
      }
    }

    // Main thread fallback
    return gslClassifier.predict(landmarks)
  }, [])

  const resetHistory = useCallback(async () => {
    if (remoteRef.current) {
      try {
        await remoteRef.current.resetHistory()
      } catch {
        // Fallback
      }
    }
    gslClassifier.resetHistory()
  }, [])

  return { predict, resetHistory }
}

export default useClassifierWorker
