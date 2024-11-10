import { useTranslation } from 'react-i18next'
import { Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useTheme } from '@mui/material/styles'

import './notFound.css'

function NotFound() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <section className='notFound-container'>
      <Container maxWidth='lg'>
        <Grid container sx={{ width: 1, height: 1 }}>
          <Grid
            size={{ xs: 12 }}
            sx={{
              width: 1,
              height: 1,
              color: theme.palette.primary.main,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant='h2' textAlign='center' sx={{ mb: '1rem' }}>
              {t('notFound.title')}
            </Typography>
            <Typography variant='h6' textAlign='center'>
              {t('notFound.subtitle')}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </section>
  )
}

export default NotFound
