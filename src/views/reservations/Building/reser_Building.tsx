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
        console.log('gender', data.data.gender)

        if (data.data.gender === 'male') {
          console.log('male', data.data.gender)
          setGenderFilter('male')
        }
        if (data.data.gender === 'female') {
          console.log('female', data.data.gender)
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
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button onClick={handleDialogToggle}>Filter</Button>
            </Box>
            <Dialog open={dialogOpen} onClose={handleDialogToggle}>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Filter</Typography>
                  <IconButton onClick={handleDialogToggle}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex' }}>
                  <GroupIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Roommate</Typography>
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={roommateFilter === ''} onChange={() => setRoommateFilter('')} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={roommateFilter === '2'} onChange={() => setRoommateFilter('2')} />}
                    label='2'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={roommateFilter === '4'} onChange={() => setRoommateFilter('4')} />}
                    label='4'
                  />
                </Grid>

                <Box sx={{ display: 'flex' }}>
                  <BedroomParentIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Room type</Typography>
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={buildingFilter === ''} onChange={() => setBuildingFilter('')} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={buildingFilter == 'Air conditioner'}
                        onChange={() => setBuildingFilter('Air conditioner')}
                      />
                    }
                    label='Air conditioner'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={buildingFilter == 'Ceiling fan'}
                        onChange={() => setBuildingFilter('Ceiling fan')}
                      />
                    }
                    label='Ceiling fan'
                  />
                </Grid>

                <Box sx={{ display: 'flex' }}>
                  <HotelIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Bed Type</Typography>
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={bedFilter === ''} onChange={() => setBedFilter('')} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={bedFilter == 'single bed'} onChange={() => setBedFilter('single bed')} />
                    }
                    label='Single Bed'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={bedFilter == 'bunk bed'} onChange={() => setBedFilter('bunk bed')} />}
                    label='Bunk Bed'
                  />
                </Grid>

                <Box sx={{ display: 'flex' }}>
                  <ShowerIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Bathroom Type</Typography>
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={bathroomFilter === ''} onChange={() => setBathroomFilter('')} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={bathroomFilter == 'shared bathroom'}
                        onChange={() => setBathroomFilter('shared bathroom')}
                      />
                    }
                    label='Shared Bathroom'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={bathroomFilter == 'en suite bathroom'}
                        onChange={() => setBathroomFilter('en suite bathroom')}
                      />
                    }
                    label='En-Suite Bathroom'
                  />
                </Grid>

                <Box sx={{ display: 'flex' }}>
                  <LocalAtmIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Price</Typography>
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={priceFilter === ''} onChange={() => setPriceFilter('')} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={priceFilter === 5400} onChange={() => setPriceFilter(5400)} />}
                    label='5400'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={priceFilter === 7200} onChange={() => setPriceFilter(7200)} />}
                    label='7200'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={priceFilter === 9600} onChange={() => setPriceFilter(9600)} />}
                    label='9600'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={priceFilter === 15000} onChange={() => setPriceFilter(15000)} />}
                    label='15000'
                  />
                </Grid>

                <Grid container spacing={2} pb={5}>
                  <Button
                    onClick={() => {
                      setBuildingFilter('')
                      setRoommateFilter('')
                      setBathroomFilter('')
                      setBedFilter('')
                      setPriceFilter('')
                    }}
                  >
                    Clear
                  </Button>
                  <Button onClick={handleDialogToggle}>Apply</Button>
                </Grid>
              </DialogContent>
            </Dialog>
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
                <StyledGrid item md={5} xs={12}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img width={300} height={300} alt='dom img' src={dorm.images_url} />
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
                  <CardContent>
                    <Typography variant='h6' sx={{ marginBottom: 2 }}>
                      {dorm.name}
                    </Typography>
                    <Typography variant='body2' sx={{ marginBottom: 3.5 }}>
                      - Dormitory fee: 10,000 baht per person per semester. <br /> - Monthly electricity bill payment.
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                      Gender :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_gender}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                      Include :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_building}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                      Bathroom :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_bathroom}
                      </Box>
                    </Typography>

                    <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                      Bed Type :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_bedtype}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                      Roommate :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.type_roommate}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
                      Room Total :{' '}
                      <Box component='span' sx={{ fontWeight: 'bold' }}>
                        {dorm.room_total}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontWeight: 500, marginBottom: 3 }}>
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

                      <IconButton
                        id='long-button'
                        aria-label='share'
                        aria-haspopup='true'
                        onClick={handleClick}
                        aria-controls='long-menu'
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <ShareVariant fontSize='small' />
                      </IconButton>
                      <Menu
                        open={open}
                        id='long-menu'
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'long-button'
                        }}
                      >
                        <MenuItem onClick={handleClose}>
                          <Facebook />
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Twitter />
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Linkedin />
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <GooglePlus />
                        </MenuItem>
                      </Menu>
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
