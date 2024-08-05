import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Grid,
  Box,
  Card,
  Typography,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  Backdrop,
  CircularProgress
} from '@mui/material'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { userStore } from 'src/stores/userStore'
import SuccessbarResult from './component'
import Confetti from 'react-confetti'
import sendLogsuser from 'src/pages/api/log/user/reservation/insert'

// Define keyframes for animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const fadeInDelayed = keyframes`
  0%, 95% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const StyledComponents = {
  ImageContainer: styled.div`
    animation: ${slideIn} 1s ease-in-out;
  `,
  Card: styled(Card)`
    animation: ${fadeIn} 1s ease-in-out;
    animation-delay: ${({ delay }) => delay}s;
    animation-fill-mode: both;
  `,
  ErrorTypography: styled(Typography)`
    animation: ${fadeInDelayed} 5s ease-in-out forwards;
  `,
  ErrorMessage: styled(Typography)`
    animation: ${fadeInDelayed} 5s ease-in-out forwards;
    margin-top: 2rem;
  `,
  CatImage: styled.img`
    animation: ${fadeInDelayed} 5s ease-in-out forwards;
  `,
  GoHomeButton: styled(Button)`
    animation: ${fadeInDelayed} 5s ease-in-out forwards;
  `
}

const AllResult = ({ open, handleClose }) => {
  const { user } = userStore()
  const router = useRouter()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true) // State for loading
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  const handleGoHome = () => {
    router.push('/reservation/building/')
  }

  const loguser = async () => {
    if (reservation) {
      const content = `Make a reservation Dormitory Building : ${reservation.Dormitory_Building.name} Room Number : ${reservation.Dormitory_Room.room_number} Bed Number : ${reservation.Dormitory_Bed.bed_number}`
      await sendLogsuser(user.student_id, user.email, content, 'Reservation')
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonVisible(true)
    }, 7000) // 7-second delay

    return () => clearTimeout(timer) // Cleanup the timer on component unmount
  }, [])

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        // Check for duplicate bed reservations without sending user_id
        const duplicateResponse = await fetch(`/api/reservation/deleteDuplicate`)
        const duplicateData = await duplicateResponse.json()
        if (duplicateData.error) {
          console.error('Error checking for duplicate bed reservations:', duplicateData.error)
        } else {
          console.log('Duplicate bed reservations checked successfully')
        }

        const response = await fetch(`/api/reservation/select?user_id=${user?.user_id}`)
        const data = await response.json()
        setReservation(data.reservationData[0] || null)
      } catch (error) {
        console.error('Error fetching reservation data:', error)
      }
    }

    fetchReservationData()
    const intervalId = setInterval(fetchReservationData, 3000)

    return () => clearInterval(intervalId)
  }, [user])

  useEffect(() => {
    // Force the loading screen to stay visible for 10 seconds
    const loadingTimer = setTimeout(() => {
      setLoading(false)
    }, 5000)

    return () => clearTimeout(loadingTimer)
  }, [])

  useEffect(() => {
    if (open) {
      const startConfettiTimer = setTimeout(() => {
        setShowConfetti(true)
        const stopConfettiTimer = setTimeout(() => {
          setShowConfetti(false)
        }, 7000) // Show confetti for 7 seconds

        return () => clearTimeout(stopConfettiTimer)
      }, 2500) // Delay confetti by 2.5 seconds

      return () => clearTimeout(startConfettiTimer)
    } else {
      setShowConfetti(false)
    }
  }, [open])

  const handleSummit = () => {
    loguser()
    router.push(`/reservation/reservation-info`)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen aria-labelledby='full-screen-dialog-title'>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {loading ? (
          <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color='inherit' />
          </Backdrop>
        ) : reservation ? (
          <Grid container spacing={3} sx={{ flex: 1, alignItems: 'center' }}>
            <>
              <Grid
                item
                xs={12}
                md={12}
                sm={12}
                sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
              >
                <Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    sx={{ display: 'flex', justifyContent: 'center', height: '100px' }}
                  >
                    <SuccessbarResult />
                  </Grid>
                  <StyledComponents.ImageContainer
                    style={{
                      overflow: 'hidden',
                      height: 'calc(100%)'
                    }}
                  >
                    <img
                      src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/bedimg/isometric-view-3d-rendering-city.png'
                      alt='Building Illustration'
                      style={{
                        width: '32%',
                        position: 'relative',
                        top: '-0px',
                        left: '450px'
                      }}
                    />
                  </StyledComponents.ImageContainer>
                </Grid>
                <Grid
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    maxHeight: 400,
                    position: 'absolute',
                    top: '60%',
                    left: '45%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  <StyledComponents.Card
                    sx={{
                      mb: 1,
                      boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)',
                      borderRadius: '10px',
                      transform: 'scale(0.75)'
                    }}
                    delay={1}
                  >
                    <CardContent>
                      <Grid container>
                        <Grid item xs={2}>
                          <img
                            src='https://img2.pic.in.th/pic/man_2922506.png'
                            alt='User Icon'
                            style={{ marginRight: '1rem', height: '40px', width: '40px' }}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <Typography
                            variant='h6'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            {user?.student_id}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            Student ID
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledComponents.Card>
                  <StyledComponents.Card
                    sx={{
                      mb: 1,
                      boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)',
                      borderRadius: '10px',
                      transform: 'scale(0.75)'
                    }}
                    delay={1.5}
                  >
                    <CardContent>
                      <Grid container>
                        <Grid item xs={2}>
                          <img
                            src='https://img2.pic.in.th/pic/office-building_4300059.png'
                            alt='Building Icon'
                            style={{ marginRight: '1rem', height: '40px', width: '40px' }}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <Typography
                            variant='h6'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            {reservation?.Dormitory_Building?.name}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            Building
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledComponents.Card>
                  <StyledComponents.Card
                    sx={{
                      mb: 1,
                      boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)',
                      borderRadius: '10px',
                      transform: 'scale(0.75)'
                    }}
                    delay={2}
                  >
                    <CardContent>
                      <Grid container>
                        <Grid item xs={2}>
                          <img
                            src='https://img2.pic.in.th/pic/bed_3680684.png'
                            alt='Room Icon'
                            style={{ marginRight: '1rem', height: '40px', width: '40px' }}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <Typography
                            variant='h6'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            {reservation?.Dormitory_Room?.room_number}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            Room Number
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledComponents.Card>
                  <StyledComponents.Card
                    sx={{
                      mb: 1,
                      boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)',
                      borderRadius: '10px',
                      transform: 'scale(0.75)'
                    }}
                    delay={2.5}
                  >
                    <CardContent>
                      <Grid container>
                        <Grid item xs={2}>
                          <img
                            src='https://img5.pic.in.th/file/secure-sv1/bed_2073061db0b589833e014b9.png'
                            alt='Bed Icon'
                            style={{ marginRight: '1rem', height: '40px', width: '40px' }}
                          />
                        </Grid>
                        <Grid item xs={10}>
                          <Typography
                            variant='h6'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            {reservation?.Dormitory_Bed?.bed_number}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                          >
                            Bed Number
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledComponents.Card>
                </Grid>
              </Grid>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div>
                  {isButtonVisible && (
                    <Button onClick={handleSummit} variant='contained'>
                      Go to Reservation Homepage
                    </Button>
                  )}
                </div>
              </Box>
            </>
          </Grid>
        ) : (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              textAlign: 'center'
            }}
          >
            <StyledComponents.CatImage
              src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/image-VytVWHXTH-transformed-removebg-preview.png'
              alt='Error Icon'
              style={{ marginBottom: '20px' }} // Adjust the margin as needed
            />
            <Box sx={{ pb: 5 }}>
              <StyledComponents.ErrorTypography variant='h4' color='error'>
                Sorry, you couldn't book the dormitory in time.
              </StyledComponents.ErrorTypography>
            </Box>

            <StyledComponents.GoHomeButton variant='contained' color='primary' onClick={handleGoHome}>
              Return to Reservation
            </StyledComponents.GoHomeButton>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AllResult
