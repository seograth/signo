import React from 'react'
import { Box, Button, Container, Typography, Paper } from '@mui/material'
import Grid from '@mui/material/Grid2'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HandGuide3D from '../../components/HandGuide3D/HandGuide3D'

export const Home: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 }, overflowY: 'auto' }}>
      <Container maxWidth='lg'>
        {/* Hero Section */}
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          {/* Left Column: Headline & CTA */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 4,
                  px: 2,
                  py: 0.8,
                  mb: 3,
                }}
              >
                <AutoAwesomeIcon sx={{ color: '#FBBF24', fontSize: 18 }} />
                <Typography variant='caption' sx={{ color: '#FDE68A', fontWeight: 800 }}>
                  Greek Sign Language (ΕΝΓ) Fingerspelling AI
                </Typography>
              </Box>

              <Typography
                variant='h1'
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '3.6rem' },
                  lineHeight: 1.1,
                  mb: 2.5,
                  background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Learn Sign Language, <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Letter by Letter.
                </span>
              </Typography>

              <Typography
                variant='body1'
                sx={{
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  color: '#94A3B8',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Practice the 24 letters of the Greek Fingerspelling Alphabet with instant, real-time AI feedback through your webcam. Interactive, gamified, and 100% private in your browser.
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button
                  variant='contained'
                  color='secondary'
                  size='large'
                  startIcon={<PlayArrowIcon />}
                  onClick={() => navigate('/learn')}
                  sx={{
                    px: 4,
                    py: 1.6,
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    borderRadius: 4,
                  }}
                >
                  Start Practicing Now
                </Button>
                <Button
                  variant='outlined'
                  size='large'
                  startIcon={<TouchAppIcon />}
                  onClick={() => navigate('/how-to')}
                  sx={{
                    px: 3,
                    py: 1.6,
                    fontSize: '1rem',
                    borderRadius: 4,
                  }}
                >
                  How It Works
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Column: Interactive 3D Demo Preview */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: 340, sm: 440, md: 500 },
                  borderRadius: 5,
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* Floating Glow Sphere */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-10%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(40px)',
                    zIndex: 0,
                  }}
                />

                <HandGuide3D currentLetter='Α' selectedHand='right' />
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Feature Highlights Grid */}
        <Box sx={{ mt: { xs: 8, md: 14 } }}>
          <Typography variant='h3' textAlign='center' sx={{ fontWeight: 800, mb: 1 }}>
            Engineered for Interactive Fluency
          </Typography>
          <Typography variant='body1' textAlign='center' sx={{ color: '#94A3B8', mb: 6 }}>
            Inspired by cutting-edge computer vision and game-based learning mechanics.
          </Typography>

          <Grid container spacing={3}>
            {/* Feature 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 3.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'rgba(17, 24, 39, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818CF8',
                    mb: 2,
                  }}
                >
                  <AutoAwesomeIcon />
                </Box>
                <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
                  Real-Time Hand Tracking
                </Typography>
                <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                  Extracts 21 3D geometric landmarks and runs client-side neural network classification with zero latency.
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 2 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 3.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'rgba(17, 24, 39, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(251, 191, 36, 0.4)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(251, 191, 36, 0.15)',
                    color: '#FBBF24',
                    mb: 2,
                  }}
                >
                  <SpeedIcon />
                </Box>
                <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
                  Gamified Word Quests
                </Typography>
                <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                  Spell curated Greek words (Level 1 to 3) with satisfying hold timers, celebratory confetti, and combo streaks.
                </Typography>
              </Paper>
            </Grid>

            {/* Feature 3 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 3.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'rgba(17, 24, 39, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    mb: 2,
                  }}
                >
                  <SecurityIcon />
                </Box>
                <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>
                  100% Client-Side Privacy
                </Typography>
                <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                  Your camera stream never leaves your device. All computer vision and AI models run locally inside your browser.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
