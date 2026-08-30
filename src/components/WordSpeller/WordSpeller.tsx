import React from 'react'
import { Box, Typography, Chip, Tooltip, IconButton } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import { motion } from 'framer-motion'
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
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: 3.5,
        px: { xs: 1.2, sm: 1.8 },
        py: 0.4,
        minHeight: 46,
        height: 46,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Word & Emoji Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexShrink: 0 }}>
        <Typography variant='body1' sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
          {currentWord.emoji}
        </Typography>
        <Typography variant='subtitle2' sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          {currentWord.translationEl}
        </Typography>
        <Typography variant='caption' sx={{ color: '#94A3B8', fontSize: '0.75rem', display: { xs: 'none', md: 'inline' } }}>
          ({currentWord.translationEn})
        </Typography>
      </Box>

      {/* Inline Letter Chips (32px height matching Alphabet Explorer chips) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, overflowX: 'auto', py: 0.2 }}>
        {letters.map((char, index) => {
          const isCompleted = index < currentLetterIndex
          const isCurrent = index === currentLetterIndex

          return (
            <motion.div
              key={`${char}-${index}`}
              animate={{
                scale: isCurrent ? 1.08 : 1,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  background: isCompleted
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.4) 100%)'
                    : isCurrent
                    ? 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)'
                    : 'rgba(30, 41, 59, 0.8)',
                  border: isCompleted
                    ? '1.5px solid #10B981'
                    : isCurrent
                    ? '1.5px solid #FDE68A'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: isCurrent
                    ? '0 0 10px rgba(251, 191, 36, 0.4)'
                    : 'none',
                  transition: 'background 0.2s ease, border 0.2s ease',
                }}
              >
                {isCompleted && (
                  <CheckCircleIcon
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      fontSize: 13,
                      color: '#10B981',
                      background: '#0F172A',
                      borderRadius: '50%',
                    }}
                  />
                )}
                <Typography
                  variant='caption'
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    color: isCurrent ? '#0F172A' : '#FFFFFF',
                    lineHeight: 1,
                  }}
                >
                  {char}
                </Typography>
              </Box>
            </motion.div>
          )
        })}
      </Box>

      {/* Level & Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto', flexShrink: 0 }}>
        <Chip
          label={`L${currentWord.level}`}
          size='small'
          sx={{
            height: 24,
            fontSize: '0.7rem',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            color: '#818CF8',
            fontWeight: 800,
            border: '1px solid rgba(99, 102, 241, 0.4)',
            px: 0.5,
          }}
        />
        {onToggleHint && (
          <Tooltip title={showHint ? `Hint: ${currentWord.hint}` : 'Show Hint'}>
            <IconButton size='small' onClick={onToggleHint} sx={{ color: showHint ? '#FBBF24' : '#94A3B8', p: 0.4 }}>
              <HelpOutlineIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
        {onSkipWord && (
          <Tooltip title='Skip Word'>
            <IconButton size='small' onClick={onSkipWord} sx={{ color: '#94A3B8', p: 0.4 }}>
              <SkipNextIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

export default WordSpeller
