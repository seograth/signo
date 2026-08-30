import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import RotateRightIcon from '@mui/icons-material/RotateRight'
import PanToolIcon from '@mui/icons-material/PanTool'
import gslTemplates from '../../assets/gsl_landmark_templates.json'
import { GSL_ALPHABET, GslLetter, LETTER_TO_INDEX } from '../../services/gslDictionary'

interface HandGuide3DProps {
  currentLetter: string
  selectedHand: 'right' | 'left'
  onHandToggle?: () => void
}

// Finger definitions with natural human/cartoon tapering
const FINGERS_CONFIG = [
  // Thumb: landmark indices 1 -> 2 -> 3 -> 4
  { name: 'thumb', joints: [1, 2, 3, 4], radii: [0.18, 0.16, 0.14, 0.12] },
  // Index: landmark indices 5 -> 6 -> 7 -> 8
  { name: 'index', joints: [5, 6, 7, 8], radii: [0.14, 0.13, 0.11, 0.095] },
  // Middle: landmark indices 9 -> 10 -> 11 -> 12
  { name: 'middle', joints: [9, 10, 11, 12], radii: [0.145, 0.135, 0.115, 0.095] },
  // Ring: landmark indices 13 -> 14 -> 15 -> 16
  { name: 'ring', joints: [13, 14, 15, 16], radii: [0.14, 0.125, 0.11, 0.09] },
  // Pinky: landmark indices 17 -> 18 -> 19 -> 20
  { name: 'pinky', joints: [17, 18, 19, 20], radii: [0.12, 0.11, 0.09, 0.075] },
]

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

// Custom corrected 3D landmark templates for GSL letters requiring shape fixes
const OVERRIDE_LANDMARKS: Record<string, number[][]> = {
  // Γ (Gamma, index 3): Wrist at top, Index finger pointing straight DOWN (-Y), thumb extended left horizontally (-X)
  'Γ': [
    [0.0, 0.5, 0.0],
    [-0.15, 0.35, 0.05], [-0.35, 0.20, 0.05], [-0.60, 0.20, 0.0], [-0.85, 0.20, -0.05],
    [-0.15, 0.25, 0.05], [-0.15, -0.10, 0.0], [-0.15, -0.38, -0.03], [-0.15, -0.62, -0.05],
    [0.10, 0.20, 0.05], [0.10, 0.05, 0.20], [0.10, 0.25, 0.15], [0.10, 0.25, 0.0],
    [0.25, 0.18, 0.03], [0.25, 0.08, 0.18], [0.25, 0.25, 0.12], [0.25, 0.25, 0.0],
    [0.38, 0.15, 0.0], [0.38, 0.05, 0.15], [0.38, 0.18, 0.10], [0.38, 0.18, 0.0],
  ],
  // Λ (Lambda, index 11): Inverted Λ shape with Index extending DOWN-RIGHT and Thumb extending DOWN-LEFT
  'Λ': [
    [0.0, 0.65, 0.0],
    [-0.15, 0.45, 0.05], [-0.30, 0.25, 0.05], [-0.50, -0.05, 0.0], [-0.70, -0.35, -0.05],
    [0.05, 0.30, 0.05], [0.20, 0.05, 0.0], [0.40, -0.22, -0.03], [0.58, -0.48, -0.05],
    [0.15, 0.25, 0.05], [0.15, 0.38, 0.18], [0.15, 0.22, 0.12], [0.15, 0.22, 0.0],
    [0.28, 0.22, 0.03], [0.28, 0.35, 0.16], [0.28, 0.20, 0.10], [0.28, 0.20, 0.0],
    [0.40, 0.18, 0.0], [0.40, 0.30, 0.14], [0.40, 0.18, 0.08], [0.40, 0.18, 0.0],
  ],
  // Π (Pi, index 16): Wrist at top, Index & Middle fingers spaced out clearly pointing straight DOWN like legs of Π
  'Π': [
    [0.0, 0.75, -0.1],
    [-0.30, 0.60, -0.05], [-0.32, 0.40, 0.02], [-0.10, 0.35, 0.08], [0.0, 0.28, 0.08],
    [-0.22, 0.25, 0.0], [-0.24, -0.10, 0.08], [-0.25, -0.40, 0.12], [-0.26, -0.68, 0.15],
    [0.22, 0.25, 0.0], [0.24, -0.10, 0.08], [0.25, -0.40, 0.12], [0.26, -0.68, 0.15],
    [0.35, 0.20, -0.05], [0.35, 0.32, 0.08], [0.35, 0.20, 0.05], [0.35, 0.20, -0.05],
    [0.48, 0.18, -0.08], [0.48, 0.28, 0.05], [0.48, 0.18, 0.02], [0.48, 0.18, -0.08],
  ],
  // Τ (Tau, index 19): Upright fist facing front, thumb tucked under index peeking out between index & middle
  'Τ': [
    [0.0, -0.9, 0.0],
    [-0.30, -0.65, 0.05], [-0.35, -0.40, 0.15], [-0.10, -0.05, 0.32], [-0.05, -0.02, 0.38],
    [-0.20, -0.15, 0.05], [-0.22, 0.15, 0.20], [-0.22, -0.05, 0.18], [-0.20, -0.15, 0.08],
    [0.05, -0.15, 0.05], [0.05, 0.15, 0.20], [0.05, -0.05, 0.18], [0.05, -0.15, 0.08],
    [0.25, -0.20, 0.03], [0.25, 0.10, 0.18], [0.25, -0.08, 0.15], [0.25, -0.18, 0.06],
    [0.40, -0.25, 0.0], [0.40, 0.02, 0.15], [0.40, -0.10, 0.12], [0.40, -0.20, 0.04],
  ],
  // Ω (Omega, index 24): Fingers bent sharply over palm forming the horseshoe arch of Ω
  'Ω': [
    [0.0, -0.85, 0.0],
    [-0.25, -0.60, 0.05], [-0.35, -0.35, 0.15], [-0.30, -0.10, 0.22], [-0.15, 0.05, 0.25],
    [-0.20, -0.15, 0.05], [-0.22, 0.25, 0.25], [-0.20, 0.12, 0.35], [-0.12, -0.05, 0.28],
    [0.0, -0.12, 0.05], [0.0, 0.30, 0.25], [0.0, 0.15, 0.38], [0.0, -0.05, 0.30],
    [0.20, -0.15, 0.05], [0.22, 0.25, 0.25], [0.20, 0.12, 0.35], [0.12, -0.05, 0.28],
    [0.35, -0.20, 0.03], [0.38, 0.15, 0.20], [0.35, 0.05, 0.30], [0.25, -0.08, 0.25],
  ],
}

