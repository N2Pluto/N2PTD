import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import router from 'next/router'
import { sendDiscordMessage } from 'src/pages/api/discord/admin'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import ReservationForm from './reservationForm'

const handleClick = async () => {
  router.push('/admin/reservationSystem/')
}

const ReservationControl = () => {
  const router = useRouter()

  return (
    <>
      <Card>
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Booking Period
          </Typography>
          <Typography variant='body2'>Please click here to initiate the creation of a new booking period.</Typography>
        </CardContent>

        <ReservationForm />
      </Card>
    </>
  )
}

export default ReservationControl
