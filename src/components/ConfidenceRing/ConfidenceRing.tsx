import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import confetti from 'canvas-confetti'
import audioEngine from '../../services/audioEngine'
import { GslLetter } from '../../services/gslDictionary'

interface ConfidenceRingProps {
  targetLetter: GslLetter
  isMatching: boolean
  confidence: number
  onComplete: () => void
  holdDurationMs?: number
  size?: number
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
  targetLetter,
  isMatching,
  confidence,
  onComplete,
  holdDurationMs = 800,
  size = 130,
}) => {
  const [progress, setProgress] = useState<number>(0)
  const startTimeRef = useRef<number | null>(null)
  const isCompletedRef = useRef<boolean>(false)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    isCompletedRef.current = false
    setProgress(0)
    startTimeRef.current = null
  }, [targetLetter.letter])

  useEffect(() => {
    const updateProgress = (timestamp: number) => {
      if (isCompletedRef.current) return

      if (isMatching && confidence >= 0.65) {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp
        }

        const elapsed = timestamp - startTimeRef.current
        const rawProgress = Math.min(elapsed / holdDurationMs, 1.0)
        setProgress(rawProgress)

        // Audio tick feedback
        if (rawProgress > 0 && rawProgress < 1.0) {
          audioEngine.playHoldTick(rawProgress)
        }

        if (rawProgress >= 1.0 && !isCompletedRef.current) {
          isCompletedRef.current = true
          audioEngine.playSuccessChime()

          // Confetti particle burst
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FBBF24', '#10B981', '#6366F1', '#38BDF8'],
          })

          onComplete()
        }
      } else {
        // Drain quickly when sign is lost
        startTimeRef.current = null
        setProgress((prev) => Math.max(prev - 0.08, 0))
      }

      animFrameRef.current = requestAnimationFrame(updateProgress)
    }

    animFrameRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isMatching, confidence, holdDurationMs, onComplete])

  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - progress * circumference

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        my: 1,
      }}
    >
      {/* SVG Circular Meter */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='rgba(255, 255, 255, 0.12)'
          strokeWidth={strokeWidth}
          fill='transparent'
        />
        {/* Active Progress Glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress > 0.8 ? '#10B981' : '#FBBF24'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          fill='transparent'
          style={{
            transition: 'stroke 0.2s ease',
            filter: progress > 0 ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' : 'none',
          }}
        />
      </svg>

      {/* Target Letter Inner Core */}
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: size - 24,
          height: size - 24,
          borderRadius: '50%',
          background: isMatching && progress > 0.5
            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          transform: progress > 0 ? `scale(${1 + progress * 0.08})` : 'scale(1)',
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1,
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {targetLetter.letter}
        </Typography>
        <Typography
          variant='caption'
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 700,
            fontSize: '0.75rem',
            mt: 0.2,
          }}
        >
          {targetLetter.name}
        </Typography>
      </Box>
    </Box>
  )
}

export default ConfidenceRing
