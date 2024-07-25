// ** MUI Imports
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { useSpring, animated } from '@react-spring/web'

const CardBuildingStatistics = () => {
  const [doom, setDoom] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/building', {
          method: 'GET'
        })
        const data = await response.json()
        setDoom(data)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error fetching building data:', error)
      }
    }
    fetchUserdata()
  }, [])

  const doomM = doom.filter((b: any) => b.type_gender === 'male').length
  const doomF = doom.filter((b: any) => b.type_gender === 'female').length

  const fadeIn = useSpring({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
    from: { opacity: 0, transform: 'translateY(20px)' }
  })

  const [hoverStyle, setHoverStyle] = useSpring(() => ({
    transform: 'scale(1)',
    config: { tension: 300, friction: 10 }
  }))

  return (
    <animated.div style={fadeIn}>
      <animated.div
        style={hoverStyle}
        onMouseEnter={() => setHoverStyle({ transform: 'scale(1.05)' })}
        onMouseLeave={() => setHoverStyle({ transform: 'scale(1)' })}
      >
        <Card
          sx={{
            border: 0,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            color: 'text.primary',
            backgroundColor: 'common.white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 2,
            padding: 3,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Avatar
              src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/hotel_11292871.png'
              sx={{ width: 100, height: 100, marginBottom: 2, borderRadius: 2 }}
            />
            <Typography
              variant='h6'
              sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'text.primary' }}
            >
              Building
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
              Male: {doomM} | Female: {doomF}
            </Typography>
          </CardContent>
        </Card>
      </animated.div>
    </animated.div>
  )
}

export default CardBuildingStatistics
