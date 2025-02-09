import { FilesetResolver, HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'

import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import greekAlphabet from '../../utils/greekAlphabet'

function drawConnectors(
  ctx: CanvasRenderingContext2D,
  handLandmarks: any,
  connections: number[][],
  style: { color: string; lineWidth: number },
) {
  ctx.strokeStyle = style.color
  ctx.lineWidth = style.lineWidth
  connections.forEach(([start, end]) => {
    const startPt = handLandmarks[start]
    const endPt = handLandmarks[end]
    ctx.beginPath()
    ctx.moveTo(startPt.x * ctx.canvas.width, startPt.y * ctx.canvas.height)
    ctx.lineTo(endPt.x * ctx.canvas.width, endPt.y * ctx.canvas.height)
    ctx.stroke()
  })
}

function drawLandmarks(ctx: CanvasRenderingContext2D, handLandmarks: NormalizedLandmark[]) {
  ctx.fillStyle = '#FF0000'
  handLandmarks.forEach(({ x, y }) => {
    ctx.beginPath()
    ctx.arc(x * ctx.canvas.width, y * ctx.canvas.height, 5, 0, 2 * Math.PI)
    ctx.fill()
  })
}

function Learn() {
  const [selectedHand, setSelectedHand] = useState<string>('')
  const [currentLetter, setCurrentLetter] = useState<string>(greekAlphabet[0])
  const { t } = useTranslation()
  const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null)

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js#video
  // npm i @mediapipe/drawing_utils CHECK FOR BETTER DRAWING
  // const landmarkerRef = useRef<HandLandmarker | null>(null)

  useEffect(() => {
    const initializeLandmarker = async () => {
      try {
        const visionFileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm',
        )
        const handLandmarker = await HandLandmarker.createFromOptions(visionFileset, {
          baseOptions: {
            modelAssetPath: ` https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: 'CPU',
          },
          runningMode: 'IMAGE',
          numHands: 2,
        })
        // landmarkerRef.current = handLandmarker
        setLandmarker(handLandmarker)
      } catch (error) {
        console.error('Error initializing HandLandmarker:', error)
      }
    }

    initializeLandmarker()

    return () => {
      // if (landmarkerRef.current) {
      //   landmarkerRef.current.close()
      //   landmarkerRef.current = null
      // }
      if (landmarker) {
        landmarker.close()
      }
    }
  }, [])

  // FOR VIDEO
  // const captureFrame = async () => {
  //   if (webcamRef.current && landmarker) {
  //     const video = webcamRef.current.video!
  //     const canvas = canvasRef.current!

  //     const results = await landmarker.detectForVideo(video, performance.now()) // Use detectForVideo
  //     if (results.landmarks.length > 0 && areLandmarksCorrect(results.landmarks, currentLetter)) {
  //       const nextIndex = (greekAlphabet.indexOf(currentLetter) + 1) % greekAlphabet.length
  //       setCurrentLetter(greekAlphabet[nextIndex])
  //     }

  //     drawLandmarks(canvas, results.landmarks)
  //   }
  // }

  // const areLandmarksCorrect = (landmarks: any, letter: string): boolean => {
  //   // Replace with actual logic
  //   return Math.random() > 0.95
  // }

  // const drawLandmarks = (canvas: HTMLCanvasElement | null, landmarks: any) => {
  //   if (!canvas || !landmarks) return
  //   const ctx = canvas.getContext('2d')!
  //   const video = webcamRef.current?.video!
  //   const { videoWidth, videoHeight } = video

  //   canvas.width = videoWidth
  //   canvas.height = videoHeight

  //   ctx.clearRect(0, 0, canvas.width, canvas.height)
  //   ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
  //   ctx.fillStyle = 'red'
  //   landmarks.forEach((hand: any) => {
  //     hand.forEach((point: { x: number; y: number }) => {
  //       ctx.beginPath()
  //       ctx.arc(point.x * videoWidth, point.y * videoHeight, 5, 0, 2 * Math.PI)
  //       ctx.fill()
  //     })
  //   })
  // }

  // useEffect(() => {
  //   const interval = setInterval(captureFrame, 100)
  //   return () => clearInterval(interval)
  // }, [landmarker, currentLetter])

  const captureFrame = async () => {
    if (!webcamRef.current || !canvasRef.current || !landmarker) {
      return // Early return if anything is missing (no webcam, canvas, or landmarker)
    }

    const video = webcamRef.current.video
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d') // ctx could be null

    // Ensure video element and context are available
    if (!video || !ctx) {
      console.error('Video element or canvas context is not available')
      return
    }

    // Ensure the video has valid dimensions
    if (video.videoWidth <= 0 || video.videoHeight <= 0) {
      console.error('Invalid video dimensions:', {
        width: video.videoWidth,
        height: video.videoHeight,
      })
      return
    }

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    try {
      // Detect hand landmarks
      const results = await landmarker.detect(video)

      if (results.landmarks && results.landmarks.length > 0) {
        // Draw detected landmarks if present
        drawDetectedLandmarks(canvas, results.landmarks)

        // Check if landmarks are correct and update the current letter
        if (areLandmarksCorrect(results.landmarks, currentLetter)) {
          const nextIndex = (greekAlphabet.indexOf(currentLetter) + 1) % greekAlphabet.length
          setCurrentLetter(greekAlphabet[nextIndex])
        }
      } else {
        // Clear canvas if no hands detected
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    } catch (error) {
      console.error('Error detecting landmarks:', error)
    }
  }

  useEffect(() => {
    const interval = setInterval(captureFrame, 100)
    return () => clearInterval(interval)
  }, [landmarker, currentLetter])

  const areLandmarksCorrect = (landmarks: any, letter: string): boolean => {
    return Math.random() > 0.95 // Mock condition for testing
  }

  const drawDetectedLandmarks = (canvas: HTMLCanvasElement, landmarks: any) => {
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const video = webcamRef.current?.video!
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)' // Black with 60% opacity
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    landmarks.forEach((handLandmarks: any) => {
      // Draw connections between landmarks
      drawConnectors(
        ctx,
        handLandmarks,
        [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4], // Thumb
          [5, 6],
          [6, 7],
          [7, 8], // Index finger
          [9, 10],
          [10, 11],
          [11, 12], // Middle finger
          [13, 14],
          [14, 15],
          [15, 16], // Ring finger
          [17, 18],
          [18, 19],
          [19, 20], // Pinky finger
          [0, 5],
          [5, 9],
          [9, 13],
          [13, 17],
          [0, 17], // Palm connections
        ],
        { color: '#ffed4d', lineWidth: 2 },
      )

      // Draw individual landmarks
      drawLandmarks(ctx, handLandmarks)
    })
  }

  if (selectedHand.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
        <Container maxWidth='lg' sx={{ mt: '3rem' }}>
          <Grid container sx={{ display: 'flex', width: 1 }} spacing={2}>
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: '3rem',
              }}
            >
              <Typography variant='h4'>{t('learn.handSelection.title')}</Typography>
            </Grid>

            <Grid
              size={{ xs: 6 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant='outlined'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  setSelectedHand('left')
                }}
              >
                <Box sx={{ fontSize: '5rem' }}>✋</Box>
                <Typography variant='body1'>{t('learn.handSelection.left')}</Typography>
              </Button>
            </Grid>
            <Grid
              size={{ xs: 6 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant='outlined'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  setSelectedHand('right')
                }}
              >
                <Box sx={{ fontSize: '5rem' }}>🤚</Box>
                <Typography variant='body1'>{t('learn.handSelection.right')}</Typography>
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      {/* Conditional Layout Based on Selected Hand */}
      {selectedHand === 'left' ? (
        <>
          {/* Webcam and Canvas on the Left */}
          <Box
            sx={{
              width: '50%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              {/* Webcam Feed */}
              <Webcam
                ref={webcamRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: 'rotateY(180deg)',
                  objectFit: 'contain', // Ensures webcam fills container
                  zIndex: 1, // Below the canvas
                }}
              />

              {/* MediaPipe Hands Canvas */}
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 2, // Above webcam feed
                  pointerEvents: 'none', // Disable interaction with canvas
                  transform: 'rotateY(180deg)', // Flip canvas horizontally to match webcam
                  objectFit: 'cover', // Ensures canvas covers the area without stretching
                }}
              />
            </Box>
          </Box>

          {/* Greek Letter on the Right */}
          <Box
            sx={{
              width: '50%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant='h1'>{currentLetter}</Typography>
          </Box>
        </>
      ) : (
        <>
          {/* Greek Letter on the Left */}
          <Box
            sx={{
              width: '50%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant='h1'>{currentLetter}</Typography>
          </Box>

          {/* Webcam and Canvas on the Right */}
          <Box
            sx={{
              width: '50%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              {/* Webcam Feed */}
              <Webcam
                ref={webcamRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: 'rotateY(180deg)',
                  objectFit: 'contain', // Ensures webcam fills container
                  zIndex: 1, // Below the canvas
                }}
              />

              {/* MediaPipe Hands Canvas */}
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 2, // Above webcam feed
                  pointerEvents: 'none', // Disable interaction with canvas
                  transform: 'rotateY(180deg)', // Flip canvas horizontally to match webcam
                  objectFit: 'cover', // Ensures canvas covers the area without stretching
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Learn
