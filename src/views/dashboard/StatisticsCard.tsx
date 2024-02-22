// ** React Imports
import { ReactElement, useEffect, useState } from 'react'

// ** MUI Imports
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
// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { userStore } from 'src/stores/userStore'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

const StatisticsCard = () => {
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const { data } = await fetch(`/api/reservation/select?user_id=${user?.user_id}`).then(res => res.json())
        setReservation(data[0])
      } catch (error) {
        console.error('Error fetching reservation data:', error)
      }
    }

    fetchReservationData()
  }, [user])

  const cancelReservation = async () => {
    try {
      const response = await fetch(`/api/reservation/deleteReservation?user_id=${user?.user_id}`, {
        method: 'DELETE'
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error deleting reservation:', error)
      } else {
        // Handle success, e.g., show a message to the user
        console.log('Reservation deleted successfully:', data)
      }
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  const salesData: DataType[] = [
    {
      stats: user?.student_id || 'N/A',
      title: 'Student ID',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.user_id || 'N/A',
      title: 'Reservation ID',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },

    {
      stats: reservation?.dorm_id || 'N/A',
      title: 'Dorm ID',
      color: 'secondary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Building?.name || 'N/A',
      title: 'Dormitory Name',
      color: 'error',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.room_id || 'N/A',
      title: 'Room ID',
      color: 'warning',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Room?.room_number || 'N/A',
      title: 'Room Number',
      color: 'info',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.bed_id || 'N/A',
      title: 'Bed ID',
      color: 'success',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: reservation?.Dormitory_Bed?.bed_number || 'N/A',
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
                ยกเลิกการจอง
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
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
