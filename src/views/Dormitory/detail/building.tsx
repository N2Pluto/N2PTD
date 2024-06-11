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
import { CardActions, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { userStore } from 'src/stores/userStore'
import CloseIcon from '@mui/icons-material/Close'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import GroupIcon from '@mui/icons-material/Group'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import TransgenderIcon from '@mui/icons-material/Transgender'
import FilterDrawer from '../components/BuildingFilterDialog'

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

const ReservationBuildingDetails = () => {
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [buildingFilter, setBuildingFilter] = useState<string>('')
  const [roommateFilter, setRoommateFilter] = useState<string>('')
  const [bathroomFilter, setBathroomFilter] = useState<string>('')
  const [bedFilter, setBedFilter] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<number | ''>('')

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({})

  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance

  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleReservation = (dorm_id: string) => {
    if (dorm_id) {
      console.log('Reservation Building:', dorm_id)
      setUser({ ...userStoreInstance.user, dorm_id }) // เปลี่ยน เป็นเก็บ ใน useState
      console.log('user:', userStoreInstance.user)
      router.push(`/Dormitory/room/${dorm_id}`)
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

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  const handleDialogToggle = () => {
    setDialogOpen(!dialogOpen)
  }

  useEffect(() => {
    handleDialogToggle()
  }, [])

  const getBackgroundImage = (type_gender: string) => {
    if (type_gender === 'male') {
      return 'url(https://img5.pic.in.th/file/secure-sv1/Man09f24199566c0285.png)'
    } else if (type_gender === 'female') {
      return 'url(https://img2.pic.in.th/pic/Girl39ae97a5e743e3c0.png)'
    }
    return ''
  }

  return (
    <>
      <Grid pb={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ whiteSpace: 'nowrap', pr: 3, color: 'text.primary' }} variant='body2'>
                  Dormitory
                </Typography>

                <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

                <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3 }} variant='body2'>
                  Building
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                setPriceFilter,
                genderFilter,
                setGenderFilter
              }}
              disableScrollLock={true}
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
                        backgroundImage: getBackgroundImage(dorm.type_gender),
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
                        View details
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

export default ReservationBuildingDetails
