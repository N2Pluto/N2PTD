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
import {
  CardActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  stepConnectorClasses
} from '@mui/material'
import { userStore } from 'src/stores/userStore'
import CloseIcon from '@mui/icons-material/Close'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import GroupIcon from '@mui/icons-material/Group'
import * as React from 'react'

import SettingsIcon from '@mui/icons-material/Settings'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BedIcon from '@mui/icons-material/Bed';

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
  const [roommateFilter, setRoommateFilter] = useState<string>('')

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({})

  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance
  console.log('userStoreInstance:', userStoreInstance?.user)
  console.log('userStoreInstance Gender:', userStoreInstance?.user?.gender)

  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const steps = ['Reservation', 'Building', 'Room' ,'Bed']

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)'
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#784af4'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#784af4'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1
    }
  }))

  const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: '#784af4'
    }),
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor'
    }
  }))

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1
    }
  }))

  const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props

    const icons: { [index: string]: React.ReactElement } = {
      1: <SettingsIcon />,
      2: <CorporateFareIcon />,
      3: <BedroomParentIcon />,
      4: <BedIcon />
    }

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    )
  }

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
    if (userStoreInstance.user) {
      setGenderFilter(userStoreInstance.user.gender)
    }
  }, [userStoreInstance.user])

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
      <Grid pb={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
          <Card>
            <CardContent>
              <Stack sx={{ width: '100%' }} spacing={4}>
                <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

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
                  <Typography sx={{ paddingRight: 2 }}>Room type</Typography>
                  <BedroomParentIcon fontSize='small' sx={{ marginRight: 2 }} />
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
                  <Typography sx={{ paddingRight: 2 }}>Roommate</Typography>
                  <GroupIcon fontSize='small' sx={{ marginRight: 2 }} />
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

                <Grid container spacing={2} pb={5}>
                  <Button
                    onClick={() => {
                      setGenderFilter('')
                      setBuildingFilter('')
                      setRoommateFilter('')
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
