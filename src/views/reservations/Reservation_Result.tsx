// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { userStore } from 'src/stores/userStore'
import { useRouter } from 'next/router'
import Button from '@mui/material/Button'
import Link from 'next/link'

interface DataType {
  stats: Text
  title: string
  color: ThemeColor
  icon: ReactElement
}

const ReservationResultCard = () => {
  const { user } = userStore()
  const router = useRouter()

  const handleReservation = () => {
    router.push(`/reservation`)
  }

  // Update the salesData array with the studentId
  const salesData: DataType[] = [
    {
      stats: user?.student_id,
      title: 'Student ID',
      color: 'success',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: user?.dorm_id,
      title: 'Dorm ID',
      color: 'warning',
      icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: user?.room_id,
      title: 'Room ID',
      color: 'info',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: user?.bed_id,
      title: 'Bed ID',
      color: 'info',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    }
  ]

  // Move renderStats below salesData declaration
  const renderStats = () => {
    return salesData.map((item: DataType, index: number) => (
      <Grid item xs={12} sm={3} key={index}>
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
        title='Reservation Result'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>

      <Box>
        <Button onClick={handleReservation}>
          <Typography>Go to Profile</Typography>
        </Button>
      </Box>
    </Card>
  )
}

export default ReservationResultCard
