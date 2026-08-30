import { Box } from '@mui/material'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Home from '../Home'
import NotFound from '../NotFound'
import Header from '../Header'
import AboutUs from '../AboutUs'
import Learn from '../Learn'
import HowTo from '../HowTo'
import AlertsProvider from '../../widgets/Alerts/AlertsProvider'
import AlertMessage from '../../widgets/Alerts/AlertMessage'

export default function App() {
  const location = useLocation()
  const isStudioFullscreen = location.pathname === '/learn'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#0B0F19',
      }}
    >
      <AlertsProvider>
        {/* Only show standard website header on non-studio pages */}
        {!isStudioFullscreen && <Header />}
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            height: isStudioFullscreen ? '100vh' : 'calc(100vh - 70px)',
            width: '100vw',
            overflow: isStudioFullscreen ? 'hidden' : 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/learn' element={<Learn />} />
            <Route path='/how-to' element={<HowTo />} />
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
