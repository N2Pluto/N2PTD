import Grid from '@mui/material/Grid'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports

import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import DoorBackIcon from '@mui/icons-material/DoorBack'
import BedIcon from '@mui/icons-material/Bed'
import HomeIcon from '@mui/icons-material/Home'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'

import { useEffect, useState } from 'react'
import { userStore } from 'src/stores/userStore'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import SuccessbarฺResult from './component'
import { sendDiscordMessage } from 'src/pages/api/discord/user'

const Allresult = () => {
  const { user } = userStore()
  const router = useRouter()
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

    // Call the function immediately
    fetchReservationData()

    // Then set up the interval to call it every 10 seconds
    const intervalId = setInterval(fetchReservationData, 3000)

    // Don't forget to clear the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [user])

  const discordHandle = async (id: string ,email:string, domname: string, roomnum: string ,bednum :string) => {
    await sendDiscordMessage(id, email, `Make a reservation\nDormitory Building : ${domname}  \nRoom Number : ${roomnum} \nBed Number : ${bednum}`
    )
  }

  const handledsummit = (id:string,email:string , domname:string , roomnum : string , bednum : string) => {
    discordHandle(id,email,domname,roomnum,bednum)
    router.push(`/reservation/`)
  }

  return (
    <>
      <SuccessbarฺResult />

      <Box >
        <Card>
          <Typography variant='h4' sx={{ pl: 6, pt: 3 , pb: 3 }}>
            Reservation Information
            </Typography>
        </Card>
      </Box>


      <Box  sx={{ pt: 3 }}>
        <Card>
          <Grid container spacing={6} sx={{ pl: 5, pr: 5, pt: 5, pb: 5 }}>

            <Grid item xs={12} md={6} lg={6}>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'primary.main' }}>
                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                  <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', color: 'common.white' }}>
                    <PermIdentityIcon sx={{ marginRight: 2.5 }} />
                    {user?.student_id}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', color: 'common.white', pl: 9 }}
                  >
                    Student ID
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                  <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', color: 'common.white' }}>
                    <CorporateFareIcon sx={{ marginRight: 2.5 }} />
                    {reservation?.Dormitory_Building?.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', color: 'common.white', pl: 9 }}
                  >
                    Dorm
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'error.main' }}>
                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                  <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', color: 'common.white' }}>
                    <DoorBackIcon sx={{ marginRight: 2.5 }} />
                    {reservation?.Dormitory_Room?.room_number}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', color: 'common.white', pl: 9 }}
                  >
                    Room Number
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'warning.main' }}>
                <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
                  <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', color: 'common.white' }}>
                    <BedIcon sx={{ marginRight: 2.5 }} />
                    {reservation?.Dormitory_Bed?.bed_number}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', alignItems: 'center', color: 'common.white', pl: 9 }}
                  >
                    Bed Number
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Box sx={{ pt: 3 }}>
        <Card
          sx={{
            position: 'relative',
            pl: 2,
            pr: 2,
            pt: 5,
            pb: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button onClick={() => handledsummit(user?.student_id ,user?.email, reservation?.Dormitory_Building.name ,reservation?.Dormitory_Room?.room_number ,reservation?.Dormitory_Bed?.bed_number)} variant='contained'>
            Go to Reservation
          </Button>
        </Card>
      </Box>
    </>
  )
}
export default Allresult
