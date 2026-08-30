// Web Worker for offloading GSL Classification and Neural Forward Pass from Main UI Thread

import { expose } from 'comlink'
import { GSLClassifier, Landmark3D } from './gslClassifier'

const classifier = new GSLClassifier()

const api = {
  loadModel: () => classifier.loadModel(),
  predict: (landmarks: Landmark3D[]) => classifier.predict(landmarks),
  resetHistory: () => classifier.resetHistory(),
  normalizeLandmarks: (landmarks: Landmark3D[]) => classifier.normalizeLandmarks(landmarks),
}

export type ClassifierWorkerAPI = typeof api

expose(api)
