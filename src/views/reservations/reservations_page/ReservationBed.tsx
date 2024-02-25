import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import { userStore } from 'src/stores/userStore'
import Grid, { GridProps } from '@mui/material/Grid'
import Tab from '@mui/material/Tab'

import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import TabContext from '@mui/lab/TabContext'

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const ReservationBedviwe = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const userStoreInstance = userStore()
  const { user, setUser } = userStoreInstance

  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData(), fetchDataBedByRoomID()])
    }
  }, [router.query.id])

  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/bed/${router.query.id}`).then(res => res.json())
    setDormitoryBed(data)
  }

  const fetchDataBedByRoomID = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/bed/room/${router.query.id}`).then(res => res.json())
    setDormitoryRoom(data)
  }

  // ReservationBed Component
  const handleReservation = async (bed_id: string) => {
    console.log('Reservation Bed ID:', bed_id)
    setUser({ ...userStoreInstance.user, bed_id })

    console.log('user:', userStoreInstance.user)

    try {
      if (!user) {
        console.error('User data is missing.')

        return
      }

      const checkResponse = await fetch(`/api/reservation/checkReservation?user_id=${user.user_id}`)
      const { hasReservation } = await checkResponse.json()

      if (hasReservation) {
        router.push('/reservation')
        alert('You have already made a reservation.')

        return
      }

      const checkBedResponse = await fetch(`/api/reservation/checkRepeat?bed_id=${bed_id}`)
      const { isReserved } = await checkBedResponse.json()

      if (isReserved) {
        router.push('/reservation')
        alert('This bed is already reserved.')

        return
      }

      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.user_id,
          dorm_id: user.dorm_id,
          room_id: user.room_id,
          bed_id: bed_id
        })
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error inserting data into Reservation table:', error.message)
      } else {
        console.log('Data inserted successfully:', data)
        router.push(`/reservation/result/${user.user_id}`)
      }
    } catch (error) {
      console.error('Error inserting data into Reservation table:', error.message)
    }
  }

  console.log('dormitoryRoom:', dormitoryRoom)

  return (
    <>
      <Grid pb={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ marginBottom: 2 }}>
              Select Bed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='card navigation example'>
            {dormitoryRoom.map((room, index) => (
              <Tab key={index} value={room.bed_id.toString()} label={`Bed ${room.bed_number}`} />
            ))}
          </TabList>
          <CardContent>
            {dormitoryRoom.map((room, index) => (
              <TabPanel key={index} value={room.bed_id.toString()} sx={{ p: 0 }}>
                <Typography variant='h6' sx={{ marginBottom: 2 }}>
                  Bed Number: {room.bed_number}
                </Typography>
                <Typography variant='body2' sx={{ marginBottom: 4 }}>
                  Bed Status: {room.bed_status}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
                  <Button onClick={() => handleReservation(room.bed_id)} variant='contained'>
                    Select!
                  </Button>
                </Box>
              </TabPanel>
            ))}
          </CardContent>
        </TabContext>
      </Card>
    </>
  )
}

export default ReservationBedviwe
