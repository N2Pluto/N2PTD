import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import supabase from 'src/libs/supabase'
import { userStore } from 'src/stores/userStore'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const ReservationBed = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const userStoreInstance = userStore()
  const { user, setUser } = userStoreInstance // Destructure user and setUser from userStoreInstance

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

  useEffect(() => {
    const fetchDataBedByRoomID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/bed/room/${router.query.id}`).then(res => res.json())
      setDormitoryRoom(data)
    }

    const fetchDataAndUpdateStatusBed = async () => {
      await fetchDataBedByRoomID() // Fetch the updated data
    }

    fetchDataAndUpdateStatusBed()
    const intervalId = setInterval(fetchDataAndUpdateStatusBed, 1000)

    return () => clearInterval(intervalId)
  }, [])

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
    <span>
      <h1>Select Bed</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dormitoryRoom.map((room, index) => (
          <Card key={index} style={{ width: '16.66%', margin: '10px' }}>
            <CardContent>
              <Typography>
                <Typography>Bed Number:{room.bed_number}</Typography>
                <Typography>Bed Status: {room.bed_status ? <CheckIcon /> : <CloseIcon />}</Typography>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
                <Button onClick={() => handleReservation(room.bed_id)} variant='contained'>
                  Select!
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </span>
  )
}

export default ReservationBed
