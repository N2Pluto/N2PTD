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
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id })
        })
        const data = await response.json()
        setProfileData(data)
        console.log(data)

        // Check round status
        const roundResponse = await fetch('/api/reservation/checkRoundStatus', {
          method: 'GET'
        })
        const roundData = await roundResponse.json()

        if (roundResponse.status === 500) {
          console.error('Error checking round status:', roundData.error)
        } else if (roundResponse.status === 404) {
          console.error('No active round found')
        } else {
          console.log('Round status checked successfully')
        }
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6} sx={{ pt: 3 }}>
          <Grid item xs={12} md={12} lg={12} sx={{ pt: 3 }}>
            <Card sx={{ position: 'relative' }}>
              <CardContent>
                <Box>
                  <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    About
                  </Typography>

                  <Box sx={{ display: 'flex', pt: 3 }}>
                    <Box sx={{ pr: 3 }}>
                      <img
                        src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/id-card_4481114.png'
                        alt='ID Card Icon'
                        style={{ width: '1.5rem' }}
                      />
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
                      <img
                        src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/envelope_15047426.png'
                        alt='ID Card Icon'
                        style={{ width: '1.5rem' }}
                      />
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
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/school_2602414.png'
                        alt='School Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
                      <img
                        src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/book_5310733.png'
                        alt='ID Card Icon'
                        style={{ width: '1.5rem' }}
                      />
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
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/graduate_401672.png'
                        alt='Major Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/religion_9311967.png'
                        alt='Religion Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
          <Grid item xs={12} md={12} lg={12} sx={{ pt: 3 }}>
            <Card sx={{ position: 'relative' }}>
              <CardContent>
                <Box>
                  <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Social
                  </Typography>

                  {profileData?.userInfoData.facebook && (
                    <Box sx={{ display: 'flex', pt: 3 }}>
                      <Box sx={{ pr: 3 }}>
                        <img
                          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/facebook_2504903.png'
                          alt='ID Card Icon'
                          style={{ width: '24px', height: '24px' }}
                        />
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
                        <img
                          src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/instagram_174855.png'
                          alt='ID Card Icon'
                          style={{ width: '24px', height: '24px' }}
                        />
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
                      <img
                        src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/mobile_4807370.png'
                        alt='ID Card Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
        </Grid>

        <Grid item xs={12} md={6} lg={6} sx={{ pt: 3 }}>
          <Grid item xs={12} md={12} lg={12} sx={{ pt: 3 }}>
            <Card sx={{ position: 'relative' }}>
              <CardContent>
                <Box>
                  <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Life Style
                  </Typography>

                  <Box sx={{ display: 'flex', pt: 3 }}>
                    <Box sx={{ pr: 3 }}>
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/time-management_2027497.png'
                        alt='Activity Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/flag_1452046.png'
                        alt='Redflag Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/bed-time_12178656.png'
                        alt='Sleep Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
          <Grid item xs={12} md={12} lg={12} sx={{ pt: 3 }}>
            <Card sx={{ position: 'relative', pb: '1px' }}>
              <CardContent>
                <Box>
                  <Typography variant='h6' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                    Requirement
                  </Typography>

                  <Box sx={{ display: 'flex', pt: 3 }}>
                    <Box sx={{ pr: 3 }}>
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/school_2602414.png'
                        alt='School Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/graduate_401672.png'
                        alt='Major Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/religion_9311967.png'
                        alt='Religion Icon'
                        style={{ width: '24px', height: '24px' }}
                      />
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
                <Divider sx={{ pb: '22px' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Profile
