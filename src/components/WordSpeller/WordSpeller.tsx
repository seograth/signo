import React from 'react'
import { Box, Typography, Chip, Tooltip, IconButton } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { motion, AnimatePresence } from 'framer-motion'
import { GslWord } from '../../services/gslDictionary'

interface WordSpellerProps {
  currentWord: GslWord
  currentLetterIndex: number
  onSkipWord?: () => void
  showHint?: boolean
  onToggleHint?: () => void
}

export const WordSpeller: React.FC<WordSpellerProps> = ({
  currentWord,
  currentLetterIndex,
  onSkipWord,
  showHint = false,
  onToggleHint,
}) => {
  const letters = currentWord.word.split('')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        width: '100%',
      }}
    >
      {/* Header Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='h5' sx={{ mr: 0.5 }}>
            {currentWord.emoji}
          </Typography>
          <Typography variant='h6' sx={{ fontWeight: 800, color: '#FFFFFF' }}>
            {currentWord.translationEl}
          </Typography>
          <Typography variant='body2' sx={{ color: '#94A3B8' }}>
            ({currentWord.translationEn})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`Level ${currentWord.level}`}
            size='small'
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              color: '#818CF8',
              fontWeight: 700,
              border: '1px solid rgba(99, 102, 241, 0.4)',
            }}
          />
          {onToggleHint && (
            <Tooltip title={showHint ? 'Hide Hint' : 'Show Hint'}>
              <IconButton size='small' onClick={onToggleHint} sx={{ color: showHint ? '#FBBF24' : '#94A3B8' }}>
                <HelpOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {onSkipWord && (
            <Tooltip title='Skip Word'>
              <IconButton size='small' onClick={onSkipWord} sx={{ color: '#94A3B8' }}>
                <SkipNextIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Letter Tiles Array */}
      <Box sx={{ display: 'flex', gap: { xs: 1, md: 1.5 }, my: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {letters.map((char, index) => {
          const isCompleted = index < currentLetterIndex
          const isCurrent = index === currentLetterIndex

          return (
            <motion.div
              key={`${char}-${index}`}
              animate={{
                scale: isCurrent ? 1.12 : 1,
                y: isCurrent ? -4 : 0,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 46, md: 58 },
                  height: { xs: 56, md: 68 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  background: isCompleted
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.4) 100%)'
                    : isCurrent
                    ? 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)'
                    : 'rgba(30, 41, 59, 0.8)',
                  border: isCompleted
                    ? '2px solid #10B981'
                    : isCurrent
                    ? '2px solid #FDE68A'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isCurrent
                    ? '0 0 16px rgba(251, 191, 36, 0.5)'
                    : '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'background 0.3s ease, border 0.3s ease',
                }}
              >
                {isCompleted && (
                  <CheckCircleIcon
                    sx={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      fontSize: 18,
                      color: '#10B981',
                      background: '#0F172A',
                      borderRadius: '50%',
                    }}
                  />
                )}
                <Typography
                  variant='h4'
                  sx={{
                    fontWeight: 900,
                    color: isCurrent ? '#0F172A' : '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  {char}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: isCurrent ? '#78350F' : '#94A3B8',
                    mt: 0.2,
                  }}
                >
                  {index + 1}
                </Typography>
              </Box>
            </motion.div>
          )
        })}
      </Box>

      {/* Hint Alert Bar */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ width: '100%', overflow: 'hidden' }}
          >
            <Box
              sx={{
                mt: 2,
                p: 1.2,
                borderRadius: 2,
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                textAlign: 'center',
              }}
            >
              <Typography variant='caption' sx={{ color: '#FDE68A', fontWeight: 600 }}>
                💡 Hint: {currentWord.hint}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default WordSpeller
