import { FilesetResolver, HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'
import { HAND_CONNECTIONS } from '@mediapipe/hands'
import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Webcam from 'react-webcam'
import greekAlphabet from '../../utils/greekAlphabet'
import * as ort from 'onnxruntime-web'

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

function preprocessLandmarks(landmarks: NormalizedLandmark[]): number[] {
  return landmarks.flatMap(landmark => [landmark.x, landmark.y, landmark.z]);
}

async function predictHandSign(session: ort.InferenceSession, landmarks: NormalizedLandmark[]) {
  const preprocessedLandmarks = preprocessLandmarks(landmarks);
  const inputTensor = new ort.Tensor('float32', new Float32Array(preprocessedLandmarks), [1, preprocessedLandmarks.length]);
  const feeds = { input: inputTensor };
  const results = await session.run(feeds);
  const output = results.output.data as Float32Array;
  const predictedClass = Array.from(output).indexOf(Math.max(...output));
  return predictedClass;
}

function Learn() {
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [selectedHand, setSelectedHand] = useState<string>('')
  const [currentLetter, setCurrentLetter] = useState<string>(greekAlphabet[0])
  const { t } = useTranslation()
  const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null)

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Attempting to load the ONNX model");
        ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
        const session = await ort.InferenceSession.create('../../../model_json/sign_model.onnx');
        setSession(session);
      } catch (error) {
        console.error('Error loading ONNX model:', error);
      }
    };

    loadModel();
  }, []);

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

      if (results?.landmarks && results.landmarks.length > 0) {
        drawConnectors(ctx, results.landmarks[0], HAND_CONNECTIONS, { color: 'red', lineWidth: 2 });

        // Check if landmarks are correct and update the current letter
        if (await areLandmarksCorrect(results.landmarks[0], currentLetter)) {
          const nextIndex = (greekAlphabet.indexOf(currentLetter) + 1) % greekAlphabet.length;
          setCurrentLetter(greekAlphabet[nextIndex]);
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

  const areLandmarksCorrect = async (landmarks: NormalizedLandmark[], letter: string): Promise<boolean> => {
    if (!session) {
      console.error('ONNX model session is not loaded');
      return false;
    }

    const predictedClass = await predictHandSign(session, landmarks);
    const predictedLetter = greekAlphabet[predictedClass];
    console.log('Predicted Letter:', predictedLetter);
    return predictedLetter === letter;
  };

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
