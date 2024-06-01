// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/web';

const CardRoomStatistics = () => {
  const [room, setRoom] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/room', {
          method: 'GET'
        })
        const data = await response.json()
        setRoom(data)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchUserdata()
  }, [])

  const roomFree = room.filter((r: any) => r.status === true).length
  const roomOccupied = room.filter((r: any) => r.status === false).length
  const roomTotal = room.length

  const fadeIn = useSpring({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
  })

  return (
    <animated.div style={fadeIn}>
      <Card
        sx={{
          border: 0,
          boxShadow: 0,
          color: 'common.white',
          backgroundColor: 'pink',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
            <BedroomParentIcon sx={{ fontSize: '4.5rem' }} />
          </Typography>

          <Typography
            variant='h6'
            sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.white' }}
          >
            ROOM
          </Typography>
          <Typography variant='body1' sx={{ marginBottom: 3, color: 'common.white' }}>
            vacant: {roomFree} | unavailable: {roomOccupied}
          </Typography>
        </CardContent>
      </Card>
    </animated.div>
  )
}

export default CardRoomStatistics
