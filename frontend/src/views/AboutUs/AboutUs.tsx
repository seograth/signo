import { Box, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth='lg' sx={{ mt: '3rem' }}>
        <Grid container sx={{ justifyContent: 'center', width: 1 }} spacing={2}>
          <Typography variant='body1'>{t('aboutUs.title')}</Typography>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
