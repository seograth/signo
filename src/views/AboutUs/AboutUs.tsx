import React from 'react'
import { Box, Container, Typography, Paper, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SchoolIcon from '@mui/icons-material/School'
import CodeIcon from '@mui/icons-material/Code'
import { useNavigate } from 'react-router-dom'

export const AboutUs: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100%', py: { xs: 4, md: 6 } }}>
      <Container maxWidth='lg'>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant='h2' sx={{ fontWeight: 800, mb: 1.5 }}>
            About SigniFi
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: '#FBBF24',
              fontWeight: 700,
              fontSize: '1.2rem',
              mb: 2,
            }}
          >
            Connect Beyond Words • Ελληνική Νοηματική Γλώσσα (ΕΝΓ)
          </Typography>
          <Typography variant='body1' sx={{ color: '#94A3B8', maxWidth: 700, mx: 'auto', lineHeight: 1.7 }}>
            SigniFi was founded to break communication barriers between the hearing and Deaf & Hard of Hearing communities in Greece. By transforming traditional static finger charts into interactive, AI-guided games, learning Greek Sign Language becomes intuitive, engaging, and enjoyable for everyone.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(17, 24, 39, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <FavoriteIcon sx={{ fontSize: 40, color: '#EC4899', mb: 2 }} />
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 1.5 }}>
                Social Inclusion
              </Typography>
              <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                Fostering empathy and practical signing skills for families, educators, healthcare professionals, and anyone passionate about inclusive communication.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(17, 24, 39, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <SchoolIcon sx={{ fontSize: 40, color: '#FBBF24', mb: 2 }} />
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 1.5 }}>
                Greek Sign Language (ΕΝΓ)
              </Typography>
              <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                Greek Sign Language possesses a rich, unique linguistic structure. Fingerspelling (δακτυλικό αλφάβητο) is the essential gateway for spelling names, acronyms, and specialized terms.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(17, 24, 39, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <CodeIcon sx={{ fontSize: 40, color: '#6366F1', mb: 2 }} />
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 1.5 }}>
                Cutting-Edge Web AI
              </Typography>
              <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                Powered by MediaPipe 3D hand tracking, WebGL Three.js skeletal rendering, and client-side neural network inference for 100% private, instant feedback.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            onClick={() => navigate('/learn')}
            sx={{ px: 4, py: 1.5, fontWeight: 800, borderRadius: 3 }}
          >
            Start Learning Greek Fingerspelling
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default AboutUs
