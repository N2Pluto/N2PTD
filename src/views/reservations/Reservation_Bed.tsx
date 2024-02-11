import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const ReservationBed = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [dormitoryRoomByBed, setDormitoryRoomByBed] = useState([])

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
    console.log('data:', data)
  }

  const handleReservation = bednumber => {
    // Handle the reservation with the card ID
    console.log('Reservation Bed number :', bednumber)
  }

  console.log('dormitoryBed:', dormitoryBed)
  console.log('dormitoryRoom:', dormitoryRoom)

  return (
    <>
      <h1>Select Bed</h1>
      {/* <Typography>{dormitoryBed?.name}</Typography> */}

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dormitoryRoom.map(room => (
          <Card key={room.room_id} style={{ width: '16.66%', margin: '10px' }}>
            <CardContent>
              <Typography>
                <Typography>Bed Number:{room.bed_number}</Typography>
                <Typography>Bed Status: {room.bed_status}</Typography>
              </Typography>
              <Link href={`/`}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}>
                  <Button onClick={() => handleReservation(room.bed_number)} variant='contained'>
                    Select!
                  </Button>
                </Box>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default ReservationBed
