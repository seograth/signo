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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { useNavigate, useLocation } from 'react-router-dom'
import audioEngine from '../../services/audioEngine'

const pages = [
  { label: 'Home', redirect: '/' },
  { label: 'How It Works', redirect: '/how-to' },
  { label: 'About Us', redirect: '/about-us' },
]

export const Header: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

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
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                color: '#0F172A',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 22 }} />
            </Box>
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
              Signi<span style={{ color: '#FBBF24', WebkitTextFillColor: '#FBBF24' }}>Fi</span>
            </Typography>
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  mt: 1,
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.label}
                  onClick={() => {
                    audioEngine.playPop()
                    navigate(page.redirect)
                    handleCloseNavMenu()
                  }}
                  sx={{
                    color: location.pathname === page.redirect ? '#FBBF24' : '#E2E8F0',
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
                  color: '#FBBF24',
                  fontWeight: 800,
                  px: 3,
                  py: 1.2,
                }}
              >
                <Typography sx={{ fontWeight: 800 }}>Start Practice 🚀</Typography>
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
            <Typography
              variant='h6'
              noWrap
              sx={{
                fontWeight: 900,
                color: '#FFFFFF',
              }}
            >
              Signi<span style={{ color: '#FBBF24' }}>Fi</span>
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {pages.map((page) => {
              const isActive = location.pathname === page.redirect
              return (
                <Button
                  key={page.label}
                  onClick={() => {
                    audioEngine.playPop()
                    navigate(page.redirect)
                  }}
                  sx={{
                    px: 2.2,
                    py: 0.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    color: isActive ? '#FBBF24' : '#94A3B8',
                    background: isActive ? 'rgba(251, 191, 36, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid transparent',
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
              color='secondary'
              size='small'
              onClick={() => {
                audioEngine.playPop()
                navigate('/learn')
              }}
              sx={{ ml: 1.5, px: 2.5, py: 0.8, fontWeight: 800, borderRadius: 3 }}
            >
              Start Practice
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
