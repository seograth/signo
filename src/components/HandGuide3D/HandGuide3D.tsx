import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Slider,
  Drawer,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import PanToolIcon from '@mui/icons-material/PanTool'
import TuneIcon from '@mui/icons-material/Tune'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import { useTranslation } from 'react-i18next'
import gslTemplates from '../../assets/gsl_landmark_templates.json'
import { GSL_ALPHABET, GslLetter, LETTER_TO_INDEX } from '../../services/gslDictionary'

// Feature Flag: 3D Pose Editor is ONLY enabled when explicitly launched via 'npm run dev:editor' or VITE_ENABLE_POSE_EDITOR=true
const IS_POSE_EDITOR_ENABLED =
  import.meta.env.VITE_ENABLE_POSE_EDITOR === 'true' ||
  import.meta.env.MODE === 'dev_editor'

interface HandGuide3DProps {
  currentLetter: string
  selectedHand: 'right' | 'left'
  onHandToggle?: () => void
}

interface CustomGestureConfig {
  landmarks: number[][]
  rotX?: number
  rotY?: number
  rotZ?: number
  isMirrored?: boolean
}

// Finger definitions with natural human/cartoon tapering
const FINGERS_CONFIG = [
  { name: 'Thumb', joints: [1, 2, 3, 4], radii: [0.18, 0.16, 0.14, 0.12] },
  { name: 'Index', joints: [5, 6, 7, 8], radii: [0.14, 0.13, 0.11, 0.095] },
  { name: 'Middle', joints: [9, 10, 11, 12], radii: [0.145, 0.135, 0.115, 0.095] },
  { name: 'Ring', joints: [13, 14, 15, 16], radii: [0.14, 0.125, 0.11, 0.09] },
  { name: 'Pinky', joints: [17, 18, 19, 20], radii: [0.12, 0.11, 0.09, 0.075] },
]

const LANDMARK_NAMES: Record<number, string> = {
  0: 'Wrist',
  1: 'Thumb CMC', 2: 'Thumb MCP', 3: 'Thumb IP', 4: 'Thumb Tip',
  5: 'Index MCP', 6: 'Index PIP', 7: 'Index DIP', 8: 'Index Tip',
  9: 'Middle MCP', 10: 'Middle PIP', 11: 'Middle DIP', 12: 'Middle Tip',
  13: 'Ring MCP', 14: 'Ring PIP', 15: 'Ring DIP', 16: 'Ring Tip',
  17: 'Pinky MCP', 18: 'Pinky PIP', 19: 'Pinky DIP', 20: 'Pinky Tip',
}

const RADIAL_SEGS = 16
const LONG_SEGS_PER_BONE = 4

// Helper to normalize Latin letter inputs to Greek equivalents
function normalizeLetter(letter: string): string {
  const map: Record<string, string> = {
    'A': 'Α', 'B': 'Β', 'E': 'Ε', 'Z': 'Ζ', 'H': 'Ή', 'I': 'Ι',
    'K': 'Κ', 'M': 'Μ', 'N': 'Ν', 'O': 'Ο', 'P': 'Ρ', 'T': 'Τ',
    'Y': 'Υ', 'X': 'Χ',
  }
  return map[letter.toUpperCase()] || letter
}

