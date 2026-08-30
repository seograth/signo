import React from 'react'
import { Box, Container, Typography, Paper, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import VideocamIcon from '@mui/icons-material/Videocam'
import PanToolIcon from '@mui/icons-material/PanTool'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const HowTo: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const steps = [
    {
      icon: <VideocamIcon sx={{ fontSize: 36, color: '#00B4D8' }} />,
      step: t('howTo.step1Number'),
      title: t('howTo.step1Title'),
      desc: t('howTo.step1Desc'),
    },
    {
      icon: <PanToolIcon sx={{ fontSize: 36, color: '#FFB703' }} />,
      step: t('howTo.step2Number'),
      title: t('howTo.step2Title'),
      desc: t('howTo.step2Desc'),
    },
    {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#06D6A0' }} />,
      step: t('howTo.step3Number'),
      title: t('howTo.step3Title'),
      desc: t('howTo.step3Desc'),
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 36, color: '#FF6B6B' }} />,
      step: t('howTo.step4Number'),
      title: t('howTo.step4Title'),
      desc: t('howTo.step4Desc'),
    },
  ]

  return (
    <Box sx={{ minHeight: '100%', py: { xs: 4, md: 6 } }}>
      <Container maxWidth='lg'>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant='h2' sx={{ fontWeight: 800, mb: 1.5 }}>
            {t('howTo.title')}
          </Typography>
          <Typography variant='body1' sx={{ color: '#94A3B8', maxWidth: 600, mx: 'auto' }}>
            {t('howTo.subtitle')}
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
                  background: 'rgba(34, 38, 52, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                <Typography variant='caption' sx={{ color: '#FFB703', fontWeight: 800 }}>
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
            p: { xs: 2.5, md: 3.5 },
            mb: { xs: 6, md: 8 },
            maxWidth: 640,
            mx: 'auto',
            borderRadius: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.2) 0%, rgba(255, 183, 3, 0.15) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Typography variant='h5' sx={{ fontWeight: 800, mb: 1 }}>
            {t('howTo.ctaTitle')}
          </Typography>
          <Typography variant='body2' sx={{ color: '#CBD5E1', mb: 2, maxWidth: 460, mx: 'auto' }}>
            {t('howTo.ctaSubtitle')}
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size='medium'
            onClick={() => navigate('/learn')}
            sx={{ px: 3, py: 1, fontWeight: 800, borderRadius: 3 }}
          >
            {t('howTo.ctaBtn')}
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}

export default HowTo

