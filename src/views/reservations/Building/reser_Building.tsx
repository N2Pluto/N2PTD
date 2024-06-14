import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Grid, { GridProps } from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import Linkedin from 'mdi-material-ui/Linkedin'
import GooglePlus from 'mdi-material-ui/GooglePlus'
import ShareVariant from 'mdi-material-ui/ShareVariant'
import { CardActions, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { userStore } from 'src/stores/userStore'
import CloseIcon from '@mui/icons-material/Close'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import GroupIcon from '@mui/icons-material/Group'
import * as React from 'react'

import ShowerIcon from '@mui/icons-material/Shower'
import HotelIcon from '@mui/icons-material/Hotel'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import SuccessฺฺBarBuilding from './component'
import FilterDrawer from './BuildingFilterDialog'

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
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [buildingFilter, setBuildingFilter] = useState<string>('')
  const [bathroomFilter, setBathroomFilter] = useState<string>('')
  const [roommateFilter, setRoommateFilter] = useState<string>('')
  const [bedFilter, setBedFilter] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<number | ''>('')

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({})

  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance
  const { user } = userStore()

  const [profileData, setProfileData] = useState(null)

  console.log('userStoreInstance:', userStoreInstance?.user)
  console.log('userStoreInstance Gender:', userStoreInstance?.user?.gender)

  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch('/api/reservation/room/checkRoom')
        const data = await response.json()
        console.log('Data:', data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }, 2000)

    // Clean up function
    return () => clearInterval(intervalId)
  }, [])

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
      console.log('Reservation Building:', dorm_id)
      setUser({ ...userStoreInstance.user, dorm_id }) // เปลี่ยน เป็นเก็บ ใน useState
      console.log('user:', userStoreInstance.user)
      router.push(`/reservation/room/${dorm_id}`)
    } else {
      console.error('Invalid dorm_id:', dorm_id)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/building/fetch_building').then(res => res.json())
        console.log('data:', data)
        setDormitoryBuilding(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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
              <Button variant='contained' onClick={handleDialogToggle}>
                Filter Building
              </Button>
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

      {dormitoryBuilding
        .filter(dorm => genderFilter === '' || dorm.type_gender === genderFilter)
        .filter(dorm => buildingFilter === '' || dorm.type_building === buildingFilter)
        .filter(dorm => roommateFilter === '' || dorm.type_roommate === roommateFilter)
        .filter(dorm => bathroomFilter === '' || dorm.type_bathroom === bathroomFilter)
        .filter(dorm => bedFilter === '' || dorm.type_bedtype === bedFilter)
        .filter(dorm => priceFilter === '' || dorm.price === priceFilter)

        .map(dorm => (
          <Grid key={dorm.dorm_id} pb={5}>
            <Card>
              <Grid container spacing={6}>
                <StyledGrid item md={4} xs={12}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img width={'100%'} height={'100%'} alt='dom img' src={dorm.images_url} />
                  </CardContent>
                </StyledGrid>
                <Grid
                  item
                  xs={12}
                  md={7}
                  sx={{
                    paddingTop: ['0 !important', '0 !important', '1.5rem !important'],
                    paddingLeft: ['1.5rem !important', '1.5rem !important', '0 !important']
                  }}
                >
                  <CardContent
                    sx={{
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        left: 125, // Adjusted to 0 to start from the very left
                        top: 72,
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
                      variant='h4'
                      sx={{
                        marginBottom: '16px', // Adjusted marginBottom
                        fontFamily: '"Pixelify Sans", sans-serif',
                        fontOpticalSizing: 'auto',
                        fontWeight: 700,
                        fontStyle: 'normal'
                      }}
                    >
                      {dorm.name}
                    </Typography>

                    <Typography sx={{ fontWeight: 500, marginBottom: '16px' }}>
                      {' '}
                      {/* Adjusted marginBottom */}
                      Gender :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_gender}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: '16px' }}>
                      {' '}
                      {/* Adjusted marginBottom */}
                      Include :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_building}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: '16px' }}>
                      {' '}
                      {/* Adjusted marginBottom */}
                      Bathroom :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_bathroom}
                      </Box>
                    </Typography>

                    <Typography sx={{ fontWeight: 500, marginBottom: '16px' }}>
                      {' '}
                      {/* Adjusted marginBottom */}
                      Bed Type :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_bedtype}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: '16px' }}>
                      {' '}
                      {/* Adjusted marginBottom */}
                      Roommate :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_roommate}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: '16px' }}>
                      {' '}
                      {/* Adjusted marginBottom */}
                      Room Total :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.room_total}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: '16px' }}>
                      {' '}
                      {/* Adjusted marginBottom */}
                      Price :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.price} / Person / Term.
                      </Box>
                    </Typography>
                  </CardContent>
                  <CardActions className='card-action-dense'>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Button onClick={() => handleReservation(dorm.dorm_id)}>
                        <AddCircleIcon fontSize='small' sx={{ marginRight: 2 }} />
                        Reservation Now!
                      </Button>
                    </Box>
                  </CardActions>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
    </>
  )
}

export default ReservationBuilding
