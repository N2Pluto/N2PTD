import { ReactElement, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CartPlus from 'mdi-material-ui/CartPlus'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import Snackbar from '@mui/material/Snackbar' // เพิ่ม Snackbar
import MuiAlert from '@mui/material/Alert' // เพิ่ม Alert
import { ThemeColor } from 'src/@core/layouts/types'
import { userStore } from 'src/stores/userStore'


interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const ReservationsStatistics = () => {
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
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
          setSnackbarMessage('Booking successfully deleted') // ตั้งค่าข้อความใน Snackbar
          setSnackbarOpen(true) // เปิด Snackbar
          setReservation(null) // Reset reservation data
        }
      } catch (error) {
        console.error('Error deleting reservation:', error)
      }
    }
  }

  const salesData: DataType[] = [
    {
      stats: user?.student_id ,
      title: 'Student ID',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.user_id,
      title: 'Reservation ID',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },

    {
      stats: reservation?.dorm_id,
      title: 'Dorm ID',
      color: 'secondary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Building?.name,
      title: 'Dormitory Name',
      color: 'error',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.room_id,
      title: 'Room ID',
      color: 'warning',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Room?.room_number,
      title: 'Room Number',
      color: 'info',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.bed_id,
      title: 'Bed ID',
      color: 'success',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Bed?.bed_number,
      title: 'Bed Number',
      color: 'grey',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    }
  ]

  // Move renderStats below salesData declaration
  const renderStats = () => {
    return salesData.map((item: DataType, index: number) => (
      <Grid item xs={12} sm={0} key={index}>

        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardHeader
        title={`Reservation Information for User ${user?.email}`}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              <Button onClick={cancelReservation}>
                <CartPlus fontSize='small' sx={{ marginRight: 2 }} />
                Cancel reservation
              </Button>
            </Box>{' '}
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent>
        <Grid container spacing={2}>
          {renderStats()}
        </Grid>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert elevation={6} variant='filled' onClose={() => setSnackbarOpen(false)} severity='success'>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

    </Card>
  )
}

export default ReservationsStatistics
