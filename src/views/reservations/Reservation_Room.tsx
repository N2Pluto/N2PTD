import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const ReservationRoom = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData(), fetchDataRoomByDormID()])
    }
  }, [router.query.id])

  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
    setDormitoryBuilding(data)
  }

  const fetchDataRoomByDormID = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
    setDormitoryRoom(data)
    console.log('data:', data)
  }

  const handleReservation = id => {
    // Handle the reservation with the card ID
    console.log('Reservation ROOM :', id)
  }

  return (
    <div>
      <h1>Reservation</h1>
      <Typography>{dormitoryBuilding?.name}</Typography>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dormitoryRoom.map(room => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }} key={room.room_id}>
            <Card style={{ width: '16.66%', margin: '10px' }}>
              <CardContent>
                <Typography>
                  <Typography>{room.room_number}</Typography>
                  <Typography>Bed Capacity: {room.bed_capacity}</Typography>
                </Typography>
                <Link href={`/reservations/reservations_room/reservations_bed/${room.room_id}`}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}
                  >
                    <Button onClick={() => handleReservation(room.room_id)} variant='contained'>
                      Register
                    </Button>
                  </Box>
                </Link>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReservationRoom
