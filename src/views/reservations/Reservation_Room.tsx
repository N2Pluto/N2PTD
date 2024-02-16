import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardSupport from '../cards/CardSupport'

const ReservationRoomTest = () => {
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

  console.log('dormitoryBuilding:', dormitoryBuilding)
  console.log('dormitoryRoom:', dormitoryRoom)

  return (
    <>
      <h1>Reservation</h1>
      <Typography>{dormitoryBuilding?.name}</Typography>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dormitoryRoom.map(room => (
          <Card key={room.room_id} style={{ width: '22.33%', margin: '10px' }}>
            <CardSupport>
              <Typography>
                <Typography>{room.room_number}</Typography>
                <Typography>Bed Capacity: {room.bed_capacity}</Typography>
              </Typography>

              <Link href={`/reservations/reservations_room/reservations_bed/${room.room_id}`} passHref>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
                  <Button onClick={() => handleReservation(room.room_id)} variant='contained' size='small'>
                    Register
                  </Button>
                </Box>
              </Link>
            </CardSupport>
          </Card>
        ))}
      </div>
    </>
  )
}

export default ReservationRoomTest