// Letters that require horizontal mirroring
const HORIZONTALLY_MIRRORED_LETTERS = ['Ζ', 'Θ', 'Ξ', 'Μ', 'Ν', 'Ω']

function getLetterLandmarks(letter: string): number[][] {
  const norm = normalizeLetter(letter)
  const idx = LETTER_TO_INDEX[norm] || LETTER_TO_INDEX[letter] || 1
  let landmarks =
    OVERRIDE_LANDMARKS[norm] ||
    OVERRIDE_LANDMARKS[letter] ||
    (gslTemplates as Record<string, number[][]>)[String(idx)] ||
    (gslTemplates as Record<string, number[][]>)['1']

  if (HORIZONTALLY_MIRRORED_LETTERS.includes(norm) || HORIZONTALLY_MIRRORED_LETTERS.includes(letter)) {
    landmarks = landmarks.map(([x, y, z]) => [-x, y, z])
  }

  return landmarks
}

export const HandGuide3D: React.FC<HandGuide3DProps> = ({
  currentLetter,
  selectedHand,
  onHandToggle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const normLetter = normalizeLetter(currentLetter)

  // Initial Y rotation set depending on letter (180 degrees default, 0 for M/N)
  const rotationOffset = useRef({
    x: 0.05,
    y: ['Μ', 'Ν'].includes(normLetter) ? 0 : Math.PI,
  })

  const letterInfo: GslLetter =
    GSL_ALPHABET.find((l) => l.letter === normLetter || l.letter === currentLetter) || GSL_ALPHABET[0]

  const activeTemplateRef = useRef<number[][]>(getLetterLandmarks(currentLetter))

  useEffect(() => {
    const norm = normalizeLetter(currentLetter)
    activeTemplateRef.current = getLetterLandmarks(currentLetter)
    if (['Μ', 'Ν'].includes(norm)) {
      rotationOffset.current = { x: 0.05, y: 0 }
    } else {
      rotationOffset.current = { x: 0.05, y: Math.PI }
    }
  }, [currentLetter])

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

    // 2. High-Quality WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 3. Studio Character Lighting matching user's purple clay reference image
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2)
    scene.add(ambientLight)

    // Primary Key Light (Top Right)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2)
    keyLight.position.set(5, 8, 8)
    keyLight.castShadow = true
    scene.add(keyLight)

    // Soft Purple Fill Light (Left)
    const fillLight = new THREE.DirectionalLight(0xc084fc, 2.2)
    fillLight.position.set(-6, -2, 5)
    scene.add(fillLight)

    // Electric Cyan & Warm Amber Rim Lights
    const rimLight = new THREE.DirectionalLight(0x00b4d8, 3.0)
    rimLight.position.set(0, -5, -4)
    scene.add(rimLight)

    const topRimLight = new THREE.DirectionalLight(0xffb703, 2.2)
    topRimLight.position.set(0, 7, -3)
    scene.add(topRimLight)

    // 4. Vibrant Electric Cyan Material matching design system
    const handMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00b4d8,        // Electric Cyan (--color-brand-primary)
      roughness: 0.22,        // Glossy silicone / vinyl clay surface
      metalness: 0.05,
      clearcoat: 0.55,        // High-end clearcoat shine
      clearcoatRoughness: 0.15,
      reflectivity: 0.6,
      side: THREE.DoubleSide,
    })

    // Root Hand Object
    const handGroup = new THREE.Group()
    handGroup.position.set(0, 0, 0)
    scene.add(handGroup)

    // 5. Build Continuous Watertight Procedural Finger Geometries
    const fingerMeshes: {
      mesh: THREE.Mesh
      geometry: THREE.BufferGeometry
      finger: typeof FINGERS_CONFIG[0]
      totalRings: number
    }[] = []

    FINGERS_CONFIG.forEach((finger) => {
      const numBones = finger.joints.length - 1
      const totalRings = numBones * LONG_SEGS_PER_BONE + 1 + 4 // +4 rings for smooth fingertip dome
      const numVertices = totalRings * RADIAL_SEGS + 1 // +1 for apex tip vertex

      const positions = new Float32Array(numVertices * 3)
      const normals = new Float32Array(numVertices * 3)
      const indices: number[] = []

      // Generate quad strip indices connecting rings
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

      // Generate tip cap triangle fan
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

      const mesh = new THREE.Mesh(geometry, handMaterial)
      handGroup.add(mesh)

      fingerMeshes.push({ mesh, geometry, finger, totalRings })
    })

    // Joint Fillet Pivot Spheres (Smooths out sharp knuckle curls on fists)
    const jointCapMeshes: { mesh: THREE.Mesh; idx: number }[] = []
    FINGERS_CONFIG.forEach((finger) => {
      finger.joints.forEach((idx, step) => {
        const rad = finger.radii[step]
        const cap = new THREE.Mesh(new THREE.SphereGeometry(rad * 1.02, 16, 16), handMaterial)
        handGroup.add(cap)
        jointCapMeshes.push({ mesh: cap, idx })
      })
    })

    // 6. Sculpted Organic Palm Structure
    // Smooth Rounded Wrist Base
    const wristDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 1, 1),
      handMaterial
    )
    wristDome.scale.set(1.15, 0.85, 0.85)
    handGroup.add(wristDome)

    // Fleshy Thenar Pad (Thumb Base Muscle)
    const thenarMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 1, 1),
      handMaterial
    )
    thenarMesh.scale.set(1.2, 1.2, 0.9)
    handGroup.add(thenarMesh)

    // Fleshy Hypothenar Pad (Pinky Base Muscle)
    const hypothenarMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 1, 1),
      handMaterial
    )
    hypothenarMesh.scale.set(1.1, 1.15, 0.85)
    handGroup.add(hypothenarMesh)

    // Organic Metacarpal Palm Struts (Wrist to Knuckles)
    const metacarpalMeshes: THREE.Mesh[] = []
    const targetKnuckles = [5, 9, 13, 17]
    targetKnuckles.forEach(() => {
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.18, 1, 16),
        handMaterial
      )
      handGroup.add(strut)
      metacarpalMeshes.push(strut)
    })

    // Inter-digital Webbing Bridges (Between adjacent fingers)
    const webbingMeshes: THREE.Mesh[] = []
    const webPairs = [[5, 9], [9, 13], [13, 17], [1, 5]] // includes thumb-index web!
    webPairs.forEach(() => {
      const webMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 1, 14),
        handMaterial
      )
      handGroup.add(webMesh)
      webbingMeshes.push(webMesh)
    })

    // Connect Thumb Base to Palm (Landmark 0 to 1)
    const thumbBaseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.22, 1, 16),
      handMaterial
    )
    handGroup.add(thumbBaseMesh)

    // Smooth Lerp Positions
    const currentPositions: THREE.Vector3[] = []
    const targetPositions: THREE.Vector3[] = []
    const initialTemplate = activeTemplateRef.current || []

    for (let i = 0; i < 21; i++) {
      const rawPt = initialTemplate[i] || [0, 0, 0]
      const pos = new THREE.Vector3(rawPt[0], rawPt[1], rawPt[2])
      currentPositions.push(pos.clone())
      targetPositions.push(pos.clone())
    }

    // Mouse / Touch Drag Rotation Handling
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const deltaX = e.clientX - previousMousePosition.current.x
      const deltaY = e.clientY - previousMousePosition.current.y

      rotationOffset.current.y += deltaX * 0.012
      rotationOffset.current.x += deltaY * 0.012
      rotationOffset.current.x = Math.max(-0.6, Math.min(0.6, rotationOffset.current.x))

      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
    }

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    // Touch support for mobile / tablets
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDraggingRef.current = true
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y

      rotationOffset.current.y += deltaX * 0.012
      rotationOffset.current.x += deltaY * 0.012
      rotationOffset.current.x = Math.max(-0.6, Math.min(0.6, rotationOffset.current.x))

      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    const handleTouchEnd = () => {
      isDraggingRef.current = false
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    // 7. Animation & Procedural Single-Surface Skinning Loop
    let animId: number
    const clock = new THREE.Clock()
    const upVector = new THREE.Vector3(0, 1, 0)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Gentle breathing float
      const floatY = Math.sin(elapsedTime * 2.2) * 0.05
      handGroup.position.y = floatY

      // Horizontally mirror hand guide to match mirrored selfie webcam view
      const mirrorScale = selectedHand === 'right' ? -1 : 1
      handGroup.scale.set(mirrorScale, 1, 1)

      // Drag Rotation
      const targetRotX = rotationOffset.current.x
      const targetRotY = rotationOffset.current.y
      handGroup.rotation.x += (targetRotX - handGroup.rotation.x) * 0.12
      handGroup.rotation.y += (targetRotY - handGroup.rotation.y) * 0.12

      // Interpolate landmark targets smoothly
      const template = activeTemplateRef.current || []
      for (let i = 0; i < 21; i++) {
        if (template[i]) {
          const raw = template[i]
          targetPositions[i].set(raw[0], raw[1], raw[2])
        }
      }

      for (let i = 0; i < 21; i++) {
        currentPositions[i].lerp(targetPositions[i], 0.16)
      }

      // Update joint fillet positions
      jointCapMeshes.forEach(({ mesh, idx }) => {
        if (currentPositions[idx]) {
          mesh.position.copy(currentPositions[idx])
        }
      })

      // Base Landmark References
      const pWrist = currentPositions[0]
      const pThumbBase = currentPositions[1]
      const pPinkyKnuckle = currentPositions[17]

      // A. Update Deformable Finger Loft Meshes
      fingerMeshes.forEach(({ geometry, finger }) => {
        const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
        const posArr = posAttr.array as Float32Array

        const joints = finger.joints.map((idx) => currentPositions[idx])
        const numBones = joints.length - 1

        // Build continuous center spline points along the finger
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

        // Add final tip joint
        const lastJoint = joints[joints.length - 1]
        const prevJoint = joints[joints.length - 2]
        const tipDir = new THREE.Vector3().subVectors(lastJoint, prevJoint).normalize()
        const tipRadius = finger.radii[finger.radii.length - 1]

        spinePoints.push({ pos: lastJoint.clone(), tangent: tipDir, radius: tipRadius })

        // Add rounded hemisphere tip dome rings
        const domeSteps = 4
        for (let d = 1; d <= domeSteps; d++) {
          const phi = (d / domeSteps) * (Math.PI / 2)
          const offsetDist = Math.sin(phi) * tipRadius * 0.95
          const ringRad = Math.cos(phi) * tipRadius
          const domeCenter = new THREE.Vector3().addVectors(lastJoint, tipDir.clone().multiplyScalar(offsetDist))
          spinePoints.push({ pos: domeCenter, tangent: tipDir, radius: Math.max(ringRad, 0.01) })
        }

        // Generate radial vertices around each spine point
        let vIdx = 0
        let refUp = new THREE.Vector3(0, 0, 1)

        spinePoints.forEach((spine) => {
          let normal = new THREE.Vector3().crossVectors(spine.tangent, refUp).normalize()
          if (normal.lengthSq() < 0.1) {
            refUp = new THREE.Vector3(0, 1, 0)
            normal = new THREE.Vector3().crossVectors(spine.tangent, refUp).normalize()
          }
          const binormal = new THREE.Vector3().crossVectors(spine.tangent, normal).normalize()

          for (let i = 0; i < RADIAL_SEGS; i++) {
            const angle = (i / RADIAL_SEGS) * Math.PI * 2
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)

            const vx = spine.pos.x + spine.radius * (cos * normal.x + sin * binormal.x)
            const vy = spine.pos.y + spine.radius * (cos * normal.y + sin * binormal.y)
            const vz = spine.pos.z + spine.radius * (cos * normal.z + sin * binormal.z)

            posArr[vIdx * 3 + 0] = vx
            posArr[vIdx * 3 + 1] = vy
            posArr[vIdx * 3 + 2] = vz
            vIdx++
          }
        })

        // Apex tip point
        const tipApex = new THREE.Vector3().addVectors(lastJoint, tipDir.clone().multiplyScalar(tipRadius * 1.05))
        posArr[vIdx * 3 + 0] = tipApex.x
        posArr[vIdx * 3 + 1] = tipApex.y
        posArr[vIdx * 3 + 2] = tipApex.z

        posAttr.needsUpdate = true
        geometry.computeVertexNormals()
      })

      // B. Update Palm Structures
      if (pWrist) {
        if (wristDome) {
          wristDome.position.copy(pWrist)
        }

        if (thenarMesh && pThumbBase) {
          const thenarPos = new THREE.Vector3().addVectors(pWrist, pThumbBase).multiplyScalar(0.5)
          thenarMesh.position.copy(thenarPos).add(new THREE.Vector3(-0.06, 0, 0.04))
        }

        if (hypothenarMesh && pPinkyKnuckle) {
          const hypPos = new THREE.Vector3().addVectors(pWrist, pPinkyKnuckle).multiplyScalar(0.5)
          hypothenarMesh.position.copy(hypPos).add(new THREE.Vector3(0.06, 0, 0.04))
        }

        if (thumbBaseMesh && pThumbBase) {
          const midpoint = new THREE.Vector3().addVectors(pWrist, pThumbBase).multiplyScalar(0.5)
          const distance = pWrist.distanceTo(pThumbBase)
          thumbBaseMesh.position.copy(midpoint)
          thumbBaseMesh.scale.set(1, Math.max(distance, 0.01), 1)
          const direction = new THREE.Vector3().subVectors(pThumbBase, pWrist).normalize()
          thumbBaseMesh.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(upVector, direction))
        }

        // Metacarpal Struts (Wrist 0 to Knuckles 5, 9, 13, 17)
        targetKnuckles.forEach((kIdx, sIdx) => {
          const pK = currentPositions[kIdx]
          const strut = metacarpalMeshes[sIdx]
          if (pK && strut) {
            const midpoint = new THREE.Vector3().addVectors(pWrist, pK).multiplyScalar(0.5)
            const distance = pWrist.distanceTo(pK)
            strut.position.copy(midpoint)
            strut.scale.set(1, Math.max(distance, 0.01), 1)
            const direction = new THREE.Vector3().subVectors(pK, pWrist).normalize()
            strut.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(upVector, direction))
          }
        })

        // Webbing bridges between Index-Middle (5-9), Middle-Ring (9-13), Ring-Pinky (13-17), Thumb-Index (1-5)
        webPairs.forEach(([iA, iB], wIdx) => {
          const pA = currentPositions[iA]
          const pB = currentPositions[iB]
          const wMesh = webbingMeshes[wIdx]
          if (pA && pB && wMesh) {
            const wCenter = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5)
            const wDist = pA.distanceTo(pB)
            wMesh.position.copy(wCenter)
            wMesh.scale.set(1, Math.max(wDist, 0.01), 1)
            const wDir = new THREE.Vector3().subVectors(pB, pA).normalize()
            wMesh.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(upVector, wDir))
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth / 2
      const h = container.clientHeight || window.innerHeight
      const aspect = w / h
      camera.aspect = aspect
      // Dynamic Responsive FOV: expands camera field of view on narrow aspect ratios (e.g. mobile portrait)
      camera.fov = aspect < 1.0 ? Math.min(65, 40 / aspect) : 40
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    handleResize()

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
      renderer.dispose()
    }
  }, [selectedHand])

  const resetRotation = () => {
    const norm = normalizeLetter(currentLetter)
    if (['Μ', 'Ν'].includes(norm)) {
      rotationOffset.current = { x: 0.05, y: 0 }
    } else {
      rotationOffset.current = { x: 0.05, y: Math.PI }
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(0, 180, 216, 0.18) 0%, #1A1D28 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Full-bleed 3D Canvas Mount */}
      <Box
        ref={mountRef}
        sx={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
        }}
      />

      {/* Floating Badge (Top Left) */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 10, sm: 20 },
          left: { xs: 10, sm: 20 },
          background: 'rgba(26, 29, 40, 0.90)',
          backdropFilter: 'blur(16px)',
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 0.6, sm: 1.0 },
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.8, sm: 1.4 },
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 2,
        }}
      >
        <Typography variant='subtitle1' sx={{ color: '#00B4D8', fontWeight: 900, fontSize: { xs: '0.95rem', sm: '1.2rem' } }}>
          {letterInfo.letter} ({letterInfo.name})
        </Typography>
        <Typography variant='caption' sx={{ color: '#FFB703', fontWeight: 700, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
          • {selectedHand === 'right' ? 'Right Hand 🤚' : 'Left Hand ✋'}
        </Typography>
      </Box>

      {/* Interactive Controls Overlay (Bottom Right) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 10, sm: 20 },
          right: { xs: 10, sm: 20 },
          display: 'flex',
          gap: 1.2,
          background: 'rgba(26, 29, 40, 0.90)',
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          p: { xs: 0.4, sm: 0.8 },
          border: '1px solid rgba(255, 255, 255, 0.12)',
          zIndex: 2,
        }}
      >
        {onHandToggle && (
          <Tooltip title={`Switch to ${selectedHand === 'right' ? 'Left' : 'Right'} Hand`}>
            <IconButton onClick={onHandToggle} size='small' sx={{ color: '#E2E8F0' }}>
              <PanToolIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title='Reset 3D View Angle'>
          <IconButton onClick={resetRotation} size='small' sx={{ color: '#E2E8F0' }}>
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
          maxWidth: { xs: '65%', sm: '75%' },
          background: 'rgba(26, 29, 40, 0.90)',
          backdropFilter: 'blur(12px)',
          px: { xs: 1.4, sm: 2.2 },
          py: { xs: 0.6, sm: 1.0 },
          borderRadius: 3.5,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          zIndex: 2,
        }}
      >
        <Typography variant='caption' sx={{ color: '#E2E8F0', fontSize: { xs: '0.78rem', sm: '0.9rem' }, fontWeight: 600, display: 'block' }}>
          💡 {letterInfo.description}
        </Typography>
      </Box>
    </Box>
  )
}

export default HandGuide3D
