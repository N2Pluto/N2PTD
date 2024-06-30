// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// ** Icons Imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'

import { useEffect, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { userStore } from 'src/stores/userStore'
import { Divider } from '@mui/material'



const CardUserProfile = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const { user } = userStore()

  const fadeIn = useSpring({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
  })

  useEffect(() => {
    setIsLoaded(true)
  }, [])


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id }) // ส่ง user_id ไปยัง API
        })
        const data = await response.json()
        setProfileData(data) // เซ็ตข้อมูลผู้ใช้ที่ได้รับจาก API
        console.log(data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])


  return (
    <animated.div style={fadeIn}>
      <Card
        sx={{
          border: 0,
          boxShadow: 0,
          color: 'common.white',

        }}
      >
        <Box sx={{ position: 'relative', height: 220 }}>
          <img src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/w/Publie/backiee-202851-landscape.jpg' alt='Cover' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <Avatar
            src={profileData?.userInfoData.image}
            sx={{
              width: 100,
              height: 100,
              position: 'absolute',
              bottom: -50,
              left: 20,
              border: '3px solid white'
            }}
          />
        </Box>
        <CardContent
          sx={{
            padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginTop: theme => theme.spacing(4),
          }}
        >
          <Typography variant='h5' sx={{ color: 'text.primary', marginBottom: 1 ,pt:6  }}>
          {profileData?.userInfoData.name} {profileData?.userInfoData.lastname}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant='body2' sx={{ color: 'text.primary',  pl:2 }}>
              {user?.student_id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 ,pt:3 }}>
            <Typography variant='body1' sx={{ color: 'text.primary', pl:2 }}>
            {profileData?.userInfoData.school}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant='body2' sx={{ color: 'text.primary' , pl:2}}>
            {profileData?.userInfoData.major}
            </Typography>
          </Box>
          <Divider/>
        </CardContent>
      </Card>
    </animated.div>
  )
}

export default CardUserProfile
