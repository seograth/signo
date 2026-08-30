import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material'
import PanToolIcon from '@mui/icons-material/PanTool'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TimerIcon from '@mui/icons-material/Timer'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ReplayIcon from '@mui/icons-material/Replay'
import StarIcon from '@mui/icons-material/Star'
import HomeIcon from '@mui/icons-material/Home'
import confetti from 'canvas-confetti'
import { useNavigate } from 'react-router-dom'
import HandGuide3D from '../../components/HandGuide3D/HandGuide3D'
import CameraView from '../../components/CameraView/CameraView'
import WordSpeller from '../../components/WordSpeller/WordSpeller'
import { GSL_ALPHABET, GSL_WORDS, GslLetter, GslWord } from '../../services/gslDictionary'
import audioEngine from '../../services/audioEngine'

type LearnMode = 'words' | 'alphabet' | 'speed'

export const Learn: React.FC = () => {
  const navigate = useNavigate()
  const [selectedHand, setSelectedHand] = useState<'right' | 'left'>('right')
  const [mode, setMode] = useState<LearnMode>('words')
  const [isMuted, setIsMuted] = useState<boolean>(audioEngine.getMuted())

  // Word Mode State
  const [wordIndex, setWordIndex] = useState<number>(0)
  const [letterInWordIndex, setLetterInWordIndex] = useState<number>(0)
  const [showHint, setShowHint] = useState<boolean>(false)
  const [levelFilter] = useState<number>(3)

  // Alphabet Mode State
  const [alphabetIndex, setAlphabetIndex] = useState<number>(0)

  // Speed Rush State
  const [speedTimer, setSpeedTimer] = useState<number>(60)
  const [speedActive, setSpeedActive] = useState<boolean>(false)
  const [speedFinished, setSpeedFinished] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [streak, setStreak] = useState<number>(0)
  const [bestStreak, setBestStreak] = useState<number>(0)
  const [lettersCompletedCount, setLettersCompletedCount] = useState<number>(0)

  const activeWords = GSL_WORDS.filter((w) => w.level <= levelFilter)
  const currentWord: GslWord = activeWords[wordIndex % activeWords.length] || GSL_WORDS[0]
  const currentWordLetterChar = currentWord.word[letterInWordIndex] || 'Α'
  const currentWordLetter: GslLetter =
    GSL_ALPHABET.find((l) => l.letter === currentWordLetterChar) || GSL_ALPHABET[0]

  const currentAlphabetLetter: GslLetter = GSL_ALPHABET[alphabetIndex] || GSL_ALPHABET[0]

  const activeTargetLetter = mode === 'words' ? currentWordLetter : currentAlphabetLetter

  // Speed Rush Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (mode === 'speed' && speedActive && speedTimer > 0) {
      timer = setInterval(() => {
        setSpeedTimer((prev) => {
          if (prev <= 1) {
            setSpeedActive(false)
            setSpeedFinished(true)
            audioEngine.playWordCompleteFanfare()
            confetti({
              particleCount: 100,
              spread: 90,
              origin: { y: 0.5 },
              colors: ['#FBBF24', '#10B981', '#6366F1', '#EC4899', '#38BDF8'],
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [mode, speedActive, speedTimer])

  // Handle Letter Matched directly from CameraView
  const handleLetterMatched = () => {
    if (mode === 'speed' && (!speedActive || speedTimer <= 0)) {
      return
    }

    const nextStreak = streak + 1
    setStreak(nextStreak)
    if (nextStreak > bestStreak) setBestStreak(nextStreak)

    const pointsGained = 100 * Math.min(nextStreak, 5)
    setScore((prev) => prev + pointsGained)
    setLettersCompletedCount((prev) => prev + 1)

    if (mode === 'words') {
      if (letterInWordIndex + 1 < currentWord.word.length) {
        setLetterInWordIndex((prev) => prev + 1)
      } else {
        audioEngine.playWordCompleteFanfare()
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FBBF24', '#10B981', '#6366F1', '#EC4899'],
        })
        setLetterInWordIndex(0)
        setWordIndex((prev) => (prev + 1) % activeWords.length)
      }
    } else if (mode === 'alphabet') {
      setAlphabetIndex((prev) => (prev + 1) % GSL_ALPHABET.length)
    } else if (mode === 'speed') {
      setAlphabetIndex((prev) => (prev + Math.floor(Math.random() * 5) + 1) % GSL_ALPHABET.length)
    }
  }

  const startSpeedRush = () => {
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setLettersCompletedCount(0)
    setSpeedTimer(60)
    setSpeedFinished(false)
    setSpeedActive(true)
    audioEngine.playSuccessChime()
  }

  const handleMuteToggle = () => {
    const muted = audioEngine.toggleMute()
    setIsMuted(muted)
  }

  const toggleHand = () => {
    audioEngine.playPop()
    setSelectedHand((prev) => (prev === 'right' ? 'left' : 'right'))
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1, md: 1.5 },
        gap: 1.2,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header Row (Controls, Modes, Stats) */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        {/* Mode Switcher Tabs */}
        <Tabs
          value={mode}
          onChange={(_, val) => {
            audioEngine.playPop()
            setMode(val)
            setStreak(0)
            setSpeedActive(false)
            setSpeedFinished(false)
          }}
          textColor='secondary'
          indicatorColor='secondary'
          sx={{
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: 3.5,
            p: 0.4,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: { xs: '0.82rem', md: '0.9rem' },
              minHeight: 38,
              py: 0.5,
              px: 2,
              borderRadius: 3,
              color: '#94A3B8',
              '&.Mui-selected': {
                color: '#FBBF24',
              },
            },
          }}
        >
          <Tab label='✨ Word Quest' value='words' />
          <Tab label='🔤 Alphabet Explorer' value='alphabet' />
          <Tab label='⚡ Speed Rush' value='speed' />
        </Tabs>

        {/* Center / Word / Alphabet / Speed Compact Helper */}
        {mode === 'words' && (
          <Box sx={{ flex: 1, maxWidth: 500, mx: 1 }}>
            <WordSpeller
              currentWord={currentWord}
              currentLetterIndex={letterInWordIndex}
              showHint={showHint}
              onToggleHint={() => setShowHint((prev) => !prev)}
              onSkipWord={() => {
                audioEngine.playPop()
                setLetterInWordIndex(0)
                setWordIndex((prev) => (prev + 1) % activeWords.length)
              }}
            />
          </Box>
        )}

        {mode === 'alphabet' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              background: 'rgba(17, 24, 39, 0.8)',
              backdropFilter: 'blur(12px)',
              px: 1,
              py: 0.4,
              height: 46,
              minHeight: 46,
              boxSizing: 'border-box',
              borderRadius: 3.5,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflowX: 'auto',
              maxWidth: { xs: '100%', md: '52%' },
            }}
          >
            <IconButton
              size='small'
              onClick={() => {
                audioEngine.playPop()
                setAlphabetIndex((prev) => (prev - 1 + GSL_ALPHABET.length) % GSL_ALPHABET.length)
              }}
              sx={{ color: '#E2E8F0', p: 0.4 }}
            >
              <ArrowBackIcon fontSize='small' />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 0.5, overflowX: 'auto', py: 0.2 }}>
              {GSL_ALPHABET.map((item, idx) => (
                <Button
                  key={item.letter}
                  variant={idx === alphabetIndex ? 'contained' : 'text'}
                  color={idx === alphabetIndex ? 'secondary' : 'inherit'}
                  size='small'
                  onClick={() => {
                    audioEngine.playPop()
                    setAlphabetIndex(idx)
                  }}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    p: 0,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    borderRadius: 2,
                    color: idx === alphabetIndex ? '#000000' : '#CBD5E1',
                  }}
                >
                  {item.letter}
                </Button>
              ))}
            </Box>

            <IconButton
              size='small'
              onClick={() => {
                audioEngine.playPop()
                setAlphabetIndex((prev) => (prev + 1) % GSL_ALPHABET.length)
              }}
              sx={{ color: '#E2E8F0', p: 0.4 }}
            >
              <ArrowForwardIcon fontSize='small' />
            </IconButton>
          </Box>
        )}

        {mode === 'speed' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, maxWidth: 420, mx: 1 }}>
            <Paper
              sx={{
                flex: 1,
                height: 46,
                minHeight: 46,
                boxSizing: 'border-box',
                py: 0.4,
                px: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 3.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimerIcon sx={{ color: speedTimer <= 10 ? '#EF4444' : '#FBBF24', fontSize: 22 }} />
                <Typography variant='caption' sx={{ fontWeight: 800, color: speedTimer <= 10 ? '#EF4444' : '#FFFFFF', fontSize: '0.85rem' }}>
                  {speedActive ? `${speedTimer}s` : speedFinished ? 'Done' : '60s'}
                </Typography>
              </Box>

              {speedActive ? (
                <LinearProgress
                  variant='determinate'
                  value={(speedTimer / 60) * 100}
                  sx={{
                    flex: 1,
                    mx: 1.5,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: speedTimer <= 10 ? '#EF4444' : '#FBBF24',
                      borderRadius: 3,
                    },
                  }}
                />
              ) : (
                <Button
                  variant='contained'
                  color='secondary'
                  size='small'
                  onClick={startSpeedRush}
                  sx={{ borderRadius: 2.5, fontWeight: 800, py: 0.2, px: 1.5, fontSize: '0.78rem' }}
                >
                  {speedFinished ? 'Replay 🚀' : 'Start ⚡'}
                </Button>
              )}
            </Paper>
          </Box>
        )}

        {/* User Status / Score & Accessibility Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 46, minHeight: 46 }}>
          {streak > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                px: 1.2,
                height: 38,
                borderRadius: 2.5,
              }}
            >
              <LocalFireDepartmentIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
              <Typography variant='caption' sx={{ color: '#FBBF24', fontWeight: 800 }}>
                {streak}
              </Typography>
            </Box>
          )}

          {mode === 'speed' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                px: 1.2,
                height: 38,
                borderRadius: 2.5,
              }}
            >
              <EmojiEventsIcon sx={{ color: '#818CF8', fontSize: 18 }} />
              <Typography variant='caption' sx={{ color: '#818CF8', fontWeight: 800 }}>
                {score}
              </Typography>
            </Box>
          )}

          {/* Hand Toggle */}
          <Tooltip title={`Signing with ${selectedHand === 'right' ? 'Right' : 'Left'} Hand (Click to switch)`}>
            <Button
              variant='outlined'
              size='small'
              onClick={toggleHand}
              startIcon={<PanToolIcon fontSize='small' />}
              sx={{ borderRadius: 2.5, textTransform: 'capitalize', height: 38 }}
            >
              {selectedHand}
            </Button>
          </Tooltip>

          {/* Home Navigation */}
          <Tooltip title='Return to Home Page'>
            <IconButton
              size='small'
              onClick={() => {
                audioEngine.playPop()
                navigate('/')
              }}
              sx={{ color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.1)', height: 38, width: 38 }}
            >
              <HomeIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          {/* Audio Toggle */}
          <Tooltip title={isMuted ? 'Unmute Audio' : 'Mute Audio'}>
            <IconButton size='small' onClick={handleMuteToggle} sx={{ color: '#E2E8F0', border: '1px solid rgba(255,255,255,0.1)', height: 38, width: 38 }}>
              {isMuted ? <VolumeOffIcon fontSize='small' /> : <VolumeUpIcon fontSize='small' />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Full-Screen Split View (50% Hand Guide, 50% Camera Mirror Always) */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left Half (50% Width, 100% Height): Continuous 3D Animated Hand */}
        <Box sx={{ flex: '1 1 50%', width: '50%', height: '100%', minWidth: 0, minHeight: 0 }}>
          <HandGuide3D
            currentLetter={activeTargetLetter.letter}
            selectedHand={selectedHand}
            onHandToggle={toggleHand}
          />
        </Box>

        {/* Right Half (50% Width, 100% Height): Live Camera Feed */}
        <Box sx={{ flex: '1 1 50%', width: '50%', height: '100%', minWidth: 0, minHeight: 0 }}>
          <CameraView
            selectedHand={selectedHand}
            targetLetter={activeTargetLetter.letter}
            onMatchSuccess={handleLetterMatched}
            isPaused={mode === 'speed' && !speedActive && speedTimer === 0}
          />
        </Box>
      </Box>

      {/* Speed Rush Game Over Summary Modal */}
      <Dialog
        open={speedFinished}
        onClose={() => setSpeedFinished(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1E1B4B 0%, #0F172A 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 5,
            p: 2,
            textAlign: 'center',
            maxWidth: 450,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <EmojiEventsIcon sx={{ fontSize: 56, color: '#FBBF24', mb: 1 }} />
          <Typography variant='h5' sx={{ fontWeight: 800, color: '#FFFFFF' }}>
            Speed Rush Complete! ⚡
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, my: 2 }}>
            <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 3 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8' }}>
                Final Score
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 900, color: '#FBBF24' }}>
                {score}
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 3 }}>
              <Typography variant='caption' sx={{ color: '#94A3B8' }}>
                Letters Signed
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 900, color: '#10B981' }}>
                {lettersCompletedCount}
              </Typography>
            </Paper>
          </Box>

          <Paper sx={{ p: 1.5, mb: 2, background: 'rgba(99, 102, 241, 0.15)', borderRadius: 3, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#FBBF24' }} />
              <Typography variant='body2' sx={{ color: '#E2E8F0', fontWeight: 700 }}>
                Rank: {lettersCompletedCount >= 20 ? '🏆 GSL Grandmaster' : lettersCompletedCount >= 12 ? '⚡ Lightning Signer' : '🌟 Fast Fingers'}
              </Typography>
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            variant='outlined'
            onClick={() => {
              setSpeedFinished(false)
              setMode('words')
            }}
            sx={{ borderRadius: 3 }}
          >
            Word Quest
          </Button>
          <Button
            variant='contained'
            color='secondary'
            startIcon={<ReplayIcon />}
            onClick={startSpeedRush}
            sx={{ borderRadius: 3, fontWeight: 800, px: 3 }}
          >
            Play Again 🚀
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Learn
