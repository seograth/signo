import React from 'react'
import { Box, Container, Typography, Paper, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SchoolIcon from '@mui/icons-material/School'
import CodeIcon from '@mui/icons-material/Code'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const AboutUs: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Box sx={{ minHeight: '100%', py: { xs: 4, md: 6 } }}>
      <Container maxWidth='lg'>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant='h2' sx={{ fontWeight: 800, mb: 1.5 }}>
            {t('aboutUs.title')}
          </Typography>
          <Typography
            variant='body1'
            sx={{
              color: '#00B4D8',
              fontWeight: 700,
              fontSize: '1.2rem',
              mb: 2,
            }}
          >
            {t('aboutUs.tagline')}
          </Typography>
          <Typography variant='body1' sx={{ color: '#94A3B8', maxWidth: 700, mx: 'auto', lineHeight: 1.7 }}>
            {t('aboutUs.description')}
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(34, 38, 52, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <FavoriteIcon sx={{ fontSize: 40, color: '#FF6B6B', mb: 2 }} />
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 1.5 }}>
                {t('aboutUs.card1Title')}
              </Typography>
              <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                {t('aboutUs.card1Desc')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(34, 38, 52, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <SchoolIcon sx={{ fontSize: 40, color: '#FFB703', mb: 2 }} />
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 1.5 }}>
                {t('aboutUs.card2Title')}
              </Typography>
              <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                {t('aboutUs.card2Desc')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 4,
                background: 'rgba(34, 38, 52, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <CodeIcon sx={{ fontSize: 40, color: '#00B4D8', mb: 2 }} />
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 1.5 }}>
                {t('aboutUs.card3Title')}
              </Typography>
              <Typography variant='body2' sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
                {t('aboutUs.card3Desc')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            onClick={() => navigate('/learn')}
            sx={{ px: 4, py: 1.5, fontWeight: 800, borderRadius: 3 }}
          >
            {t('aboutUs.ctaBtn')}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default AboutUs

