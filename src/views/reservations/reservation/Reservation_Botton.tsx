// ** MUI Imports
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
import Grid, { GridProps } from '@mui/material/Grid'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import HomeIcon from '@mui/icons-material/Home'
import Link from 'next/link'
import SuccessฺฺBar from './component'
import { sendDiscordMessage } from 'src/pages/api/discord/user'

const ReservationBotton = () => {
  const [open, setOpen] = useState(false)
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [profileData, setProfileData] = useState(null)

  const discordHandle = async (id: string, email: string) => {
    await sendDiscordMessage(id, email, 'Cancel reservation')
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id }) // ส่ง user_id ไปยัง API
        })
        const data = await response.json()
        setProfileData(data) // เซ็ตข้อมูลผู้ใช้ที่ได้รับจาก API
        console.log(data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const { data } = await fetch(`/api/reservation/select?user_id=${user?.user_id}`).then(res => res.json())
        setReservation(data[0])
      } catch (error) {
        console.error('Error fetching reservation data:', error)
        console.log('asd')
      }
    }

    fetchReservationData()
  }, [user])

  console.log('ตรงนี้:', user)

  console.log('reservation:', reservation)

  const handleReservation = () => {
    router.push(`/reservation/building`)
  }
  const cancelReservation = async () => {
    try {
      const response = await fetch(`/api/reservation/deleteReservation?user_id=${user?.user_id}`, {
        method: 'DELETE'
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error deleting reservation:', error)
      } else {
        console.log('Reservation deleted successfully:', data)
        setSnackbarMessage('Booking successfully deleted')
        setSnackbarOpen(true)
        setReservation(null)
        discordHandle(user.student_id, user.email)
        router.reload() // Reload the page

      }
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  return (
    <>
      <SuccessฺฺBar />

      <Card sx={{ position: 'relative' }}>
        <CardMedia sx={{ height: '12.625rem' }} image='/images/cards/background-user.png' />
        <Avatar
          alt='Robert Meyer'
          src={profileData?.userInfoData.image}
          sx={{
            width: 75,
            height: 75,
            left: '1.313rem',
            top: '10.28125rem',
            position: 'absolute',
            border: theme => `0.25rem solid ${theme.palette.common.white}`
          }}
        />
        <CardContent>
          <Box
            sx={{
              mt: 5.75,
              mb: 8.75,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {' '}
            <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption' sx={{ pl: 3 }}>
                <>
                  {user?.student_id}
                  <br />
                  {profileData?.userInfoData.name} {profileData?.userInfoData.lastname}
                </>
              </Typography>
            </Box>
            <Box sx={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <Button
                variant='contained'
                onClick={() =>
                  reservation?.Dormitory_Building && reservation?.Dormitory_Room && reservation?.Dormitory_Bed
                    ? handleClickOpen()
                    : handleReservation()
                }
              >
                {reservation?.Dormitory_Building && reservation?.Dormitory_Room && reservation?.Dormitory_Bed
                  ? 'Cancel Reservation'
                  : 'Reservation'}
              </Button>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
              >
                <DialogTitle id='alert-dialog-title'>{'Cancel Reservation'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    Do you want to cancel your reservation?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Disagree</Button>
                  <Button onClick={cancelReservation} autoFocus>
                    Agree
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>

          <Box
            sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}
          ></Box>
        </CardContent>
        <> </>
      </Card>
    </>
  )
}

export default ReservationBotton
