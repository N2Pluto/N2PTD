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

// Create a styled Box component with slide-up animation
const BackgroundBox = styled(Box)`
  animation: ${slideUp} 1s ease-out;,

`

// Create a styled Box component with slide-down animation
const TextBox = styled(Box)`
  animation: ${slideDown} 1s ease-out;
  animation-delay: 1s;
  animation-fill-mode: forwards;
  opacity: 0; /* Initially hidden */
  animation: ${slideDown} 1s ease-out 1s forwards;
`

// Create a styled Button component with hover effect
const StyledButton = styled(Button)`
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.2);
  }
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
      <TextBox sx={{ width: '100%', textAlign: 'center', marginTop: theme => theme.spacing(-100) }}>
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
            letterSpacing: '0.05em'
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
      </TextBox>
    </Box>
  )
}

LandingPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LandingPage
