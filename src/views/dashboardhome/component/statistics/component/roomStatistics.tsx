// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import { useEffect, useState } from 'react'

const CardRoomStatistics = () => {
  const [room, setRoom] = useState([])

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/room', {
          method: 'GET'
        })
        const data = await response.json()
        setRoom(data)
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchUserdata()
  }, [])

  console.log('room',room)

  const roomFree = room.filter((r: any) => r.status == true).length
  const roomOccupied = room.filter((r: any) => r.status == false).length
  const roomTotal = room.length

  console.log('Count of roomFree:', roomFree)
  console.log('Count of roomOccupied:', roomOccupied)
  console.log('Count of roomTotal:', roomTotal)




  return (
    <Card
      sx={{
        border: 0,
        boxShadow: 0,
        color: 'common.white',
        backgroundColor: 'pink',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CardContent
        sx={{
          padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography
          variant='h5'
          sx={{ display: 'flex', marginBottom: 2, alignItems: 'center', color: 'common.white' }}
        >
          <BedroomParentIcon sx={{ fontSize: '5.5rem' }} />
        </Typography>

        <Typography
          variant='h6'
          sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
        >
          ROOM
        </Typography>
        <Typography variant='body1' sx={{ marginBottom: 3, color: 'common.white' }}>
        vacant : {roomFree}  | unavailable : {roomOccupied}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardRoomStatistics
