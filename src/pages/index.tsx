// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Emotion Imports
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

// Define keyframes for slide-up animation
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

// Define keyframes for slide-down animation
const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

// Define keyframes for premium background animation
const backgroundAnimation = keyframes`
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
`

// Define keyframes for premium text animation
const textAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  50% {
    opacity: 0.5;
    transform: translateY(0);
    text-shadow: 0px 6px 6px rgba(0, 0, 0, 0.35);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`

// Create a styled Box component with slide-up and background animation

// animation: ${slideUp} 1s ease-out, ${backgroundAnimation} 5s infinite alternate ease-in-out
const BackgroundBox = styled(Box)`
  animation: ${slideUp} 1s ease-out, ${backgroundAnimation} 5s 1s infinite;
`

// Create a styled Box component with slide-down and text animation
const ModernTextBox = styled(Box)`
  animation: ${slideDown} 1s ease-out 1s forwards, ${textAnimation} 2s ease-out 1s forwards;
  opacity: 0; /* Initially hidden */
  color: #2e2e2e; // Modern text color
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); // Adding a shadow for modern effect
`

const LuxuriousTextBox = styled(ModernTextBox)`
  animation: ${slideDown} 1.5s cubic-bezier(0.87, 0, 0.13, 1) 1s forwards; // Slower and smoother
  text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.25); // Deeper shadow for a more luxurious feel
`

// Create a styled Button component with hover effect
const StyledButton = styled(Button)`
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.2);
  }
`

const GradientText = styled(Typography)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const LandingPage = () => {
  return (
    <Box
      className='content-center'
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme => theme.spacing(3),
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      <BackgroundBox
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url('https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/Walailak_DormitoryReservationSystem%20(5).svg?t=2024-07-24T11%3A07%3A56.394Z') no-repeat center center`,
          backgroundSize: 'cover'
        }}
      />
      <LuxuriousTextBox sx={{ width: '100%', textAlign: 'center', marginTop: theme => theme.spacing(-100) }}>
        <Typography
          variant='h2'
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          Dormitory Reservation
        </Typography>
        <Typography
          variant='h6'
          sx={{
            mb: 4,
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.05em',
            color: '#757575'
          }}
        >
          System case Study: Walailak University
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
          <Link href='/pages/login' passHref>
            <StyledButton variant='contained' color='primary'>
              Login
            </StyledButton>
          </Link>
          <Link href='/pages/register' passHref>
            <StyledButton variant='contained' color='secondary'>
              Register
            </StyledButton>
          </Link>
        </Box>
      </LuxuriousTextBox>
    </Box>
  )
}

LandingPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LandingPage
