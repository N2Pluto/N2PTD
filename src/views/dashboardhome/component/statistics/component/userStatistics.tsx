// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'

const CardUserStatistics = () => {
  const [user, setUser] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchUserdata = async () => {
      try {
        const response = await fetch('/api/statistics/user', {
          method: 'GET'
        })
        const data = await response.json()
        if (isMounted) {
          setUser(data)
          setIsLoaded(true)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching user data:', error)
        }
      }
    }
    fetchUserdata()

    return () => {
      isMounted = false
    }
  }, [])

  const userCount = user.filter((u: any) => u.role === 'user').length

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
              src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/group_921347.png'
              sx={{ width: 100, height: 100, marginBottom: 2 }}
            />
            <Typography
              variant='h6'
              sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'text.primary' }}
            >
              User
            </Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
              All users: {userCount}
            </Typography>
          </CardContent>
        </Card>
      </animated.div>
    </animated.div>
  )
}

export default CardUserStatistics