const OVERRIDE_LANDMARKS: Record<string, number[][] | CustomGestureConfig> = {
  'Ξ': {
    rotX: 0.05,
    rotY: 3.14,
    rotZ: 0.00,
    isMirrored: false,
    landmarks: [
      [1.068, -0.545, 0.219],
      [0.901, -0.006, 0.257],
      [0.528, 0.182, 0.238],
      [0.187, 0.100, 0.228],
      [-0.025, -0.094, 0.202],
      [0.373, 0.376, 0.045],
      [-0.126, 0.536, -0.011],
      [-0.371, 0.607, -0.026],
      [-0.562, 0.646, -0.029],
      [0.297, 0.052, -0.001],
      [-0.214, 0.190, -0.056],
      [-0.468, 0.255, -0.085],
      [-0.675, 0.317, -0.109],
      [0.276, -0.278, -0.032],
      [-0.222, -0.238, -0.106],
      [-0.489, -0.206, -0.182],
      [-0.711, -0.206, -0.230],
      [0.275, -0.603, -0.041],
      [-0.038, -0.438, -0.092],
      [-0.032, -0.341, -0.097],
      [0.028, -0.304, -0.093],
    ],
  },
  'Ν': {
    rotX: 0.05,
    rotY: 0.00,
    rotZ: 0.00,
    isMirrored: false,
    landmarks: [
      [-0.001, -0.947, -0.198],
      [0.280, -0.597, -0.098],
      [0.149, -0.297, 0.002],
      [-0.001, -0.097, 0.082],
      [-0.101, 0.003, 0.122],
      [0.280, 0.103, -0.198],
      [0.280, 0.433, 0.022],
      [0.280, 0.133, 0.222],
      [0.280, -0.167, 0.182],
      [0.080, 0.133, -0.198],
      [0.080, 0.453, 0.022],
      [0.080, 0.153, 0.242],
      [0.080, -0.147, 0.202],
      [-0.120, 0.103, -0.198],
      [-0.120, 0.313, -0.048],
      [-0.120, 0.133, 0.062],
      [-0.120, -0.067, 0.002],
      [-0.321, 0.033, -0.198],
      [-0.321, 0.273, -0.058],
      [-0.321, 0.113, 0.042],
      [-0.321, -0.067, -0.018],
    ],
  },
  'Μ': {
    rotX: 0.05,
    rotY: 0.00,
    rotZ: 0.00,
    isMirrored: false,
    landmarks: [
      [0.004, -0.949, -0.214],
      [0.284, -0.599, -0.114],
      [0.154, -0.299, -0.014],
      [-0.016, -0.099, 0.066],
      [-0.176, 0.001, 0.106],
      [0.284, 0.101, -0.214],
      [0.284, 0.431, 0.006],
      [0.284, 0.131, 0.206],
      [0.284, -0.169, 0.166],
      [0.084, 0.131, -0.214],
      [0.084, 0.451, 0.006],
      [0.084, 0.151, 0.226],
      [0.084, -0.149, 0.186],
      [-0.116, 0.101, -0.214],
      [-0.116, 0.411, -0.014],
      [-0.116, 0.131, 0.186],
      [-0.116, -0.129, 0.146],
      [-0.316, 0.031, -0.214],
      [-0.316, 0.271, -0.074],
      [-0.316, 0.111, 0.026],
      [-0.316, -0.069, -0.034],
    ],
  },
  'Θ': {
    rotX: 0.05,
    rotY: 3.14,
    rotZ: 0.00,
    isMirrored: false,
    landmarks: [
      [0.975, -0.614, 0.247],
      [0.923, -0.015, 0.255],
      [0.613, 0.333, 0.204],
      [0.210, 0.239, 0.159],
      [-0.048, 0.042, 0.115],
      [0.399, 0.396, 0.018],
      [-0.169, 0.510, -0.083],
      [-0.482, 0.517, -0.137],
      [-0.739, 0.500, -0.165],
      [0.271, 0.049, -0.010],
      [-0.320, 0.187, -0.107],
      [-0.677, 0.250, -0.151],
      [-0.934, 0.272, -0.181],
      [0.193, -0.282, -0.027],
      [-0.265, -0.181, -0.096],
      [-0.112, -0.170, -0.044],
      [0.050, -0.196, 0.019],
      [0.157, -0.599, -0.038],
      [-0.128, -0.426, -0.068],
      [-0.027, -0.406, 0.007],
      [0.110, -0.405, 0.083],
    ],
  },
  'Ζ': {
    rotX: 0.05,
    rotY: -0.03,
    rotZ: 0.00,
    isMirrored: true,
    landmarks: [
      [0.924, -0.537, 0.165],
      [0.809, 0.020, 0.198],
      [0.441, 0.277, 0.201],
      [0.113, 0.297, 0.219],
      [-0.099, 0.199, 0.229],
      [0.310, 0.392, -0.017],
      [-0.167, 0.550, -0.075],
      [-0.467, 0.604, -0.091],
      [-0.712, 0.619, -0.111],
      [0.209, 0.134, -0.031],
      [-0.215, 0.134, -0.095],
      [-0.087, 0.055, -0.051],
      [0.061, 0.040, -0.018],
      [0.181, -0.194, -0.032],
      [-0.203, -0.178, -0.088],
      [-0.069, -0.227, -0.019],
      [0.076, -0.220, 0.028],
      [0.174, -0.558, -0.031],
      [-0.227, -0.483, -0.108],
      [-0.427, -0.472, -0.131],
      [-0.627, -0.451, -0.142],
    ],
  },
  'Γ': [
    [0.0, 0.5, 0.0],
    [-0.15, 0.35, 0.05], [-0.35, 0.20, 0.05], [-0.60, 0.20, 0.0], [-0.85, 0.20, -0.05],
    [-0.15, 0.25, 0.05], [-0.15, -0.10, 0.0], [-0.15, -0.38, -0.03], [-0.15, -0.62, -0.05],
    [0.10, 0.20, 0.05], [0.10, 0.05, 0.20], [0.10, 0.25, 0.15], [0.10, 0.25, 0.0],
    [0.25, 0.18, 0.03], [0.25, 0.08, 0.18], [0.25, 0.25, 0.12], [0.25, 0.25, 0.0],
    [0.38, 0.15, 0.0], [0.38, 0.05, 0.15], [0.38, 0.18, 0.10], [0.38, 0.18, 0.0],
  ],
  'Λ': [
    [0.0, 0.65, 0.0],
    [-0.15, 0.45, 0.05], [-0.30, 0.25, 0.05], [-0.50, -0.05, 0.0], [-0.70, -0.35, -0.05],
    [0.05, 0.30, 0.05], [0.20, 0.05, 0.0], [0.40, -0.22, -0.03], [0.58, -0.48, -0.05],
    [0.15, 0.25, 0.05], [0.15, 0.38, 0.18], [0.15, 0.22, 0.12], [0.15, 0.22, 0.0],
    [0.28, 0.22, 0.03], [0.28, 0.35, 0.16], [0.28, 0.20, 0.10], [0.28, 0.20, 0.0],
    [0.40, 0.18, 0.0], [0.40, 0.30, 0.14], [0.40, 0.18, 0.08], [0.40, 0.18, 0.0],
  ],
  'Π': [
    [0.0, 0.75, -0.1],
    [-0.28, 0.60, -0.05], [-0.30, 0.42, 0.02], [-0.22, 0.35, 0.08], [-0.15, 0.28, 0.08],
    [-0.22, 0.25, 0.0], [-0.24, -0.10, 0.08], [-0.25, -0.40, 0.12], [-0.26, -0.68, 0.15],
    [-0.05, 0.20, 0.0], [-0.05, 0.42, 0.12], [-0.05, 0.30, 0.08], [-0.05, 0.22, -0.02],
    [0.15, 0.20, -0.02], [0.15, 0.40, 0.10], [0.15, 0.28, 0.06], [0.15, 0.20, -0.04],
    [0.32, 0.22, -0.05], [0.34, -0.10, 0.08], [0.35, -0.40, 0.12], [0.36, -0.68, 0.15],
  ],
  'Τ': {
    rotX: -0.04,
    rotY: -2.81,
    rotZ: 0.00,
    isMirrored: false,
    landmarks: [
      [0.000, 0.750, -0.100],
      [-0.370, 0.550, -0.050],
      [-0.420, 0.330, -0.150],
      [-0.200, 0.250, -0.200],
      [-0.100, 0.200, -0.230],
      [-0.200, 0.240, -0.080],
      [-0.240, -0.100, 0.160],
      [-0.220, -0.310, 0.230],
      [-0.220, -0.570, 0.270],
      [0.000, 0.200, 0.050],
      [0.000, -0.050, 0.200],
      [0.000, -0.200, 0.180],
      [0.000, -0.170, -0.050],
      [0.180, 0.180, 0.030],
      [0.180, -0.050, 0.180],
      [0.180, -0.200, 0.150],
      [0.160, -0.130, -0.150],
      [0.350, 0.150, 0.000],
      [0.350, -0.050, 0.150],
      [0.350, -0.180, 0.120],
      [0.300, -0.120, -0.180],
    ],
  },
  'Ω': {
    rotX: -0.98,
    rotY: 0.00,
    rotZ: 0.00,
    isMirrored: false,
    landmarks: [
      [0.000, -0.550, 0.000],
      [-0.320, -0.600, 0.050],
      [-0.420, -0.250, -0.150],
      [-0.350, 0.050, 0.250],
      [-0.220, 0.320, 0.300],
      [-0.220, 0.100, -0.500],
      [-0.240, 0.400, -0.180],
      [-0.180, 0.520, 0.320],
      [-0.100, 0.480, 0.400],
      [0.000, 0.120, -0.500],
      [0.000, 0.450, -0.200],
      [0.000, 0.580, 0.350],
      [0.000, 0.540, 0.420],
      [0.220, 0.100, -0.500],
      [0.240, 0.400, -0.180],
      [0.280, 0.520, 0.320],
      [0.100, 0.480, 0.400],
      [0.400, 0.050, -0.500],
      [0.450, 0.300, -0.150],
      [0.450, 0.420, 0.280],
      [0.250, 0.380, 0.350],
    ],
  },
}

