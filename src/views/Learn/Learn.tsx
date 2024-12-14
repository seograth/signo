import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import greekAlphabet from '../../utils/greekAlphabet'

function Learn() {
  const [selectedHand, setSelectedHand] = useState<string>('')
  const [currentLetter, setCurrentLetter] = useState<string>(greekAlphabet[0])
  const { t } = useTranslation()
  const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null)

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js#video
  // npm i @mediapipe/drawing_utils CHECK FOR BETTER DRAWING

  useEffect(() => {
    const initializeLandmarker = async () => {
      try {
        const visionFileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm',
        )
        const handLandmarker = await HandLandmarker.createFromOptions(visionFileset, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: 'GPU',
          },

          runningMode: 'IMAGE',
          numHands: 2,
        })
        setLandmarker(handLandmarker)
      } catch (error) {
        console.error('Error initializing HandLandmarker:', error)
      }
    }

    initializeLandmarker()

    return () => {
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
    if (webcamRef.current && canvasRef.current && landmarker) {
      const video = webcamRef.current.video!
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const results = await landmarker.detect(video)

      if (results.landmarks.length > 0) {
        drawLandmarks(canvas, results.landmarks)

        if (areLandmarksCorrect(results.landmarks, currentLetter)) {
          const nextIndex = (greekAlphabet.indexOf(currentLetter) + 1) % greekAlphabet.length
          setCurrentLetter(greekAlphabet[nextIndex])
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear canvas if no hands detected
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(captureFrame, 100)
    return () => clearInterval(interval)
  }, [landmarker, currentLetter])

  const areLandmarksCorrect = (landmarks: any, letter: string): boolean => {
    return Math.random() > 0.95 // Mock condition for testing
  }

  const drawLandmarks = (canvas: HTMLCanvasElement, landmarks: any) => {
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2

    landmarks.forEach((hand: any) => {
      hand.forEach((point: { x: number; y: number }) => {
        const x = point.x * canvas.width
        const y = point.y * canvas.height

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fill()
      })

      for (let i = 0; i < hand.length - 1; i++) {
        const startX = hand[i].x * canvas.width
        const startY = hand[i].y * canvas.height
        const endX = hand[i + 1].x * canvas.width
        const endY = hand[i + 1].y * canvas.height

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Container maxWidth='lg' sx={{ mt: '3rem' }}>
        <Grid container sx={{ display: 'flex', width: 1, height: 1 }} spacing={2}>
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography variant='h4'>Learning is starting...</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box
              sx={{
                border: '1px solid #fff',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
              }}
            >
              <Typography variant='body1'>{currentLetter}</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ display: 'flex' }}>
            <Box
              sx={{
                border: '1px solid #fff',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                width: 1,
              }}
            >
              <Box
                sx={{
                  position: 'relative', // Ensure that the parent container positions children correctly
                  width: '100%',
                  height: 0, // Height will be controlled via padding
                  paddingTop: '75%', // This ensures a 4:3 aspect ratio (3/4 * 100 = 75%)
                }}
              >
                <Webcam
                  ref={webcamRef}
                  style={{
                    position: 'absolute', // Position webcam over the container
                    top: 0,
                    left: 0,
                    width: '100%', // Full width of container
                    height: '100%', // Maintain aspect ratio
                    transform: 'rotateY(180deg)', // Flip webcam horizontally
                    objectFit: 'contain', // Ensures webcam covers the area without stretching
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute', // Position canvas over the webcam
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%', // Keep canvas size matching webcam
                    zIndex: 1, // Ensure canvas is on top of the webcam
                    pointerEvents: 'none', // Prevent canvas from blocking interaction with webcam
                    transform: 'rotateY(180deg)', // Flip canvas horizontally to match webcam
                    objectFit: 'cover', // Ensures canvas covers the area without stretching
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Learn
