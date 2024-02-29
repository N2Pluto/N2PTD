// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AvatarGroup from '@mui/material/AvatarGroup'
import { userStore } from 'src/stores/userStore'
import { useEffect, useState } from 'react'
import { Divider, Grid } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SchoolIcon from '@mui/icons-material/School'
import SynagogueIcon from '@mui/icons-material/Synagogue'
import FeaturedVideoIcon from '@mui/icons-material/FeaturedVideo'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import Link from 'next/link'

const Profile = () => {
  const { user } = userStore()
  console.log(user)

  const [profileData, setProfileData] = useState(null)

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
    <Grid item xs={12} sm={6} md={12}>
      <Box sx={{ pb: 3 }}>
        <Card sx={{ position: 'relative' }}>
          <CardMedia sx={{ height: '12.625rem' }} image='/images/cards/background-user.png' />
          <Avatar
            alt='Robert Meyer'
            src='/images/avatars/1.png'
            sx={{
              width: 140,
              height: 140,
              left: '1.313rem',
              top: '6.28125rem',
              position: 'absolute',
              border: theme => `0.25rem solid ${theme.palette.common.white}`
            }}
          />
          <CardContent>
            <Box
              sx={{
                mt: 5.75,
                mb: 1.75,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ mr: 2, mt: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>
                  {profileData?.data.name} {'  '} {profileData?.data.lastname}
                </Typography>
                <Typography variant='caption'>{profileData?.data.student_id}</Typography>
              </Box>
              <Link href='/profile/account-settings'>
              <Button variant='contained'>Edit</Button>
              </Link>

            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid item xs={12} md={6} lg={4} sx={{pb:3}}>
        <Card sx={{ position: 'relative' }}>
          <CardContent>
            <Box>
              <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                About
              </Typography>

              <Box sx={{ display: 'flex', pt: 3 }}>
                <Box sx={{ pr: 3 }}>
                  <FeaturedVideoIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Student id :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.data.student_id}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <LocationOnIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Region :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.data.region}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <EmailIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Email :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.data.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <AccountBalanceIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    course :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.data.course}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <SchoolIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    School :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.data.school}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <SynagogueIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Religion :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.data.religion}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ position: 'relative' }}>
          <CardContent>
            <Box>
              <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                Social
              </Typography>

              <Box sx={{ display: 'flex', pt: 3 }}>
                <Box sx={{ pr: 3 }}>
                  <FacebookIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Facebook :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {/* {profileData?.data.student_id} */}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <InstagramIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Instagram :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {/* {profileData?.data.region} */}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <LocalPhoneIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Phone :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {/* {profileData?.data.email} */}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Profile
