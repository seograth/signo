import React from 'react'
import { Box, Container, Typography, Paper, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import VideocamIcon from '@mui/icons-material/Videocam'
import PanToolIcon from '@mui/icons-material/PanTool'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useNavigate } from 'react-router-dom'

export const HowTo: React.FC = () => {
  const navigate = useNavigate()

  const steps = [
    {
      icon: <VideocamIcon sx={{ fontSize: 36, color: '#6366F1' }} />,
      step: 'Step 1',
      title: 'Position Your Camera & Lighting',
      desc: 'Allow browser webcam access and position your hand roughly 30-50cm from the camera. Ensure good ambient lighting without harsh backlights.',
    },
    {
      icon: <PanToolIcon sx={{ fontSize: 36, color: '#FBBF24' }} />,
      step: 'Step 2',
      title: 'Inspect the 3D Guide',
      desc: 'Look at the 3D hand model demonstrating the target Greek letter. You can click and drag the 3D hand to rotate it and inspect finger bends from any angle.',
    },
    {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#10B981' }} />,
      step: 'Step 3',
      title: 'Form & Hold the Sign',
      desc: 'Mimic the hand shape with your hand. When your sign matches, the glowing green feedback and confidence ring will charge up for 0.8 seconds.',
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 36, color: '#EC4899' }} />,
      step: 'Step 4',
      title: 'Complete Words & Build Streaks',
      desc: 'Spell complete Greek words letter by letter to earn celebratory confetti, level up your vocabulary, or race the clock in 60s Speed Rush!',
    },
  ]

  return (
    <Box sx={{ minHeight: '100%', py: { xs: 4, md: 6 } }}>
      <Container maxWidth='lg'>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant='h2' sx={{ fontWeight: 800, mb: 1.5 }}>
            How SigniFi Works
          </Typography>
          <Typography variant='body1' sx={{ color: '#94A3B8', maxWidth: 600, mx: 'auto' }}>
            A fast, beginner-friendly guide to learning the Greek Sign Language (ΕΝΓ) fingerspelling alphabet in minutes.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {steps.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'rgba(17, 24, 39, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant='caption' sx={{ color: '#FBBF24', fontWeight: 800 }}>
                  {item.step}
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 700, my: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* CTA Banner */}
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Typography variant='h4' sx={{ fontWeight: 800, mb: 1.5 }}>
            Ready to test your signing skills?
          </Typography>
          <Typography variant='body1' sx={{ color: '#CBD5E1', mb: 3, maxWidth: 500, mx: 'auto' }}>
            Jump right in and start practicing with the interactive 3D hand and real-time webcam feedback!
          </Typography>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            onClick={() => navigate('/learn')}
            sx={{ px: 4, py: 1.5, fontWeight: 800, borderRadius: 3 }}
          >
            Launch Practice Studio 🚀
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

export default HowTo