const HORIZONTALLY_MIRRORED_LETTERS = ['Ζ', 'Θ', 'Ξ', 'Μ', 'Ν']

function getSavedGestureConfig(letter: string): CustomGestureConfig {
  const norm = normalizeLetter(letter)
  const idx = LETTER_TO_INDEX[norm] || LETTER_TO_INDEX[letter] || 1

  const defaultRotX = norm === 'Ω' ? 0.75 : 0.05
  const defaultRotY = ['Μ', 'Ν', 'Ω'].includes(norm) ? 0 : Math.PI
  const defaultRotZ = 0
  const defaultMirrored = HORIZONTALLY_MIRRORED_LETTERS.includes(norm) || HORIZONTALLY_MIRRORED_LETTERS.includes(letter)

  try {
    const saved = localStorage.getItem(`gsl_pose_${norm}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return {
          landmarks: parsed,
          rotX: defaultRotX,
          rotY: defaultRotY,
          rotZ: defaultRotZ,
          isMirrored: defaultMirrored,
        }
      }
      return {
        landmarks: parsed.landmarks || [],
        rotX: parsed.rotX ?? defaultRotX,
        rotY: parsed.rotY ?? defaultRotY,
        rotZ: parsed.rotZ ?? defaultRotZ,
        isMirrored: parsed.isMirrored ?? defaultMirrored,
      }
    }
  } catch (e) {
    // Ignore error
  }

  const staticOverride = OVERRIDE_LANDMARKS[norm] || OVERRIDE_LANDMARKS[letter]

  if (staticOverride) {
    if (Array.isArray(staticOverride)) {
      return {
        landmarks: staticOverride.map((pt) => [...pt]),
        rotX: defaultRotX,
        rotY: defaultRotY,
        rotZ: defaultRotZ,
        isMirrored: defaultMirrored,
      }
    }
    return {
      landmarks: staticOverride.landmarks.map((pt) => [...pt]),
      rotX: staticOverride.rotX ?? defaultRotX,
      rotY: staticOverride.rotY ?? defaultRotY,
      rotZ: staticOverride.rotZ ?? defaultRotZ,
      isMirrored: staticOverride.isMirrored ?? defaultMirrored,
    }
  }

  let landmarks = (gslTemplates as Record<string, number[][]>)[String(idx)] || (gslTemplates as Record<string, number[][]>)['1']

  if (defaultMirrored) {
    landmarks = landmarks.map(([x, y, z]) => [-x, y, z])
  }

  return {
    landmarks: landmarks.map((pt) => [...pt]),
    rotX: defaultRotX,
    rotY: defaultRotY,
    rotZ: defaultRotZ,
    isMirrored: defaultMirrored,
  }
}

export const HandGuide3D: React.FC<HandGuide3DProps> = ({
  currentLetter,
  selectedHand,
  onHandToggle,
}) => {
  const theme = useTheme()
  const mountRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const isJointDraggingRef = useRef(false)
  const draggedJointIndexRef = useRef<number | null>(null)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const normLetter = normalizeLetter(currentLetter)

  const { i18n } = useTranslation()
  const isGreek = i18n.language && i18n.language.startsWith('el')

  const letterInfo: GslLetter =
    GSL_ALPHABET.find((l) => l.letter === normLetter || l.letter === currentLetter) || GSL_ALPHABET[0]

  const letterDisplayName = isGreek ? letterInfo.name : letterInfo.enName
  const letterTip = isGreek ? letterInfo.description : letterInfo.fingersTip

  // Pose Editor State
  const initialConfig = getSavedGestureConfig(currentLetter)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedJoint, setSelectedJoint] = useState<number>(0)
  const [landmarksState, setLandmarksState] = useState<number[][]>(initialConfig.landmarks)
  const [rotX, setRotX] = useState<number>(initialConfig.rotX || 0)
  const [rotY, setRotY] = useState<number>(initialConfig.rotY || 0)
  const [rotZ, setRotZ] = useState<number>(initialConfig.rotZ || 0)
  const [isMirrored, setIsMirrored] = useState<boolean>(Boolean(initialConfig.isMirrored))
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const activeTemplateRef = useRef<number[][]>(initialConfig.landmarks)
  const rotationOffset = useRef({ x: initialConfig.rotX || 0, y: initialConfig.rotY || 0, z: initialConfig.rotZ || 0 })
  const isMirroredRef = useRef<boolean>(isMirrored)
  const isEditorOpenRef = useRef<boolean>(isEditorOpen)
  const selectedJointRef = useRef<number>(selectedJoint)

  useEffect(() => {
    isEditorOpenRef.current = isEditorOpen
  }, [isEditorOpen])

  useEffect(() => {
    selectedJointRef.current = selectedJoint
  }, [selectedJoint])

  useEffect(() => {
    rotationOffset.current = { x: rotX, y: rotY, z: rotZ }
  }, [rotX, rotY, rotZ])

  useEffect(() => {
    isMirroredRef.current = isMirrored
  }, [isMirrored])

  useEffect(() => {
    const config = getSavedGestureConfig(currentLetter)
    activeTemplateRef.current = config.landmarks
    setLandmarksState(config.landmarks)
    setRotX(config.rotX || 0)
    setRotY(config.rotY || 0)
    setRotZ(config.rotZ || 0)
    setIsMirrored(Boolean(config.isMirrored))
    rotationOffset.current = { x: config.rotX || 0, y: config.rotY || 0, z: config.rotZ || 0 }
  }, [currentLetter])

  // Update landmark position via sliders
  const handleJointChange = (axis: number, val: number) => {
    const updated = landmarksState.map((pt, i) => {
      if (i === selectedJoint) {
        const next = [...pt]
        next[axis] = val
        return next
      }
      return pt
    })
    setLandmarksState(updated)
    activeTemplateRef.current = updated
  }

  // Copy Complete Code
  const handleCopyCode = () => {
    const codeSnippet =
      `// Pose Config for '${normLetter}'\n` +
      `'${normLetter}': {\n` +
      `  rotX: ${rotX.toFixed(2)},\n` +
      `  rotY: ${rotY.toFixed(2)},\n` +
      `  rotZ: ${rotZ.toFixed(2)},\n` +
      `  isMirrored: ${isMirrored},\n` +
      `  landmarks: [\n` +
      landmarksState.map((pt) => `    [${pt.map((n) => n.toFixed(3)).join(', ')}]`).join(',\n') +
      `\n  ]\n},`

    navigator.clipboard.writeText(codeSnippet)
    setToastMessage(`Copied full '${normLetter}' gesture code to clipboard!`)
  }

  // Save Gesture to LocalStorage
  const handleSaveLocal = () => {
    try {
      const payload: CustomGestureConfig = {
        landmarks: landmarksState,
        rotX,
        rotY,
        rotZ,
        isMirrored,
      }
      localStorage.setItem(`gsl_pose_${normLetter}`, JSON.stringify(payload))
      setToastMessage(`Saved gesture & orientation for '${normLetter}'!`)
    } catch (e) {
      setToastMessage('Failed to save to local storage.')
    }
  }

  // Reset Pose
  const handleResetPose = () => {
    try {
      localStorage.removeItem(`gsl_pose_${normLetter}`)
    } catch (e) {}

    const defaultConfig = getSavedGestureConfig(currentLetter)
    const resetCopy = defaultConfig.landmarks.map((pt) => [...pt])

    setLandmarksState(resetCopy)
    activeTemplateRef.current = resetCopy
    setRotX(defaultConfig.rotX || 0)
    setRotY(defaultConfig.rotY || 0)
    setRotZ(defaultConfig.rotZ || 0)
    setIsMirrored(Boolean(defaultConfig.isMirrored))
    rotationOffset.current = {
      x: defaultConfig.rotX || 0,
      y: defaultConfig.rotY || 0,
      z: defaultConfig.rotZ || 0,
    }
    setToastMessage(`Reset '${normLetter}' to original defaults.`)
  }

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth / 2
    const height = container.clientHeight || window.innerHeight

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    camera.position.set(0, 0, 4.4)
    camera.lookAt(0, 0, 0)

    // Raycaster for Direct 3D Landmark Dragging
    const raycaster = new THREE.Raycaster()
    const dragPlane = new THREE.Plane()
    const planeIntersect = new THREE.Vector3()

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2)
    keyLight.position.set(5, 8, 8)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xc084fc, 2.2)
    fillLight.position.set(-6, -2, 5)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x00b4d8, 3.0)
    rimLight.position.set(0, -5, -4)
    scene.add(rimLight)

    const topRimLight = new THREE.DirectionalLight(0xffb703, 2.2)
    topRimLight.position.set(0, 7, -3)
    scene.add(topRimLight)

    // Tracking arrays for strict WebGL VRAM GPU memory cleanup on unmount/letter change
    const disposableGeometries: THREE.BufferGeometry[] = []
    const disposableMaterials: THREE.Material[] = []

    // 4. Material
    const handMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00b4d8,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.55,
      clearcoatRoughness: 0.15,
      reflectivity: 0.6,
      side: THREE.DoubleSide,
    })
    disposableMaterials.push(handMaterial)

    const handGroup = new THREE.Group()
    handGroup.position.set(0, 0, 0)
    scene.add(handGroup)

    // 5. Build Finger Geometries
    const fingerMeshes: {
      mesh: THREE.Mesh
      geometry: THREE.BufferGeometry
      finger: typeof FINGERS_CONFIG[0]
      totalRings: number
    }[] = []

    FINGERS_CONFIG.forEach((finger) => {
      const numBones = finger.joints.length - 1
      const totalRings = numBones * LONG_SEGS_PER_BONE + 1 + 4
      const numVertices = totalRings * RADIAL_SEGS + 1

      const positions = new Float32Array(numVertices * 3)
      const normals = new Float32Array(numVertices * 3)
      const indices: number[] = []

      for (let r = 0; r < totalRings - 1; r++) {
        const ringStart = r * RADIAL_SEGS
        const nextRingStart = (r + 1) * RADIAL_SEGS
        for (let i = 0; i < RADIAL_SEGS; i++) {
          const iNext = (i + 1) % RADIAL_SEGS
          const a = ringStart + i
          const b = ringStart + iNext
          const c = nextRingStart + iNext
          const d = nextRingStart + i

          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }

      const apexIdx = numVertices - 1
      const lastRingStart = (totalRings - 1) * RADIAL_SEGS
      for (let i = 0; i < RADIAL_SEGS; i++) {
        const iNext = (i + 1) % RADIAL_SEGS
        indices.push(lastRingStart + i, lastRingStart + iNext, apexIdx)
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
      geometry.setIndex(indices)
      disposableGeometries.push(geometry)

      const mesh = new THREE.Mesh(geometry, handMaterial)
      mesh.castShadow = true
      mesh.receiveShadow = true
      handGroup.add(mesh)

      fingerMeshes.push({ mesh, geometry, finger, totalRings })
    })

    // Joint Fillet Spheres
    const jointCapMeshes: { mesh: THREE.Mesh; idx: number }[] = []
    const allJointIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

    allJointIndices.forEach((idx) => {
      let r = 0.14
      if ([4, 8, 12, 16, 20].includes(idx)) r = 0.08
      else if ([3, 7, 11, 15, 19].includes(idx)) r = 0.10
      else if ([2, 6, 10, 14, 18].includes(idx)) r = 0.13
      else if ([1, 5, 9, 13, 17].includes(idx)) r = 0.16
      else if (idx === 0) r = 0.22

      const capGeo = new THREE.SphereGeometry(r, 16, 16)
      disposableGeometries.push(capGeo)
      const capMesh = new THREE.Mesh(capGeo, handMaterial)
      capMesh.castShadow = true
      handGroup.add(capMesh)
      jointCapMeshes.push({ mesh: capMesh, idx })
    })

    // 3D Visual Joint Indicator Spheres (Raycastable Draggable Handles)
    const jointIndicatorMeshes: { mesh: THREE.Mesh; idx: number }[] = []
    allJointIndices.forEach((idx) => {
      const indMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0,
        depthTest: false,
      })
      disposableMaterials.push(indMat)
      const indGeo = new THREE.SphereGeometry(0.065, 16, 16)
      disposableGeometries.push(indGeo)
      const indMesh = new THREE.Mesh(indGeo, indMat)
      indMesh.renderOrder = 999
      handGroup.add(indMesh)
      jointIndicatorMeshes.push({ mesh: indMesh, idx })
    })

    // Palm Slabs
    const palmGeo = new THREE.SphereGeometry(0.42, 12, 12)
    disposableGeometries.push(palmGeo)
    const palmPlateMesh = new THREE.Mesh(palmGeo, handMaterial)
    palmPlateMesh.scale.set(1.25, 1.1, 0.65)
    handGroup.add(palmPlateMesh)

    const metacarpalMeshes: THREE.Mesh[] = []
    const targetKnuckles = [5, 9, 13, 17]
    targetKnuckles.forEach(() => {
      const strutGeo = new THREE.CylinderGeometry(0.16, 0.18, 1, 16)
      disposableGeometries.push(strutGeo)
      const strut = new THREE.Mesh(strutGeo, handMaterial)
      handGroup.add(strut)
      metacarpalMeshes.push(strut)
    })

    const webbingMeshes: THREE.Mesh[] = []
    const webPairs = [[5, 9], [9, 13], [13, 17], [1, 5]]
    webPairs.forEach(() => {
      const webGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 14)
      disposableGeometries.push(webGeo)
      const webMesh = new THREE.Mesh(webGeo, handMaterial)
      handGroup.add(webMesh)
      webbingMeshes.push(webMesh)
    })

    const thumbGeo = new THREE.CylinderGeometry(0.16, 0.22, 1, 16)
    disposableGeometries.push(thumbGeo)
    const thumbBaseMesh = new THREE.Mesh(thumbGeo, handMaterial)
    handGroup.add(thumbBaseMesh)

    const currentPositions: THREE.Vector3[] = []
    const targetPositions: THREE.Vector3[] = []
    const initialTemplate = activeTemplateRef.current || []

    for (let i = 0; i < 21; i++) {
      const rawPt = initialTemplate[i] || [0, 0, 0]
      const pos = new THREE.Vector3(rawPt[0], rawPt[1], rawPt[2])
      currentPositions.push(pos.clone())
      targetPositions.push(pos.clone())
    }

    // Direct 3D Landmark Mouse Dragging + Camera Orbiting
    const getNDCCoords = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const ndc = getNDCCoords(e)

      if (isEditorOpenRef.current) {
        raycaster.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera)
        const intersects = raycaster.intersectObjects(jointIndicatorMeshes.map((m) => m.mesh))

        if (intersects.length > 0) {
          const hitObj = intersects[0].object
          const hit = jointIndicatorMeshes.find((m) => m.mesh === hitObj)
          if (hit) {
            isJointDraggingRef.current = true
            draggedJointIndexRef.current = hit.idx
            setSelectedJoint(hit.idx)

            // Create Drag Plane facing the camera
            const jointWorldPos = new THREE.Vector3()
            hitObj.getWorldPosition(jointWorldPos)
            const camDir = new THREE.Vector3()
            camera.getWorldDirection(camDir).negate()
            dragPlane.setFromNormalAndCoplanarPoint(camDir, jointWorldPos)

            container.style.cursor = 'grabbing'
            return
          }
        }
      }

      isDraggingRef.current = true
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const ndc = getNDCCoords(e)

      // Hover feedback when Pose Editor is open
      if (isEditorOpenRef.current && !isJointDraggingRef.current && !isDraggingRef.current) {
        raycaster.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera)
        const intersects = raycaster.intersectObjects(jointIndicatorMeshes.map((m) => m.mesh))
        container.style.cursor = intersects.length > 0 ? 'pointer' : 'grab'
      }

      // Handle Direct 3D Joint Dragging
      if (isJointDraggingRef.current && draggedJointIndexRef.current !== null) {
        raycaster.setFromCamera(new THREE.Vector2(ndc.x, ndc.y), camera)
        if (raycaster.ray.intersectPlane(dragPlane, planeIntersect)) {
          // Convert 3D World position to local hand space
          const localPos = planeIntersect.clone()
          handGroup.worldToLocal(localPos)

          const idx = draggedJointIndexRef.current
          const newPt = [
            Number(localPos.x.toFixed(3)),
            Number(localPos.y.toFixed(3)),
            Number(localPos.z.toFixed(3)),
          ]

          const template = activeTemplateRef.current || []
          const updated = template.map((pt, i) => (i === idx ? newPt : pt))
          activeTemplateRef.current = updated
          setLandmarksState(updated)
        }
        return
      }

      // Handle Hand Orbit Rotation
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePosition.current.x
        const deltaY = e.clientY - previousMousePosition.current.y

        rotationOffset.current.y += deltaX * 0.012
        rotationOffset.current.x += deltaY * 0.012
        rotationOffset.current.x = Math.max(-1.8, Math.min(1.8, rotationOffset.current.x))

        setRotX(Number(rotationOffset.current.x.toFixed(2)))
        setRotY(Number(rotationOffset.current.y.toFixed(2)))

        previousMousePosition.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      isJointDraggingRef.current = false
      draggedJointIndexRef.current = null
      container.style.cursor = 'grab'
    }

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      const floatY = Math.sin(elapsedTime * 2.2) * 0.05
      handGroup.position.y = floatY

      // Flip / Mirror scale logic
      const baseMirrorScale = selectedHand === 'right' ? -1 : 1
      const localMirrorScale = isMirroredRef.current ? -1 : 1
      handGroup.scale.set(baseMirrorScale * localMirrorScale, 1, 1)

      // Smooth Rotation
      const targetRotX = rotationOffset.current.x
      const targetRotY = rotationOffset.current.y
      const targetRotZ = rotationOffset.current.z || 0
      handGroup.rotation.x += (targetRotX - handGroup.rotation.x) * 0.15
      handGroup.rotation.y += (targetRotY - handGroup.rotation.y) * 0.15
      handGroup.rotation.z += (targetRotZ - handGroup.rotation.z) * 0.15

      const template = activeTemplateRef.current || []
      for (let i = 0; i < 21; i++) {
        if (template[i]) {
          const raw = template[i]
          targetPositions[i].set(raw[0], raw[1], raw[2])
        }
      }

      for (let i = 0; i < 21; i++) {
        currentPositions[i].lerp(targetPositions[i], 0.25)
      }

      jointCapMeshes.forEach(({ mesh, idx }) => {
        if (currentPositions[idx]) {
          mesh.position.copy(currentPositions[idx])
        }
      })

      // 3D Pose Editor Indicators Update
      jointIndicatorMeshes.forEach(({ mesh, idx }) => {
        if (currentPositions[idx]) {
          mesh.position.copy(currentPositions[idx])
        }
        const mat = mesh.material as THREE.MeshBasicMaterial
        if (isEditorOpenRef.current) {
          const isSelected = selectedJointRef.current === idx
          mat.opacity = isSelected ? 0.95 : 0.55
          mat.color.setHex(isSelected ? 0xffb703 : 0x00ffcc)
          mesh.scale.setScalar(isSelected ? 1.6 : 1.0)
        } else {
          mat.opacity = 0
        }
      })

      const pWrist = currentPositions[0]
      const pThumbBase = currentPositions[1]
      const pMiddleKnuckle = currentPositions[9]
      const pPinkyKnuckle = currentPositions[17]

      // Update Finger Meshes
      fingerMeshes.forEach(({ geometry, finger }) => {
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
        const posArr = posAttr.array as Float32Array

        const joints = finger.joints.map((idx) => currentPositions[idx])
        const numBones = joints.length - 1

        const spinePoints: { pos: THREE.Vector3; tangent: THREE.Vector3; radius: number }[] = []

        for (let b = 0; b < numBones; b++) {
          const pA = joints[b]
          const pB = joints[b + 1]
          const rA = finger.radii[b]
          const rB = finger.radii[b + 1]
          const dir = new THREE.Vector3().subVectors(pB, pA).normalize()

          for (let s = 0; s < LONG_SEGS_PER_BONE; s++) {
            const t = s / LONG_SEGS_PER_BONE
            const p = new THREE.Vector3().lerpVectors(pA, pB, t)
            const r = (1 - t) * rA + t * rB
            spinePoints.push({ pos: p, tangent: dir, radius: r })
          }
        }

        const lastJoint = joints[joints.length - 1]
        const prevJoint = joints[joints.length - 2]
        const tipDir = new THREE.Vector3().subVectors(lastJoint, prevJoint).normalize()
        const tipRadius = finger.radii[finger.radii.length - 1]

        spinePoints.push({ pos: lastJoint.clone(), tangent: tipDir, radius: tipRadius })

        const domeSteps = 4
        for (let d = 1; d <= domeSteps; d++) {
          const phi = (d / domeSteps) * (Math.PI / 2)
          const offsetDist = Math.sin(phi) * tipRadius * 0.95
          const ringRad = Math.cos(phi) * tipRadius
          const domeCenter = new THREE.Vector3().addVectors(lastJoint, tipDir.clone().multiplyScalar(offsetDist))
          spinePoints.push({ pos: domeCenter, tangent: tipDir, radius: Math.max(ringRad, 0.01) })
        }

        let vIdx = 0
        let refUp = new THREE.Vector3(0, 0, 1)

        spinePoints.forEach((spine) => {
          const T = spine.tangent.clone()
          let N = new THREE.Vector3().crossVectors(T, refUp).normalize()
          if (N.lengthSq() < 0.001) {
            refUp = new THREE.Vector3(1, 0, 0)
            N = new THREE.Vector3().crossVectors(T, refUp).normalize()
          }
          const B = new THREE.Vector3().crossVectors(N, T).normalize()
          refUp = B.clone()

          for (let i = 0; i < RADIAL_SEGS; i++) {
            const angle = (i / RADIAL_SEGS) * Math.PI * 2
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)

            const normal = new THREE.Vector3().addVectors(
              N.clone().multiplyScalar(cos),
              B.clone().multiplyScalar(sin)
            ).normalize()

            const vertex = new THREE.Vector3().addVectors(
              spine.pos,
              normal.clone().multiplyScalar(spine.radius)
            )

            posArr[vIdx * 3] = vertex.x
            posArr[vIdx * 3 + 1] = vertex.y
            posArr[vIdx * 3 + 2] = vertex.z

            vIdx++
          }
        })

        const tipApex = new THREE.Vector3().addVectors(lastJoint, tipDir.clone().multiplyScalar(tipRadius * 1.05))
        posArr[vIdx * 3] = tipApex.x
        posArr[vIdx * 3 + 1] = tipApex.y
        posArr[vIdx * 3 + 2] = tipApex.z

        geometry.computeVertexNormals()
        posAttr.needsUpdate = true
      })

      // Palm Plate
      const palmCenter = new THREE.Vector3().addVectors(pWrist, pMiddleKnuckle).multiplyScalar(0.5)
      palmPlateMesh.position.copy(palmCenter)
      const palmDir = new THREE.Vector3().subVectors(pMiddleKnuckle, pWrist).normalize()
      const palmUp = new THREE.Vector3().crossVectors(
        palmDir,
        new THREE.Vector3().subVectors(pPinkyKnuckle, pWrist)
      ).normalize()

      const palmRotMat = new THREE.Matrix4().makeBasis(
        new THREE.Vector3().crossVectors(palmUp, palmDir).normalize(),
        palmDir,
        palmUp
      )
      palmPlateMesh.rotation.setFromRotationMatrix(palmRotMat)

      targetKnuckles.forEach((kIdx, i) => {
        const kPos = currentPositions[kIdx]
        const strut = metacarpalMeshes[i]
        const mid = new THREE.Vector3().addVectors(pWrist, kPos).multiplyScalar(0.5)
        const dist = pWrist.distanceTo(kPos)
        strut.position.copy(mid)
        strut.scale.set(1, dist, 1)

        const dir = new THREE.Vector3().subVectors(kPos, pWrist).normalize()
        const rotMat = new THREE.Matrix4().makeBasis(
          new THREE.Vector3(1, 0, 0),
          dir,
          new THREE.Vector3(0, 0, 1)
        )
        strut.rotation.setFromRotationMatrix(rotMat)
      })

      webPairs.forEach(([aIdx, bIdx], i) => {
        const pA = currentPositions[aIdx]
        const pB = currentPositions[bIdx]
        const webMesh = webbingMeshes[i]
        const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5)
        const dist = pA.distanceTo(pB)
        webMesh.position.copy(mid)
        webMesh.scale.set(1, dist, 1)

        const dir = new THREE.Vector3().subVectors(pB, pA).normalize()
        const rotMat = new THREE.Matrix4().makeBasis(
          new THREE.Vector3(1, 0, 0),
          dir,
          new THREE.Vector3(0, 0, 1)
        )
        webMesh.rotation.setFromRotationMatrix(rotMat)
      })

      const tMid = new THREE.Vector3().addVectors(pWrist, pThumbBase).multiplyScalar(0.5)
      const tDist = pWrist.distanceTo(pThumbBase)
      thumbBaseMesh.position.copy(tMid)
      thumbBaseMesh.scale.set(1, tDist, 1)
      const tDir = new THREE.Vector3().subVectors(pThumbBase, pWrist).normalize()
      const tRotMat = new THREE.Matrix4().makeBasis(
        new THREE.Vector3(1, 0, 0),
        tDir,
        new THREE.Vector3(0, 0, 1)
      )
      thumbBaseMesh.rotation.setFromRotationMatrix(tRotMat)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('resize', handleResize)

      disposableGeometries.forEach((g) => g.dispose())
      disposableMaterials.forEach((m) => m.dispose())
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [selectedHand])

  const resetRotation = () => {
    const norm = normalizeLetter(currentLetter)
    const defaultRotX = norm === 'Ω' ? 0.75 : 0.05
    const defaultRotY = ['Μ', 'Ν', 'Ω'].includes(norm) ? 0 : Math.PI
    setRotX(defaultRotX)
    setRotY(defaultRotY)
    setRotZ(0)
    rotationOffset.current = { x: defaultRotX, y: defaultRotY, z: 0 }
  }

  const activeJointCoords = landmarksState[selectedJoint] || [0, 0, 0]

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.18)} 0%, ${theme.palette.background.default} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* 3D Canvas Mount with WCAG AAA Keyboard Orbit Navigation & ARIA Accessibility */}
      <Box
        ref={mountRef}
        tabIndex={0}
        role='region'
        aria-label={
          isGreek
            ? `Διαδραστικός 3D οδηγός νοηματικής για το γράμμα ${normLetter}. ${letterTip}`
            : `Interactive 3D sign language guide for letter ${normLetter}. ${letterTip}`
        }
        onKeyDown={(e) => {
          const ORBIT_STEP = 0.15
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            rotationOffset.current.y -= ORBIT_STEP
            setRotY(Number(rotationOffset.current.y.toFixed(2)))
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            rotationOffset.current.y += ORBIT_STEP
            setRotY(Number(rotationOffset.current.y.toFixed(2)))
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            rotationOffset.current.x = Math.max(-1.8, rotationOffset.current.x - ORBIT_STEP)
            setRotX(Number(rotationOffset.current.x.toFixed(2)))
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            rotationOffset.current.x = Math.min(1.8, rotationOffset.current.x + ORBIT_STEP)
            setRotX(Number(rotationOffset.current.x.toFixed(2)))
          }
          if (e.key === 'r' || e.key === 'R') {
            e.preventDefault()
            resetRotation()
          }
        }}
        sx={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
          '&:focus-visible': {
            outline: `3px solid ${theme.palette.primary.main}`,
            outlineOffset: '-3px',
          },
        }}
      />

      {/* Floating Badge (Top Left) */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 10, sm: 20 },
          left: { xs: 10, sm: 20 },
          background: alpha(theme.palette.background.default, 0.90),
          backdropFilter: 'blur(16px)',
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 0.6, sm: 1.0 },
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.8, sm: 1.4 },
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: theme.zIndex.appBar - 10,
        }}
      >
        <Typography variant='subtitle1' sx={{ color: theme.palette.primary.main, fontWeight: 900, fontSize: { xs: '0.95rem', sm: '1.2rem' } }}>
          {letterInfo.letter} ({letterDisplayName})
        </Typography>
        <Typography variant='caption' sx={{ color: theme.palette.warning.main, fontWeight: 700, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
          • {selectedHand === 'right' ? (isGreek ? 'Δεξί Χέρι 🤚' : 'Right Hand 🤚') : (isGreek ? 'Αριστερό Χέρι ✋' : 'Left Hand ✋')}
        </Typography>
      </Box>

      {/* Direct Dragging Visual Mode Banner (Top Center) */}
      {IS_POSE_EDITOR_ENABLED && isEditorOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: alpha(theme.palette.primary.main, 0.90),
            backdropFilter: 'blur(12px)',
            color: theme.palette.text.primary,
            px: 2.5,
            py: 0.8,
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
            zIndex: theme.zIndex.appBar - 5,
            pointerEvents: 'none',
          }}
        >
          <TouchAppIcon fontSize='small' />
          <Typography variant='caption' sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
            Direct 3D Drag Active: Click & drag any sphere to shape the hand!
          </Typography>
        </Box>
      )}

      {/* Interactive Controls Overlay (Bottom Right) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 10, sm: 20 },
          right: { xs: 10, sm: 20 },
          display: 'flex',
          gap: 1.2,
          background: alpha(theme.palette.background.default, 0.90),
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          p: { xs: 0.4, sm: 0.8 },
          border: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar - 10,
        }}
      >
        {IS_POSE_EDITOR_ENABLED && (
          <Tooltip title={isEditorOpen ? 'Close 3D Pose Editor' : 'Open 3D Pose Editor 🛠️'}>
            <IconButton
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              size='small'
              sx={{ color: isEditorOpen ? theme.palette.warning.main : theme.palette.text.secondary }}
            >
              <TuneIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
        {onHandToggle && (
          <Tooltip title={isGreek ? `Αλλαγή σε ${selectedHand === 'right' ? 'Αριστερό' : 'Δεξί'} Χέρι` : `Switch to ${selectedHand === 'right' ? 'Left' : 'Right'} Hand`}>
            <IconButton onClick={onHandToggle} size='small' sx={{ color: theme.palette.text.secondary }}>
              <PanToolIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={isGreek ? 'Επαναφορά Γωνίας Προβολής' : 'Reset 3D View Angle'}>
          <IconButton onClick={resetRotation} size='small' sx={{ color: theme.palette.text.secondary }}>
            <RotateRightIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Child-Friendly Hint Description (Bottom Left) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 10, sm: 20 },
          left: { xs: 10, sm: 20 },
          maxWidth: { xs: '65%', sm: '50%' },
          background: alpha(theme.palette.background.default, 0.90),
          backdropFilter: 'blur(12px)',
          px: { xs: 1.4, sm: 2.2 },
          py: { xs: 0.6, sm: 1.0 },
          borderRadius: 3.5,
          border: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar - 10,
        }}
      >
        <Typography variant='caption' sx={{ color: '#E2E8F0', fontSize: { xs: '0.78rem', sm: '0.9rem' }, fontWeight: 600, display: 'block' }}>
          💡 {letterTip}
        </Typography>
      </Box>

      {/* 3D Pose Editor Drawer */}
      {IS_POSE_EDITOR_ENABLED && (
        <Drawer
          anchor='right'
          open={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 400 },
              background: 'rgba(15, 23, 42, 0.96)',
              backdropFilter: 'blur(20px)',
              color: '#F8FAFC',
              p: 2.5,
              borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              overflowY: 'auto',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon sx={{ color: '#00B4D8' }} />
              <Typography variant='h6' sx={{ fontWeight: 800, color: '#00B4D8' }}>
                3D Gesture Designer ({normLetter})
              </Typography>
            </Box>
            <IconButton onClick={() => setIsEditorOpen(false)} size='small' sx={{ color: '#94A3B8' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 1. Joint Picker & Coordinate Sliders */}
          <Box sx={{ background: 'rgba(255,255,255,0.03)', p: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant='subtitle2' sx={{ color: '#00B4D8', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TouchAppIcon fontSize='small' /> Joint Position (3D Drag & Sliders)
            </Typography>

            <FormControl fullWidth size='small' sx={{ mb: 1.5 }}>
              <InputLabel sx={{ color: '#94A3B8' }}>Selected Landmark Joint</InputLabel>
              <Select
                value={selectedJoint}
                label='Selected Landmark Joint'
                onChange={(e) => setSelectedJoint(Number(e.target.value))}
                sx={{
                  color: '#F8FAFC',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00B4D8' },
                }}
              >
                {Object.entries(LANDMARK_NAMES).map(([idx, name]) => (
                  <MenuItem key={idx} value={Number(idx)}>
                    Joint {idx}: {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Chip
              label={`Editing Joint ${selectedJoint}: ${LANDMARK_NAMES[selectedJoint] || ''}`}
              sx={{ background: 'rgba(0, 180, 216, 0.15)', color: '#00B4D8', fontWeight: 700, width: '100%', mb: 1.5 }}
            />

            <Box sx={{ px: 1 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8', fontWeight: 700 }}>
                X Coordinate: {activeJointCoords[0].toFixed(3)}
              </Typography>
              <Slider
                min={-1.5}
                max={1.5}
                step={0.01}
                value={activeJointCoords[0]}
                onChange={(_, val) => handleJointChange(0, val as number)}
                sx={{ color: '#00B4D8' }}
              />
            </Box>

            <Box sx={{ px: 1 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8', fontWeight: 700 }}>
                Y Coordinate: {activeJointCoords[1].toFixed(3)}
              </Typography>
              <Slider
                min={-1.5}
                max={1.5}
                step={0.01}
                value={activeJointCoords[1]}
                onChange={(_, val) => handleJointChange(1, val as number)}
                sx={{ color: '#10B981' }}
              />
            </Box>

            <Box sx={{ px: 1 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8', fontWeight: 700 }}>
                Z Coordinate: {activeJointCoords[2].toFixed(3)}
              </Typography>
              <Slider
                min={-1.5}
                max={1.5}
                step={0.01}
                value={activeJointCoords[2]}
                onChange={(_, val) => handleJointChange(2, val as number)}
                sx={{ color: '#FBBF24' }}
              />
            </Box>
          </Box>

          {/* 2. Orientation & Mirror Controls */}
          <Box sx={{ background: 'rgba(255,255,255,0.03)', p: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant='subtitle2' sx={{ color: '#FFB703', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThreeDRotationIcon fontSize='small' /> Starting Orientation & Flip
            </Typography>

            <Box sx={{ px: 1, mb: 1 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8', fontWeight: 700 }}>
                X Rotation (Pitch): {(rotX * (180 / Math.PI)).toFixed(0)}°
              </Typography>
              <Slider
                min={-Math.PI}
                max={Math.PI}
                step={0.02}
                value={rotX}
                onChange={(_, val) => setRotX(val as number)}
                sx={{ color: '#FFB703' }}
              />
            </Box>

            <Box sx={{ px: 1, mb: 1 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8', fontWeight: 700 }}>
                Y Rotation (Yaw): {(rotY * (180 / Math.PI)).toFixed(0)}°
              </Typography>
              <Slider
                min={-Math.PI * 1.5}
                max={Math.PI * 1.5}
                step={0.02}
                value={rotY}
                onChange={(_, val) => setRotY(val as number)}
                sx={{ color: '#FFB703' }}
              />
            </Box>

            <Box sx={{ px: 1, mb: 1 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8', fontWeight: 700 }}>
                Z Rotation (Roll): {(rotZ * (180 / Math.PI)).toFixed(0)}°
              </Typography>
              <Slider
                min={-Math.PI}
                max={Math.PI}
                step={0.02}
                value={rotZ}
                onChange={(_, val) => setRotZ(val as number)}
                sx={{ color: '#FFB703' }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={isMirrored}
                  onChange={(e) => setIsMirrored(e.target.checked)}
                  color='primary'
                />
              }
              label={
                <Typography variant='body2' sx={{ fontWeight: 700, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <SwapHorizIcon fontSize='small' /> Flip Hand Horizontal (Mirror)
                </Typography>
              }
              sx={{ mt: 0.5, ml: 0.2 }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            <Button
              variant='contained'
              startIcon={<SaveIcon />}
              onClick={handleSaveLocal}
              sx={{
                backgroundColor: '#10B981',
                fontWeight: 800,
                py: 1.2,
                '&:hover': { backgroundColor: '#059669' },
              }}
            >
              Save Complete Gesture to App
            </Button>
            <Button
              variant='outlined'
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyCode}
              sx={{
                borderColor: '#00B4D8',
                color: '#00B4D8',
                fontWeight: 700,
                '&:hover': { borderColor: '#38BDF8', backgroundColor: 'rgba(0,180,216,0.1)' },
              }}
            >
              Copy Full Gesture Code Snippet
            </Button>
            <Button
              variant='text'
              startIcon={<RestartAltIcon />}
              onClick={handleResetPose}
              sx={{ color: '#EF4444', fontWeight: 700 }}
            >
              Reset Gesture to Default
            </Button>
          </Box>
        </Drawer>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='success' onClose={() => setToastMessage(null)} sx={{ fontWeight: 700 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default HandGuide3D
