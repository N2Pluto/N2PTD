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

const StyledImageContainer = styled.div`
  animation: ${slideIn} 1s ease-in-out;
`

const StyledCard = styled(Card)`
  animation: ${fadeIn} 1s ease-in-out;
  animation-delay: ${({ delay }) => delay}s;
  animation-fill-mode: both;
`

const AllResult = ({ open, handleClose }) => {
  const { user } = userStore()
  const router = useRouter()
  const [reservation, setReservation] = useState(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(false)

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
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

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

  const discordHandle = async (id, email, domname, roomnum, bednum) => {
    await sendDiscordMessage(
      id,
      email,
      `Make a reservation\nDormitory Building : ${domname}  \nRoom Number : ${roomnum} \nBed Number : ${bednum}`
    )
  }

  const handleSummit = (id, email, domname, roomnum, bednum) => {
    discordHandle(id, email, domname, roomnum, bednum)
    router.push(`/reservation/`)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullScreen aria-labelledby='full-screen-dialog-title'>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <SuccessbarResult style={{ transform: 'scale(0.7)' }} />

        <Grid container spacing={3} sx={{ flex: 1, alignItems: 'center' }}>
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <StyledImageContainer
              style={{
                overflow: 'hidden',
                height: 'calc(40% - 20px)'
              }}
            >
              <img
                src='https://img2.pic.in.th/pic/anime-flat-building-illustration.png'
                alt='Building Illustration'
                style={{
                  width: '35%',
                  height: '10%',
                  position: 'relative',
                  top: '-90px',
                  left: '285px'
                }}
              />
            </StyledImageContainer>
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                position: 'absolute',
                top: '55%',
                left: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <StyledCard sx={{ mb: 5, boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)', borderRadius: '10px' }} delay={1}>
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
              </StyledCard>

              <StyledCard sx={{ mb: 5, boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)', borderRadius: '10px' }} delay={1.5}>
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
              </StyledCard>

              <StyledCard sx={{ mb: 5, boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)', borderRadius: '10px' }} delay={2}>
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
              </StyledCard>

              <StyledCard sx={{ mb: 5, boxShadow: '0 8px 8px 0 rgba(0, 0, 0, 0.6)', borderRadius: '10px' }} delay={2.5}>
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
              </StyledCard>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() =>
              handleSummit(
                user?.student_id,
                user?.email,
                reservation?.Dormitory_Building?.name,
                reservation?.Dormitory_Room?.room_number,
                reservation?.Dormitory_Bed?.bed_number
              )
            }
            variant='contained'
          >
            Go to Reservation
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default AllResult
