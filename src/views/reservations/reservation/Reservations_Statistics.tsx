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
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import DoorBackIcon from '@mui/icons-material/DoorBack';
import BedIcon from '@mui/icons-material/Bed';

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const ReservationsStatistics = () => {
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

  console.log('reservation:', reservation)

  const salesData: DataType[] = [
    {
      stats: user?.student_id?.toString(),
      title: 'Student ID',
      color: 'primary',
      icon: <PermIdentityIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Building?.name,
      title: 'Dormitory Name',
      color: 'error',
      icon: <CorporateFareIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Room?.room_number,
      title: 'Room Number',
      color: 'info',
      icon: <DoorBackIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Bed?.bed_number,
      title: 'Bed Number',
      color: 'primary',
      icon: <BedIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.status,
      title: 'Status',
      color: 'primary',
      icon: <BedIcon sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.round_id,
      title: 'Round ID',
      color: 'primary',
      icon: <BedIcon sx={{ fontSize: '1.75rem' }} />
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
      <CardContent>
        {reservation?.Dormitory_Building && reservation?.Dormitory_Room && reservation?.Dormitory_Bed ? (
          <Grid container spacing={2}>
            {renderStats()}
          </Grid>
        ) : (
          <Typography variant='h6'>No reservation has been made.</Typography>
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
