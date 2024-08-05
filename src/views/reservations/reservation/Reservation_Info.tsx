import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { userStore } from 'src/stores/userStore'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Link from 'next/link'
import Backdrop from '@mui/material/Backdrop'

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='white'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  )
}

const ReservationInfo = () => {
  const { user } = userStore()

  const [profileData, setProfileData] = useState(null)
  const [isEligible, setIsEligible] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [roundData, setRoundData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingPercentage, setLoadingPercentage] = useState(0)

  const handleNavigate = async () => {
    let isMounted = true

    const intervalId = setInterval(async () => {
      try {
        // Extract the first two characters of the student_id
        const userYear = profileData?.userData?.student_id.toString().slice(0, 2)
        const response = await fetch('/api/reservation/checkReservationQualification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // Send the extracted userYear
          body: JSON.stringify({ userYear })
        })
        const data = await response.json()

        if (isMounted) {
          setIsEligible(data.isEligible)

          if (data.isEligible) {
            clearInterval(intervalId)
            setLoading(false)
            router.push('/reservation/reservation-info')
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error checking reservation qualification:', error)
        }
      }
    }, 1000) // Fetch every second

    setTimeout(() => {
      if (isMounted && !isEligible) {
        setShowDialog(true)
        setLoading(false)
      }
    }, 3000) // Show dialog after 3 seconds if not eligible

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchRoundProfile = async () => {
      try {
        const response = await fetch('/api/reservation/fetchRoundProfile', {
          method: 'GET'
        })
        const data = await response.json()
        if (isMounted) {
          setRoundData(data)
        }
        console.log('Round Info', data)
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching round profile:', error)
        }
      }
    }
    fetchRoundProfile()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id })
        })
        const data = await response.json()
        if (isMounted) {
          setProfileData(data)
        }

        // Check round status
        const roundResponse = await fetch('/api/reservation/checkRoundStatus', {
          method: 'GET'
        })
        const roundData = await roundResponse.json()

        if (roundResponse.status === 500) {
          console.error('Error checking round status:', roundData.error)
        } else if (roundResponse.status === 404) {
          console.error('No active round found')
        } else {
          console.log('Round status checked successfully')
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user profile:', error)
        }
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }

    return () => {
      isMounted = false
    }
  }, [user])

  useEffect(() => {
    if (profileData) {
      handleNavigate()
    }
  }, [profileData])

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingPercentage(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setLoading(false)
            if (!isEligible) {
              setShowDialog(true)
            }
            return 100
          }
          return prev + 1
        })
      }, 30) // Update every 30 milliseconds

      return () => clearInterval(interval)
    }
  }, [loading, isEligible])

  return (
    <>
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: 1301, display: 'flex', flexDirection: 'column' }}>
        <LinearProgressWithLabel value={loadingPercentage} />
        <Typography variant='h6' sx={{ marginTop: '10px', color: 'white' }}>
          Verifying eligibility...
        </Typography>
      </Backdrop>
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 3,
            padding: 2,
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9'
          }
        }}
      >
        <DialogTitle id='alert-dialog-title' sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          You Are Not Eligible to Reserve a Room in This Round
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ fontSize: '1rem' }}>
            Please verify your qualifications again. If you have any further questions, please contact the staff.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link href='/dashboard'>
            <Button onClick={() => setShowDialog(false)} variant='contained' color='primary'>
              Close
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReservationInfo
