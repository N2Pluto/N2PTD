import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { Dialog, DialogActions, DialogContent } from '@mui/material'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { userStore } from 'src/stores/userStore'
import SuccessbarResult from './component'
import { sendDiscordMessage } from 'src/pages/api/discord/user'
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

const scaleUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
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
  `
}

const AllResult = ({ open, handleClose }) => {
  const { user } = userStore()
  const router = useRouter()
  const [reservation, setReservation] = useState(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const loguser = async () => {
    const content = `Make a reservation Dormitory Building : ${reservation?.Dormitory_Building?.name} Room Number : ${reservation?.Dormitory_Room?.room_number} Bed Number : ${reservation?.Dormitory_Bed?.bed_number}`
    await sendLogsuser(user?.student_id, user?.email, content, 'Reservation')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonVisible(true);
    }, 7000); // 5-second delay

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await fetch(`/api/reservation/select?user_id=${user?.user_id}`)
        const { reservationData, userInfoData } = await response.json()
        setReservation(reservationData[0])
      } catch (error) {
        console.error('Error fetching reservation data:', error)
      }
    }

    fetchReservationData()
    const intervalId = setInterval(fetchReservationData, 3000)

    return () => clearInterval(intervalId)
  }, [user])

  useEffect(() => {
    if (open) {
      const startConfettiTimer = setTimeout(() => {
        setShowConfetti(true)
        const stopConfettiTimer = setTimeout(() => {
          setShowConfetti(false)
        }, 7000) // Show confetti for 5 seconds

        return () => clearTimeout(stopConfettiTimer)
      }, 2500) // Delay confetti by 2.5 seconds

      return () => clearTimeout(startConfettiTimer)
    } else {
      setShowConfetti(false)
    }
  }, [open])

  const handleSummit = () => {
    loguser()
    router.push(`/reservation/`)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen aria-labelledby='full-screen-dialog-title'>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Grid container spacing={3} sx={{ flex: 1, alignItems: 'center' }}>
          <Grid item xs={12} md={12} sm={12} s sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Grid>
              <Grid item xs={12} md={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', height: '100px' }}>
                <SuccessbarResult />
              </Grid>{' '}
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
                <Button
                  onClick={() => {
                    handleSummit();
                  }}
                  variant='contained'
                >
                  Go to Reservation HomePAGE
                </Button>
              )}
            </div>
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default AllResult
