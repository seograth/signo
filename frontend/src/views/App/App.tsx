import { Box } from '@mui/material'
import { Routes, Route, Outlet } from 'react-router-dom'
import Home from '../Home'
import NotFound from '../NotFound'
import Header from '../Header'
import { useTheme } from '@mui/material/styles'
import AlertsProvider from '../../widgets/Alerts/AlertsProvider'
import AlertMessage from '../../widgets/Alerts/AlertMessage'
import AboutUs from '../AboutUs'
import Learn from '../Learn'

export default function App() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: theme.palette.primary.main,
      }}
    >
      <AlertsProvider>
        <Header />
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            minHeight: 'calc(100vh - 72px)',
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/learn' element={<Learn />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Box>
        <Outlet />
        <AlertMessage />
      </AlertsProvider>
    </Box>
  )
}
