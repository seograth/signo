import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TranslateIcon from '@mui/icons-material/Translate'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'  
import audioEngine from '../../services/audioEngine'
import ChameleonIcon from '../../components/icons/ChameleonIcon'

export const Header: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const currentLanguage = i18n.language && i18n.language.startsWith('el') ? 'el' : 'en'

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'el' ? 'en' : 'el'
    audioEngine.playPop()
    i18n.changeLanguage(nextLang)
  }

  const pages = [
    { label: t('nav.home'), redirect: '/' },
    { label: t('nav.howTo'), redirect: '/how-to' },
    { label: t('nav.aboutUs'), redirect: '/about-us' },
  ]

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <AppBar position='sticky'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 70 }}>
          {/* Desktop Logo */}
          <Box
            onClick={() => {
              audioEngine.playPop()
              navigate('/')
            }}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.2,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <ChameleonIcon
              sx={{
                fontSize: 36,
                color: '#00B4D8',
                filter: 'drop-shadow(0 4px 12px rgba(0, 180, 216, 0.45))',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.08)',
                },
              }}
            />
            <Typography
              variant='h5'
              noWrap
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sign<span style={{ color: '#00B4D8', WebkitTextFillColor: '#00B4D8' }}>o</span>
            </Typography>
          </Box>

          {/* Mobile Navigation controls */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <IconButton
              size='large'
              aria-label='navigation menu'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              sx={{ color: '#E2E8F0' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  background: 'rgba(26, 29, 40, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  mt: 1,
                  minWidth: 200,
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.redirect}
                  onClick={() => {
                    audioEngine.playPop()
                    navigate(page.redirect)
                    handleCloseNavMenu()
                  }}
                  sx={{
                    color: location.pathname === page.redirect ? '#00B4D8' : '#E2E8F0',
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                  }}
                >
                  <Typography>{page.label}</Typography>
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  audioEngine.playPop()
                  navigate('/learn')
                  handleCloseNavMenu()
                }}
                sx={{
                  color: '#00B4D8',
                  fontWeight: 800,
                  px: 3,
                  py: 1.2,
                }}
              >
                <Typography sx={{ fontWeight: 800 }}>{t('nav.startNow')} 🚀</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  toggleLanguage()
                  handleCloseNavMenu()
                }}
                sx={{
                  color: '#FFB703',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <TranslateIcon sx={{ fontSize: 20, mr: 1, color: '#FFB703' }} />
                <Typography sx={{ fontWeight: 700 }}>
                  {currentLanguage === 'el' ? 'English (EN)' : 'Ελληνικά (ΕΛ)'}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box
            onClick={() => {
              audioEngine.playPop()
              navigate('/')
            }}
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
          >
            <ChameleonIcon
              sx={{
                fontSize: 28,
                color: '#00B4D8',
                filter: 'drop-shadow(0 2px 8px rgba(0, 180, 216, 0.4))',
              }}
            />
            <Typography
              variant='h6'
              noWrap
              sx={{
                fontWeight: 900,
                color: '#FFFFFF',
              }}
            >
              Sign<span style={{ color: '#00B4D8' }}>o</span>
            </Typography>
          </Box>

          {/* Desktop Navigation Links & Language Toggle */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.2 }}>
            {pages.map((page) => {
              const isActive = location.pathname === page.redirect
              return (
                <Button
                  key={page.redirect}
                  onClick={() => {
                    audioEngine.playPop()
                    navigate(page.redirect)
                  }}
                  sx={{
                    px: 2.2,
                    py: 0.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    color: isActive ? '#00B4D8' : '#94A3B8',
                    background: isActive ? 'rgba(0, 180, 216, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 180, 216, 0.3)' : '1px solid transparent',
                    '&:hover': {
                      color: '#FFFFFF',
                      background: 'rgba(255, 255, 255, 0.06)',
                    },
                  }}
                >
                  {page.label}
                </Button>
              )
            })}

            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={() => {
                audioEngine.playPop()
                navigate('/learn')
              }}
              sx={{ ml: 1, px: 2.5, py: 0.8, fontWeight: 800, borderRadius: 3 }}
            >
              {t('nav.startNow')}
            </Button>

            {/* Language Toggle Control Pill */}
            <Box
              onClick={toggleLanguage}
              sx={{
                ml: 1.5,
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(34, 38, 52, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 4,
                p: '3px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#00B4D8',
                  boxShadow: '0 0 12px rgba(0, 180, 216, 0.3)',
                },
              }}
              title={t('common.toggleLanguage')}
            >
              <Box
                sx={{
                  px: 1.2,
                  py: 0.4,
                  borderRadius: 3,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: currentLanguage === 'en' ? '#FFFFFF' : '#94A3B8',
                  background: currentLanguage === 'en' ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <span>🇬🇧</span> EN
              </Box>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.4,
                  borderRadius: 3,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: currentLanguage === 'el' ? '#FFFFFF' : '#94A3B8',
                  background: currentLanguage === 'el' ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : 'transparent',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <span>🇬🇷</span> ΕΛ
              </Box>
            </Box>
          </Box>

          {/* Mobile Language Toggle Button (Visible next to logo on mobile) */}
          <Box
            onClick={toggleLanguage}
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 0.5,
              background: 'rgba(34, 38, 52, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 4,
              px: 1.4,
              py: 0.5,
              cursor: 'pointer',
            }}
          >
            <Typography variant='caption' sx={{ fontWeight: 800, color: '#00B4D8' }}>
              {currentLanguage === 'el' ? '🇬🇷 ΕΛ' : '🇬🇧 EN'}
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header

