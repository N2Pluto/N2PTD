import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useEffect, useState, useCallback } from 'react'
import Grid, { GridProps } from '@mui/material/Grid'
import { CardActions, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { userStore } from 'src/stores/userStore'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import * as React from 'react'
import SuccessฺฺBarBuilding from './component'
import FilterDrawer from './BuildingFilterDialog'
import Skeleton from '@mui/material/Skeleton'
import LinearProgress from '@mui/material/LinearProgress'
import { keyframes, styled } from '@mui/system'

const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  }
}))

const AnimatedCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  animation: `${slideIn} 0.5s ease-in-out`,
  transform: 'scale(1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)', // Added transform: scale(1.05) on hover
    boxShadow: '0 0 20px rgba(0,0,0,0.3)'
  }
}))

const MinimalLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main
  }
}))

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const ReservationBuilding = () => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const [countBedPerRoom, setCountBedPerRoom] = useState([])
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [buildingFilter, setBuildingFilter] = useState<string>('')
  const [bathroomFilter, setBathroomFilter] = useState<string>('')
  const [roommateFilter, setRoommateFilter] = useState<string>('')
  const [bedFilter, setBedFilter] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<number | ''>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingBedInfo, setIsLoadingBedInfo] = useState<boolean>(true)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({})

  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance
  const { user } = userStore()

  const [profileData, setProfileData] = useState(null)

  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

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

        // เปลี่ยนไปใช้ data ที่ได้จากการ fetch โดยตรง
        console.log('gender', data.userInfoData.gender)

        if (data.userInfoData.gender === 'male') {
          console.log('setGenderFilter', data.userInfoData.gender)
          setGenderFilter('male')
        }
        if (data.userInfoData.gender === 'female') {
          console.log('setGenderFilter', data.userInfoData.gender)
          setGenderFilter('female')
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  const handleReservation = (dorm_id: string) => {
    if (dorm_id) {
      setUser({ ...userStoreInstance.user, dorm_id }) // เปลี่ยน เป็นเก็บ ใน useState
      router.push(`/reservation/room/${dorm_id}`)
    } else {
      console.error('Invalid dorm_id:', dorm_id)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true) // Set loading to true before fetching data
        const response = await fetch('/api/building/fetch_building')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const { data } = await response.json()
        console.log('data:', data)
        setDormitoryBuilding(data)
      } catch (error) {
        if (error instanceof TypeError) {
          console.error('Network error or resource not found:', error)
        } else {
          console.error('Error fetching dormitory building data:', error)
        }
      } finally {
        setIsLoading(false) // Ensure loading is set to false even if there is an error
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingBedInfo(true) // Set loading to true before fetching data
        const response = await fetch('/api/building/countBedPerRoom')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const jsonResponse = await response.json()

        // Assuming the expected data is wrapped in a result property based on your server-side handler
        if (jsonResponse && jsonResponse.result) {
          setCountBedPerRoom(jsonResponse.result)
        } else {
          console.error('Unexpected response structure:', jsonResponse)
        }
      } catch (error) {
        if (error instanceof TypeError) {
          console.error('Network error or resource not found:', error)
        } else {
          console.error('Error fetching bed information data:', error)
        }
      } finally {
        setIsLoadingBedInfo(false) // Ensure loading is set to false even if there is an error
      }
    }

    fetchData()
  }, [])

  const handleDialogToggle = () => {
    setDialogOpen(!dialogOpen)
  }

  useEffect(() => {
    handleDialogToggle() // เรียกใช้งานเมื่อคอมโพเนนต์โหลดเสร็จ
  }, []) // ใส่เป็นอาร์เรย์ว่างเพื่อให้เรียกใช้เพียงครั้งเดียวหลังจากคอมโพเนนต์โหลดเสร็จ

  const getBackgroundImage = () => {
    if (genderFilter === 'male') {
      return 'null'
    } else if (genderFilter === 'female') {
      return 'null  '
    }

    return ''
  }

  return (
    <>
      <SuccessฺฺBarBuilding />
      <Grid pb={4}>
        <Card>
          <CardContent>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <AnimatedButton variant='contained' onClick={handleDialogToggle}>
                Filter Building
              </AnimatedButton>
            </Box>
            <FilterDrawer
              open={dialogOpen}
              onClose={handleDialogToggle}
              disableScrollLock={true}
              filters={{
                buildingFilter,
                setBuildingFilter,
                roommateFilter,
                setRoommateFilter,
                bathroomFilter,
                setBathroomFilter,
                bedFilter,
                setBedFilter,
                priceFilter,
                setPriceFilter
              }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid container spacing={4}>
        {isLoading
          ? // Display skeletons when data is loading
            Array.from(new Array(8)).map((_, index) => (
              <Grid key={index} item xs={12} sm={6} md={3} pb={5}>
                <Card>
                  <CardContent>
                    <Skeleton variant='rectangular' width='100%' height={118} />
                    <Skeleton width='60%' />
                    <Skeleton />
                    <Skeleton width='80%' />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : (() => {
              const filteredDormitories = dormitoryBuilding
                .filter(dorm => genderFilter === '' || dorm.type_gender === genderFilter)
                .filter(dorm => buildingFilter === '' || dorm.type_building === buildingFilter)
                .filter(dorm => roommateFilter === '' || dorm.type_roommate === roommateFilter)
                .filter(dorm => bathroomFilter === '' || dorm.type_bathroom === bathroomFilter)
                .filter(dorm => bedFilter === '' || dorm.type_bedtype === bedFilter)
                .filter(dorm => priceFilter === '' || dorm.price === priceFilter)

              if (filteredDormitories.length === 0) {
                return (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/folder_12478062.png'
                            alt='No Rooms Found'
                            style={{ maxWidth: '100px', marginBottom: '20px' }} // Adjust the image size and spacing
                          />
                          <Typography variant='body1' component='div' textAlign='center'>
                            The filter you have selected did not match any Building. Please select a different filter to
                            find the Building you desire.
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              }

              return filteredDormitories.map(dorm => (
                <Grid key={dorm.dorm_id} item xs={12} sm={6} md={3} pb={5}>
                  <AnimatedCard
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)', // Added transform: scale(1.05) on hover
                        boxShadow: '0 0 20px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Grid container spacing={6}>
                      <StyledGrid item md={12} xs={12}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img width={'100%'} height={'100%'} alt='dom img' src={dorm.images_url} />
                        </CardContent>
                      </StyledGrid>
                      <Grid item xs={12} md={12} sx={{}}>
                        <CardContent
                          sx={{
                            position: 'relative',
                            marginLeft: '10px',
                            padding: '16px',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              right: 0,
                              left: 0, // Adjusted to 0 to start from the very left
                              top: 50,
                              bottom: 0, // Adjusted to 0 to extend to the very bottom
                              opacity: 0.1,
                              width: '100%', // Ensure the width covers the entire area
                              height: '100%', // Ensure the height covers the entire area
                              backgroundImage: getBackgroundImage(),
                              backgroundSize: 'cover', // Changed to cover to ensure the image fully covers the CardContent
                              backgroundPosition: 'center', // Center the image to ensure the focus is in the middle
                              backgroundRepeat: 'no-repeat'
                            }
                          }}
                        >
                          <Typography
                            variant='h6'
                            sx={{
                              marginTop: '-32px',
                              marginBottom: '16px',
                              fontWeight: 700,
                              fontStyle: 'normal',
                              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' // เปลี่ยนฟอนต์ที่นี่
                            }}
                          >
                            {dorm.name}
                          </Typography>

                          <Typography sx={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.95rem' }}>
                            Gender :{' '}
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                              {dorm.type_gender}
                            </Box>
                          </Typography>
                          <Typography sx={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.95rem' }}>
                            Include :{' '}
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                              {dorm.type_building}
                            </Box>
                          </Typography>
                          <Typography sx={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.95rem' }}>
                            Bathroom :{' '}
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                              {dorm.type_bathroom}
                            </Box>
                          </Typography>
                          <Typography sx={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.95rem' }}>
                            Bed Type :{' '}
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                              {dorm.type_bedtype}
                            </Box>
                          </Typography>
                          <Typography sx={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.95rem' }}>
                            Roommate :{' '}
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                              {dorm.type_roommate}
                            </Box>
                          </Typography>
                          <Typography sx={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.95rem' }}>
                            Room Total :{' '}
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                              {dorm.room_total}
                            </Box>
                          </Typography>
                          <Typography sx={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.95rem' }}>
                            Price :{' '}
                            <Box component='span' sx={{ fontWeight: 'bold' }}>
                              {dorm.price} / Person / Term.
                            </Box>
                          </Typography>
                          {countBedPerRoom
                            .filter(bedInfo => bedInfo.dorm_id === dorm.dorm_id) // Filter to match the current dorm_id
                            .map(bedInfo => (
                              <Box key={bedInfo.dorm_id} sx={{ width: '100%', mb: 2 }}>
                                <Box display='flex' justifyContent='flex-end' mb={0.5}>
                                  <Typography variant='body2' color='textSecondary'>
                                    {bedInfo.reservedBeds} / {bedInfo.totalBeds} Beds Reserved
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center'>
                                  <Box width='100%' mr={1}>
                                    <MinimalLinearProgress
                                      variant='determinate'
                                      value={(bedInfo.reservedBeds / bedInfo.totalBeds) * 100}
                                    />
                                  </Box>
                                  <Box minWidth={35}>
                                    <Typography variant='body2' color='textSecondary'>
                                      {`${Math.round((bedInfo.reservedBeds / bedInfo.totalBeds) * 100)}%`}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            ))}
                        </CardContent>
                        <CardActions className='card-action-dense'>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginLeft: '20px' }}>
                            <Button onClick={() => handleReservation(dorm.dorm_id)}>
                              <AddCircleIcon fontSize='small' sx={{ marginRight: 2 }} />
                              Reservation Now!
                            </Button>
                          </Box>
                        </CardActions>
                      </Grid>
                    </Grid>
                  </AnimatedCard>
                </Grid>
              ))
            })()}
      </Grid>
    </>
  )
}

export default ReservationBuilding
