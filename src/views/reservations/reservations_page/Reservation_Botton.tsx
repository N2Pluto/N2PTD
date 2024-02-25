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
import { CardHeader } from '@mui/material'
import { CartPlus } from 'mdi-material-ui'

const ReservationBotton = () => {
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

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

  const handleReservation = () => {
    router.push(`/reservation/building`)
  }
  const cancelReservation = async () => {
    const confirmed = window.confirm('Do you want to cancel your reservation??')
    if (confirmed) {
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
          router.reload() // Reload the page
        }
      } catch (error) {
        console.error('Error deleting reservation:', error)
      }
    }
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardMedia sx={{ height: '12.625rem' }} image='/images/cards/background-user.png' />
      <Avatar
        alt='Robert Meyer'
        src='/images/avatars/1.png'
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
          <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
            {/* <Typography variant='h6'>{user.student_id}</Typography> */}
            <Typography variant='caption'>email : {user?.email}</Typography>
          </Box>
          <Box sx={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            <Button
              variant='contained'
              onClick={() =>
                reservation?.Dormitory_Building && reservation?.Dormitory_Room && reservation?.Dormitory_Bed
                  ? cancelReservation()
                  : handleReservation()
              }
            >
              {reservation?.Dormitory_Building && reservation?.Dormitory_Room && reservation?.Dormitory_Bed
                ? 'Cancel Reservation'
                : 'Reservation'}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}
        ></Box>
      </CardContent>
    </Card>
  )
}

export default ReservationBotton
