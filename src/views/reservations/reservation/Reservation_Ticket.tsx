// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { styled, keyframes } from '@mui/system'
import router from 'next/router'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Animations
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const HoverableTypography = styled(Typography)`
  transition: transform 0.3s, color 0.3s, text-shadow 0.3s;
  &:hover {
    transform: scale(1.1);
    color: #fe6b8b;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }
  text-align: left; // Align text to the left
`

const HoverableButton = styled(Button)`
  margin-top: 20px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`

const HoverableBackButton = styled(IconButton)`
  position: absolute;
  top: 16px;
  left: 16px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.1);
  }
`

// ** Custom Styling
const ContentBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'left',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center'
  }
}))

const TextBox = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center', // Center items
  marginLeft: theme.spacing(20),
  marginTop: theme.spacing(-20),
  paddingRight: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    paddingRight: 0,
    paddingBottom: theme.spacing(3),
    marginLeft: 0,
    textAlign: 'center' // Center text on mobile
  }
}))

const ImageBox = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  height: '30vh', // Adjust the height as needed to fit the images
  width: '30vw', // Adjust the width as needed to fit the images
  marginTop: '-15vh' // Move the ImageBox up
}))

const Image = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  position: 'absolute',
  opacity: 0,
  animation: `${fadeIn} 5s ease-in-out infinite`
}))

const ReservationsTicket = () => {
  const handleReservation = () => {
    router.push(`/reservation/building`)
  }

  const handleBack = () => {
    router.push(`/dashboard`)
  }

  return (
    <ContentBox>
      <HoverableBackButton onClick={handleBack}>
        <ArrowBackIcon />
      </HoverableBackButton>
      <TextBox>
        <img
          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/bedimg/Walailak_University_Logo.svg.png'
          alt='Walailak University Logo'
          style={{
            zIndex: 4,
            width: '10vw',
            height: '20vh',
            animationDelay: '0.2s',
            marginBottom: '1rem'
          }}
        />
        <HoverableTypography
          variant='h6'
          sx={{
            mb: 0,
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.05em',
            color: '#757575'
          }}
        >
          System case Study: Walailak University
        </HoverableTypography>
        <HoverableTypography
          variant='h3'
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          Dormitory Reservation
        </HoverableTypography>

        <HoverableTypography
          variant='body1'
          sx={{
            mb: 4,
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.05em',
            color: '#757575'
          }}
        >
          Secure Your Accommodation <span style={{ color: '#9c27b0' }}>Today</span>
        </HoverableTypography>

        <HoverableTypography
          variant='body1'
          sx={{
            mb: 4,
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            letterSpacing: '0.05em',
            color: '#757575'
          }}
        >
          Experience the ease and Convenience of University Dormitory.
        </HoverableTypography>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <HoverableButton
            variant='contained'
            color='secondary'
            sx={{
              width: 'fit-content',
              px: 4, // Adjust padding to increase width
              py: 1.5 // Adjust padding to increase height if needed
            }}
            onClick={() => router.push('/dashboard')}
          >
            Homepage{' '}
          </HoverableButton>
          <HoverableButton
            variant='contained'
            color='primary'
            sx={{
              width: 'fit-content',
              px: 4, // Adjust padding to increase width
              py: 1.5, // Adjust padding to increase height if needed
              ml: 2 // Add margin-left to space out the buttons
            }}
            onClick={handleReservation}
          >
            Reserve Now!
          </HoverableButton>
        </Box>
      </TextBox>

      <ImageBox>
        <Image
          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/bedimg/Gray%20Purple%20Isometric%20Elements%20&%20Mockups%205G%20Technology%20Technology%20Presentation%20(2).svg'
          alt='Demystifying 5G'
          style={{ zIndex: 3, marginTop: '0vh', animationDelay: '0.2s' }}
        />
        <Image
          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/bedimg/Gray%20Purple%20Isometric%20Elements%20&%20Mockups%205G%20Technology%20Technology%20Presentation%20(3).svg'
          alt='Demystifying 5G'
          style={{ zIndex: 2, marginTop: '15vh', animationDelay: '0.8s' }}
        />
        <Image
          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/bedimg/Gray%20Purple%20Isometric%20Elements%20&%20Mockups%205G%20Technology%20Technology%20Presentation%20(4).svg'
          alt='Demystifying 5G'
          style={{ zIndex: 1, marginTop: '30vh', animationDelay: '1.4s' }}
        />
      </ImageBox>
    </ContentBox>
  )
}

export default ReservationsTicket
