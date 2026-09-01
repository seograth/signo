import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Box, Typography, IconButton, Tooltip, Button, LinearProgress } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useTranslation } from 'react-i18next'
import { Landmark3D, PredictionResult, gslClassifier } from '../../services/gslClassifier'
import audioEngine from '../../services/audioEngine'
import useClassifierWorker from '../../hooks/useClassifierWorker'

// MediaPipe Hand Landmark Connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [9, 13], [13, 14], [14, 15], [15, 16],// Ring
  [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [0, 17],                              // Palm Base
]

interface CameraViewProps {
  onPrediction?: (pred: PredictionResult | null) => void
  onMatchSuccess?: () => void
  selectedHand: 'right' | 'left'
  targetLetter?: string
  isPaused?: boolean
}

export const CameraView: React.FC<CameraViewProps> = ({
  onPrediction,
  onMatchSuccess,
  selectedHand,
  targetLetter,
  isPaused = false,
}) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState<boolean>(true)
  const [isHandInView, setIsHandInView] = useState<boolean>(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [currentConfidence, setCurrentConfidence] = useState<number>(0)
  const [detectedLetter, setDetectedLetter] = useState<string>('')
  const [isMatch, setIsMatch] = useState<boolean>(false)
  const [holdProgress, setHoldProgress] = useState<number>(0)
  const [isCoolingDown, setIsCoolingDown] = useState<boolean>(false)

  const animFrameRef = useRef<number | null>(null)
  const handsWorkerRef = useRef<any>(null)
  const currentStreamRef = useRef<MediaStream | null>(null)

  // Mutable refs to ALWAYS provide fresh state to MediaPipe callback and avoid stale closures
  const targetLetterRef = useRef<string | undefined>(targetLetter)
  const selectedHandRef = useRef<'right' | 'left'>(selectedHand)
  const isCoolingDownRef = useRef<boolean>(isCoolingDown)
  const onPredictionRef = useRef(onPrediction)
  const onMatchSuccessRef = useRef(onMatchSuccess)

  useEffect(() => {
    targetLetterRef.current = targetLetter
    selectedHandRef.current = selectedHand
    isCoolingDownRef.current = isCoolingDown
    onPredictionRef.current = onPrediction
    onMatchSuccessRef.current = onMatchSuccess
  })

  // Whenever target letter changes, immediately reset matching state and cooldown
  useEffect(() => {
    setIsMatch(false)
    setHoldProgress(0)
    gslClassifier.resetHistory()
    setIsCoolingDown(true)
    isCoolingDownRef.current = true

    const timer = setTimeout(() => {
      setIsCoolingDown(false)
      isCoolingDownRef.current = false
    }, 600)

    return () => clearTimeout(timer)
  }, [targetLetter])

  // Hold-to-Confirm Timer Loop (requires holding the matching sign steady for ~600ms)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMatch && !isPaused && !isCoolingDown) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([40, 30, 40])
              } catch {
                // Vibration API unsupported or disallowed, fallback silently
              }
            }
            audioEngine.playSuccessChime()
            gslClassifier.resetHistory()
            setIsCoolingDown(true)
            isCoolingDownRef.current = true
            setIsMatch(false)

            if (onMatchSuccessRef.current) {
              onMatchSuccessRef.current()
            }
            return 0
          }
          if (prev > 10 && prev % 25 === 0) {
            audioEngine.playHoldTick(prev / 100)
          }
          return prev + 14 // ~500ms hold
        })
      }, 70)
    } else {
      setHoldProgress(0)
    }
    return () => clearInterval(interval)
  }, [isMatch, isPaused, isCoolingDown])

  // Start Camera Stream directly
  const initWebcam = useCallback(async () => {
    if (!cameraActive) return

    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach((track) => track.stop())
      currentStreamRef.current = null
    }

    try {
      let stream: MediaStream | null = null

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode,
          },
          audio: false,
        })
      } catch (e1) {
        console.warn('Preferred camera constraints failed, falling back to basic video...', e1)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
      }

      if (stream) {
        currentStreamRef.current = stream
        setHasPermission(true)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          try {
            await videoRef.current.play()
          } catch (playErr) {
            console.info('AutoPlay waiting for interaction:', playErr)
          }
        }
      }
    } catch (err: any) {
      console.error('Camera stream access failed:', err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setHasPermission(false)
      } else {
        setHasPermission(null)
      }
    }
  }, [cameraActive, facingMode])

  useEffect(() => {
    initWebcam()

    return () => {
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach((t) => t.stop())
        currentStreamRef.current = null
      }
    }
  }, [initWebcam])

  // Setup MediaPipe Hands Tracking
  useEffect(() => {
    let isSubscribed = true

    async function setupTracker() {
      try {
        const mpHands = await import('@mediapipe/hands')
        const Hands = mpHands.Hands || (window as any).Hands

        if (Hands) {
          const hands = new Hands({
            locateFile: (file: string) => `/mediapipe/${file}`,
          })

          hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.55,
            minTrackingConfidence: 0.55,
          })

          hands.onResults((results: any) => {
            if (!isSubscribed) return
            handleMediaPipeResults(results)
          })

          handsWorkerRef.current = hands
        }
      } catch {
        console.info('Using WebGL camera tracking loop.')
      }
    }

    setupTracker()

    return () => {
      isSubscribed = false
      if (handsWorkerRef.current?.close) {
        handsWorkerRef.current.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isProcessingRef = useRef<boolean>(false)

  // Process Video Frame Loop with Non-Blocking ImageBitmap Transfers
  useEffect(() => {
    let isActive = true

    const processFrame = async () => {
      if (!isActive || isPaused) return

      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState >= 2 && cameraActive && !isProcessingRef.current) {
        if (canvas.width !== (video.videoWidth || 640) || canvas.height !== (video.videoHeight || 480)) {
          canvas.width = video.videoWidth || 640
          canvas.height = video.videoHeight || 480
        }
        const ctx = canvas.getContext('2d')

        if (ctx && handsWorkerRef.current) {
          isProcessingRef.current = true
          let frameSource: ImageBitmap | HTMLVideoElement = video
          try {
            if (typeof createImageBitmap !== 'undefined') {
              try {
                frameSource = await createImageBitmap(video)
              } catch {
                frameSource = video
              }
            }
            await handsWorkerRef.current.send({ image: frameSource })
          } catch {
            // Frame dropped, continue
          } finally {
            if (frameSource !== video && 'close' in frameSource) {
              (frameSource as ImageBitmap).close()
            }
            isProcessingRef.current = false
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame)
    }

    animFrameRef.current = requestAnimationFrame(processFrame)

    return () => {
      isActive = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [cameraActive, isPaused])

  const { predict: predictWorker } = useClassifierWorker()

  const handleMediaPipeResults = async (results: any) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const currentTarget = targetLetterRef.current
    const currentHand = selectedHandRef.current
    const coolingDown = isCoolingDownRef.current

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setIsHandInView(true)
      const landmarksRaw = results.multiHandLandmarks[0]

      // Draw Glowing Neon Skeleton
      drawGlowingSkeleton(ctx, landmarksRaw, canvas.width, canvas.height)

      // Convert to 3D format for classifier (matching cv2.flip training frame space)
      const landmarks3D: Landmark3D[] = landmarksRaw.map((lm: any) => ({
        x: currentHand === 'right' ? 1 - lm.x : lm.x,
        y: lm.y,
        z: lm.z || 0,
      }))

      const prediction = await predictWorker(landmarks3D)
      if (prediction) {
        setDetectedLetter(prediction.letter)
        setCurrentConfidence(prediction.confidence)

        // Only evaluate match against the FRESH target letter and outside cooldown
        const match = currentTarget && !coolingDown ? prediction.isTargetMatch(currentTarget) : false
        setIsMatch(match)

        if (onPredictionRef.current) {
          onPredictionRef.current(prediction)
        }
      }
    } else {
      setIsHandInView(false)
      setCurrentConfidence(0)
      setIsMatch(false)
      if (onPredictionRef.current) {
        onPredictionRef.current(null)
      }
    }
  }

  const drawGlowingSkeleton = (ctx: CanvasRenderingContext2D, landmarks: any[], w: number, h: number) => {
    ctx.save()
    ctx.shadowBlur = 10
    ctx.shadowColor = '#00B4D8'
    ctx.strokeStyle = '#00B4D8'
    ctx.lineWidth = 4.0
    ctx.lineCap = 'round'

    HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = landmarks[startIdx]
      const p2 = landmarks[endIdx]
      if (p1 && p2) {
        ctx.beginPath()
        ctx.moveTo(p1.x * w, p1.y * h)
        ctx.lineTo(p2.x * w, p2.y * h)
        ctx.stroke()
      }
    })

    landmarks.forEach((p, idx) => {
      const isFingertip = [4, 8, 12, 16, 20].includes(idx)
      const radius = isFingertip ? 7.5 : 4.5

      ctx.beginPath()
      ctx.arc(p.x * w, p.y * h, radius, 0, 2 * Math.PI)
      ctx.fillStyle = isFingertip ? '#06D6A0' : '#FFB703'
      ctx.shadowBlur = 12
      ctx.shadowColor = isFingertip ? '#06D6A0' : '#FFB703'
      ctx.fill()
    })

    ctx.restore()
  }

  const toggleCamera = () => {
    setCameraActive((prev) => !prev)
  }

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  const videoTransform = facingMode === 'user' ? 'scaleX(-1)' : undefined

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: theme.palette.background.default,
        borderLeft: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Full-bleed Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: videoTransform,
          transformOrigin: 'center center',
          background: theme.palette.background.default,
          filter: 'brightness(0.50) contrast(1.20)',
          display: cameraActive ? 'block' : 'none',
        }}
      />

      {/* Full-bleed Landmark Overlay Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          objectFit: 'cover',
          transform: videoTransform,
          transformOrigin: 'center center',
          zIndex: 1,
        }}
      />

      {/* Camera Off State */}
      {!cameraActive && (
        <Box sx={{ textAlign: 'center', p: 3, zIndex: 2 }}>
          <VideocamOffIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
          <Typography variant='body1' sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
            {t('camera.paused')}
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size='small'
            onClick={toggleCamera}
            sx={{ mt: 2 }}
          >
            {t('camera.turnOn')}
          </Button>
        </Box>
      )}

      {/* Permission Fallback or Error State */}
      {hasPermission === false && cameraActive && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3,
            background: alpha(theme.palette.background.default, 0.95),
            zIndex: theme.zIndex.modal,
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 44, color: theme.palette.warning.main, mb: 1 }} />
          <Typography variant='h6' sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
            {t('camera.accessNeeded')}
          </Typography>
          <Typography variant='body2' sx={{ color: theme.palette.text.secondary, maxWidth: 360, mt: 0.5, mb: 2 }}>
            {t('camera.permissionDesc')}
          </Typography>
          <Button
            variant='contained'
            color='secondary'
            size='small'
            startIcon={<RefreshIcon />}
            onClick={() => initWebcam()}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            {t('camera.retry')}
          </Button>
        </Box>
      )}

      {/* Floating Status Pill (Top Left) with Accessibility ARIA Live Region */}
      <Box
        role='status'
        aria-live='polite'
        aria-atomic='true'
        aria-label='Sign language gesture recognition live status'
        sx={{
          position: 'absolute',
          top: { xs: 10, sm: 20 },
          left: { xs: 10, sm: 20 },
          minWidth: { xs: 180, sm: 230 },
          background: isMatch ? alpha(theme.palette.success.main, 0.18) : alpha(theme.palette.background.default, 0.90),
          backdropFilter: 'blur(16px)',
          px: { xs: 1.5, sm: 2.4 },
          py: { xs: 0.7, sm: 1.1 },
          borderRadius: 4,
          border: `1.5px solid ${isMatch ? theme.palette.success.main : theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.6,
          zIndex: theme.zIndex.appBar - 10,
          boxShadow: isMatch ? `0 0 24px ${alpha(theme.palette.success.main, 0.5)}` : '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'all 0.25s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: isHandInView
                  ? (isMatch ? theme.palette.success.main : theme.palette.warning.main)
                  : theme.palette.secondary.main,
                boxShadow: `0 0 8px ${
                  isHandInView
                    ? (isMatch ? theme.palette.success.main : theme.palette.warning.main)
                    : theme.palette.secondary.main
                }`,
              }}
            />
            <Typography variant='caption' sx={{ color: theme.palette.text.primary, fontWeight: 800, fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>
              {isCoolingDown
                ? t('camera.next', { letter: targetLetter || '' })
                : isHandInView
                ? detectedLetter
                  ? isMatch
                    ? t('camera.matched', { letter: detectedLetter })
                    : t('camera.detected', { letter: detectedLetter, confidence: Math.round(currentConfidence * 100) })
                  : t('camera.handTracked')
                : t('camera.lookingForHand')}
            </Typography>
          </Box>

          {isMatch && (
            <CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 20 }, color: theme.palette.success.main }} />
          )}
        </Box>

        {/* Loading Bar inside Status Pill when is right */}
        {isMatch ? (
          <Box sx={{ width: '100%', mt: 0.3 }}>
            <LinearProgress
              variant='determinate'
              value={holdProgress}
              sx={{
                height: 7,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.success.main,
                  boxShadow: `0 0 12px ${theme.palette.success.main}`,
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant='caption' sx={{ color: theme.palette.success.light, fontSize: '0.75rem', fontWeight: 700, display: 'block', textAlign: 'right', mt: 0.4 }}>
              {t('camera.holdSteady', { progress: Math.round(holdProgress) })}
            </Typography>
          </Box>
        ) : (
          targetLetter && (
            <Typography variant='caption' sx={{ color: theme.palette.text.secondary, fontSize: '0.8rem' }}>
              {t('camera.target')} <strong style={{ color: theme.palette.warning.main }}>{targetLetter}</strong>
            </Typography>
          )
        )}
      </Box>

      {/* Camera Controls Overlay (Bottom Right) */}
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
        <Tooltip title={cameraActive ? t('camera.turnOff') : t('camera.turnOn')}>
          <IconButton onClick={toggleCamera} size='small' sx={{ color: theme.palette.text.primary }}>
            {cameraActive ? <VideocamIcon fontSize='small' /> : <VideocamOffIcon fontSize='small' />}
          </IconButton>
        </Tooltip>
        <Tooltip title={t('camera.flipCamera')}>
          <IconButton onClick={toggleFacingMode} size='small' sx={{ color: theme.palette.text.primary }}>
            <FlipCameraIosIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('camera.reloadStream')}>
          <IconButton onClick={() => initWebcam()} size='small' sx={{ color: theme.palette.text.primary }}>
            <RefreshIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default CameraView
