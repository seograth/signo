import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useTranslation } from 'react-i18next'
import WelcomeImage from '../../assets/images/welcome.svg'
import { useNavigate } from 'react-router-dom'

function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Container maxWidth='lg' sx={{ mt: '3rem' }}>
        <Grid container sx={{ display: 'flex', width: 1 }} spacing={5}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img src={WelcomeImage} alt='welcome-to-signifi' width={'90%'} />
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Grid size={{ xs: 12 }}>
              <Typography variant='h1'>{t('home.title')}</Typography>
              <Typography variant='h3'>{t('home.subtitle')}</Typography>
            </Grid>

            <Grid
              size={{ xs: 12 }}
              sx={{
                margin: '1.5rem 0',
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  textAlign: 'justify',
                }}
              >
                {t('home.entryText')}
              </Typography>
            </Grid>

            <Grid
              size={{ xs: 12 }}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                variant='outlined'
                onClick={() => {
                  navigate('/learn')
                }}
              >
                {t('home.startNow')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
