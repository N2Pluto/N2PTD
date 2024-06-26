import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { userStore } from 'src/stores/userStore'
import Grid, { GridProps } from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BedIcon from '@mui/icons-material/Bed';
import {
  DialogActions,
  DialogContent,
  Stack,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  stepConnectorClasses
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import VideoLabelIcon from '@mui/icons-material/VideoLabel'
import SchoolIcon from '@mui/icons-material/School'
import MosqueIcon from '@mui/icons-material/Mosque'
import PoolIcon from '@mui/icons-material/Pool'
import DangerousIcon from '@mui/icons-material/Dangerous'
import HotelIcon from '@mui/icons-material/Hotel'
import ConstructionIcon from '@mui/icons-material/Construction'

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

const ReservationBedviwe = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [userReservations, setUserReservations] = useState<{ [key: string]: any }>({})

  const userStoreInstance = userStore()
  const { user, setUser } = userStoreInstance
  const [value, setValue] = useState<string>('1')
  const [open, setOpen] = useState(false)
  const steps = ['Reservation', 'Building', 'Room', 'Bed']

  const handleChange = async (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)

    if (!userReservations[newValue]) {
      const { data } = await fetch(`/api/reservation/checkUserReservBed?bed_id=${newValue}`).then(res => res.json())
      setUserReservations(prevReservations => ({ ...prevReservations, [newValue]: data }))
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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
    ownerState: { completed?: boolean; active?: boolean }
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
      backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
      backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
    })
  }))

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/bed/${router.query.id}`).then(res => res.json())
    setDormitoryBed(data)
  }

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData()])
    }
  }, [fetchData, router.query.id])

  useEffect(() => {
    const fetchDataBedByRoomID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/bed/room/${router.query.id}`).then(res => res.json())
      setDormitoryRoom(data)
    }
    const fetchDataAndUpdateStatus = async () => {
      await fetchDataBedByRoomID() // Fetch the updated data
    }
    fetchDataAndUpdateStatus()
    
    // const intervalId = setInterval(fetchDataAndUpdateStatus, 50000)

    // return () => clearInterval(intervalId)
  }, [router.query.id])

  const handleReservation = async (bed_id: string) => {
    console.log('Reservation Bed ID:', bed_id)
    setUser({ ...userStoreInstance.user, bed_id })
    console.log('user:', userStoreInstance.user)
    try {
      if (!user) {
        console.error('User data is missing.')

        return
      }

      const checkResponse = await fetch(`/api/reservation/checkReservation?user_id=${user.user_id}`)
      const { hasReservation } = await checkResponse.json()

      if (hasReservation) {
        handleOpen()

        return
      }

      const handleClickOpen = () => {
        setOpen(true)
      }

      const checkBedResponse = await fetch(`/api/reservation/checkRepeat?bed_id=${bed_id}`)
      const { isReserved } = await checkBedResponse.json()

      if (isReserved) {
        handleClickOpen()

        return
      }

      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.user_id,
          dorm_id: user.dorm_id,
          room_id: user.room_id,
          bed_id: bed_id
        })
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error inserting data into Reservation table:', error.message)
      } else {
        console.log('Data inserted successfully:', data)

        router.push(`/reservation/result/${user.user_id}`)
      }
    } catch (error) {
      console.error('Error inserting data into Reservation table:', error.message)
    }
  }
  console.log('dormitoryRoom:', dormitoryRoom)

  return (
    <>
      <Grid pb={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ marginBottom: 2 }}>
              Select Bed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='card navigation example'>
            {dormitoryRoom.map((room, index) => (
              <Tab key={index} value={room.bed_id.toString()} label={`Bed ${room.bed_number}`} />
            ))}
          </TabList>

          <CardContent>
            {dormitoryRoom.map((room, index) => (
              <TabPanel key={index} value={room.bed_id.toString()} sx={{ p: 0 }}>
                <Box>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    Bed Number: {room.bed_number}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 4 }}>
                    Bed Status: {room.bed_status ? <CheckIcon /> : <CloseIcon />}
                  </Typography>
                  {userReservations[room.bed_id] &&
                    userReservations[room.bed_id].map((reservation, index) => (
                      <CardContent sx={{ margin: 0 }} key={index}>
                        <Card sx={{ margin: 5 }} key={index}>
                          <CardContent>
                            <Grid container spacing={6}>
                              <Grid item xs={12}>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img2.pic.in.th/pic/profile_3135768.png'
                                    alt='School Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Info[0]?.name.slice(0, -3) + '***'}{' '}
                                    {reservation.Users?.Users_Info[0]?.lastname.replace(/./g, '*')}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/card_9199345.png'
                                    alt='School Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.student_id.replace(/(?<=..)....../, '******')}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/school_2602414.png'
                                    alt='School Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'> : {reservation.Users?.Users_Info[0]?.school}</Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/book_2232470.png'
                                    alt='Major Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Info[0]?.department}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/graduate_401672.png'
                                    alt='Major Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'> : {reservation.Users?.Users_Info[0]?.major}</Typography>
                                </Box>

                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/religion_9311967.png'
                                    alt='Religion Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Info[0]?.religion}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/time-management_2027497.png'
                                    alt='Activity Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Req[0]?.activity}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/flag_1452046.png'
                                    alt='Redflag Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Req[0].filter_redflag}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/bed-time_12178656.png'
                                    alt='Sleep Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'> : {reservation.Users?.Users_Req[0].sleep}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </CardContent>
                    ))}
                </Box>
              </TabPanel>
            ))}
          </CardContent>
        </TabContext>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Warn'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>THIS BED IS ALREADY RESERVE!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>accept</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReservationBedviwe
