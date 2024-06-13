import { ReactElement, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { ThemeColor } from 'src/@core/layouts/types'
import { userStore } from 'src/stores/userStore'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import DoorBackIcon from '@mui/icons-material/DoorBack'
import BedIcon from '@mui/icons-material/Bed'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PaymentIcon from '@mui/icons-material/Payment'
import PersonIcon from '@mui/icons-material/Person'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const ReservationsStatistics = () => {
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await fetch(`/api/reservation/select?user_id=${user?.user_id}`)
        const { reservationData, userInfoData } = await response.json()
        setReservation(reservationData[0])
        setUserInfo(userInfoData[0])
      } catch (error) {
        console.error('Error fetching reservation data:', error)
      }
    }

    fetchReservationData()
  }, [user])

  const salesData: DataType[] = [
    {
      stats: userInfo ? `${userInfo.name} ${userInfo.lastname}` : 'N/A',
      title: 'Full Name',
      color: 'error', // Neutral information
      icon: <PersonIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: user?.student_id?.toString() || 'N/A',
      title: 'Student ID',
      color: 'info', // Neutral information
      icon: <PermIdentityIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Building?.name || 'N/A',
      title: 'Dormitory Name',
      color: 'secondary', // Positive context
      icon: <CorporateFareIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Room?.room_number.toString() || 'N/A',
      title: 'Room Number',
      color: 'grey', // Positive context
      icon: <DoorBackIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Bed?.bed_number.toString() || 'N/A',
      title: 'Bed Number',
      color: 'primary', // Positive context
      icon: <BedIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Reservation_System?.round_name || 'N/A',
      title: 'Round',
      color: 'warning', // Caution or attention needed
      icon: <CalendarTodayIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.status || 'N/A',
      title: 'Reservation Status',
      color: reservation?.status === 'Approve' ? 'success' : 'error', // Dynamic based on status
      icon: <AssignmentTurnedInIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.payment_status === 'SUCCESS' ? 'Success' : reservation?.payment_status || 'N/A',
      title: 'Payment Status',
      color: reservation?.payment_status === 'SUCCESS' ? 'success' : 'error', // Dynamic based on payment status
      icon: <PaymentIcon sx={{ fontSize: '1.75rem' }} />
    }
  ]

  const renderStats = () => {
    return salesData.map((item: DataType, index: number) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: theme => theme.palette[item.color].main
            }}
          >
            {item.icon}
          </Avatar>
          <Box>
            <Typography variant='caption' color='textSecondary'>
              {item.title}
            </Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardContent>
        {reservation ? (
          <Grid container spacing={3}>
            {renderStats()}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/delete_13843116.png'
              alt='No reservation'
              style={{ width: '150px', marginBottom: '16px' }}
            />
            <Typography variant='h6'>No reservation has been made.</Typography>
          </Box>
        )}
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
