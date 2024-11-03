import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function Learn() {
  const [selectedHand, setSelectedHand] = useState<string>('')
  const { t } = useTranslation()

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Container maxWidth='lg' sx={{ mt: '3rem' }}>
        <Grid container sx={{ display: 'flex', width: 1, height: 1 }} spacing={2}>
          <Grid
            size={{ xs: 12 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography variant='h4'>Learning is starting...</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Learn
