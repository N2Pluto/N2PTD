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
import CustomizedMenus from './component/ButtonSpeedDial'
import NightlifeIcon from '@mui/icons-material/Nightlife'
import CloseIcon from '@mui/icons-material/Close'
import BedtimeIcon from '@mui/icons-material/Bedtime'
import TempleHinduIcon from '@mui/icons-material/TempleHindu'

const Profile = () => {
  const { user } = userStore()
  console.log(user)

  const [loading, setLoading] = useState(true) // Add this line

  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true) // Add this line
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
      } finally {
        setLoading(false) // Add this line
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  if (loading) {
    return <div>Loading...</div> // Or your custom loading spinner
  }

  return (
    <Grid item xs={12} sm={6} md={12}>
      <Box sx={{ pb: 3 }}>
        <Card sx={{ position: 'relative' }}>
          <CardMedia sx={{ height: '12.625rem' }} image='/images/cards/background-user.png' />
          <Avatar
            alt='Robert Meyer'
            src={profileData?.userInfoData.image}
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
                  {profileData?.userInfoData.name} {'  '} {profileData?.userInfoData.lastname}
                </Typography>
                <Typography variant='caption'>{profileData?.userData.student_id}</Typography>
              </Box>
              {/* <Link href='/profile/account-settings' passHref>
                <Button variant='contained'>Edit</Button>
              </Link> */}
              <CustomizedMenus />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid item xs={12} md={6} lg={6} sx={{ pt: 3 }}>
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
                    {profileData?.userData.student_id}
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
                    {profileData?.userData.email}
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
                    {profileData?.userInfoData.school}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <AccountBalanceIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Department :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.userInfoData.department}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <SchoolIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Major :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.userInfoData.major}
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
                    {profileData?.userInfoData.religion}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={6} sx={{ pt: 3 }}>
        <Card sx={{ position: 'relative' }}>
          <CardContent>
            <Box>
              <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                Social
              </Typography>

              {profileData?.userInfoData.facebook && (
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
                      {profileData?.userInfoData.facebook}
                    </Typography>
                  </Box>
                </Box>
              )}

              {profileData?.userInfoData.instagram && (
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
                    <Link href={`https://www.instagram.com/${profileData?.userInfoData.instagram}`} passHref>
                      <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                        {profileData?.userInfoData.instagram}
                      </Typography>
                    </Link>
                  </Box>
                </Box>
              )}

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
                    {profileData?.userInfoData.phone}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={6} sx={{ pt: 3 }}>
        <Card sx={{ position: 'relative' }}>
          <CardContent>
            <Box>
              <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                Life Style
              </Typography>

              <Box sx={{ display: 'flex', pt: 3 }}>
                <Box sx={{ pr: 3 }}>
                  <NightlifeIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Activity :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.userReqData.activity}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 3 }}>
                <Box sx={{ pr: 3 }}>
                  <CloseIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Red Flag :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.userReqData.filter_redflag}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', pt: 2 }}>
                <Box sx={{ pr: 3 }}>
                  <BedtimeIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Sleep :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.userReqData.sleep}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={6} sx={{ pt: 3 }}>
        <Card sx={{ position: 'relative' }}>
          <CardContent>
            <Box>
              <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                Requirement
              </Typography>

              <Box sx={{ display: 'flex', pt: 3 }}>
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
                    {profileData?.userReqData.filter_school}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', pt: 3 }}>
                <Box sx={{ pr: 3 }}>
                  <SchoolIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Major :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.userReqData.filter_major}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', pt: 3 }}>
                <Box sx={{ pr: 3 }}>
                  <TempleHinduIcon />
                </Box>
                <Box sx={{ pr: 2 }}>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Religion :
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    {profileData?.userReqData.filter_religion}
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
