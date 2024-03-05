import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import {
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  stepConnectorClasses
} from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import { CardActions, Dialog, DialogContent, DialogTitle, StepIconProps } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import TablePagination from '@mui/material/TablePagination'
import { auto } from '@popperjs/core'
import { userStore, IUser } from 'src/stores/userStore'
import { Refresh } from 'mdi-material-ui'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import Tooltip from '@mui/material/Tooltip'
import SettingsIcon from '@mui/icons-material/Settings'
import { Theme, styled } from '@mui/material/styles'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import BedIcon from '@mui/icons-material/Bed'
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import * as React from 'react'
import { CircularProgress } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { IDormitoryBed } from 'src/interfaces/IDormitoryBed'
import { set } from 'nprogress'
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

interface Column {
  id: 'details' | 'room' | 'code' | 'reserve' | 'bedstatus'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'details', label: 'DETAILS', minWidth: 30 },
  { id: 'room', label: 'room', minWidth: 30, align: 'center' },
  { id: 'code', label: 'bed capacity', minWidth: 150, align: 'center' },
  {
    id: 'bedstatus',
    label: 'bed status',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'reserve',
    label: 'reserve',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toFixed(2)
  }
]

const ReservationRoomTest = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [dormitoryRoomStatus, setDormitoryRoomStatus] = useState([])
  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance
  const [loading, setLoading] = useState(false)
  const [reservationData, setReservationData] = useState<Map<string, any[]>>(new Map())
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [roomFilter, setRoomFilter] = useState<string>('')
  const [bedAvailableFilter, setBedAvailableFilter] = useState<number | null>(null)
  const [courseFilter, setCourseFilter] = useState<string>('')
  const [religionFilter, setReligionFilter] = useState<string>('')
  const [profileData, setProfileData] = useState(null)
  const { user } = userStore()

  const [open, setOpen] = useState({}) // Change this line

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
      console.log('usasdsader:', profileData)
    }
  }, [user])

  const handleClick = id => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [id]: !prevOpen[id]
    }))
  }

  useEffect(() => {
    const fetchReservationData = async (roomId: string) => {
      try {
        setLoading(true)
        const response = await fetch(`/api/reservation/checkUserReservationBoom?room_id=${roomId}`)
        const data = await response.json()
        setReservationData(prevData => {
          const newData = new Map(prevData)
          newData.set(roomId, data)

          return newData
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching reservation data:', error)
        setLoading(false)
      }
    }

    dormitoryRoom.forEach(room => {
      fetchReservationData(room.room_id)
    })
  }, [dormitoryRoom])

  const steps = ['Reservation', 'Building', 'Room', 'Bed']

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

  const ColorlibStepIconRoot = styled('div')<{ theme: Theme; ownerState: { completed?: boolean; active?: boolean } }>(
    ({ theme, ownerState }) => ({
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
    })
  )

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

  useEffect(() => {
    const fetchDataRoomStatus = async () => {
      try {
        const dorm_id = router.query.id // Add the missing declaration for dorm_id
        const response = await fetch(`/api/reservation/checkStatusRoom?dorm_id=${dorm_id}`)
        const data = await response.json()
        setDormitoryRoomStatus(data)
        console.log('data bed capacity:', data)
      } catch (error) {
        console.error('Error fetching room status:', error)
      }
    }
    const fetchDataAndUpdateStatus = async () => {
      await fetchDataRoomStatus() // Fetch the updated data
    }

    fetchDataAndUpdateStatus()
    const intervalId = setInterval(fetchDataAndUpdateStatus, 50000)

    return () => clearInterval(intervalId)
  }, []) // Remove dormitoryRoomStatus from dependencies

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData()])
    }
  }, [router.query.id])

  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
    setDormitoryBuilding(data)
  }

  useEffect(() => {
    const fetchDataRoomByDormID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
      setDormitoryRoom(data)
      console.log('data:', data)
    }

    const fetchDataAndUpdateStatusRoom = async () => {
      await fetchDataRoomByDormID() // Fetch the updated data
    }

    fetchDataAndUpdateStatusRoom()
    const intervalId = setInterval(fetchDataAndUpdateStatusRoom, 50000)

    return () => clearInterval(intervalId)
  }, [])

  const handleReservation = (room_id: string) => {
    console.log('Reservation ROOM :', room_id)
    setUser({ ...userStoreInstance.user, room_id }) // Store room_id in userStore
    console.log('user:', userStoreInstance.user)
    router.push(`/reservation/bed/${room_id}`)
  }

  const handleDialogToggle = () => {
    setDialogOpen(!dialogOpen)
  }

  const handleSmartReservation = () => {
    const filterSchool = profileData?.data.filter_school
    const filterMajor = profileData?.data.filter_major
    const filterReligion = profileData?.data.filter_religion
    const filterActivity = profileData?.data.filter_activity
    const filterRedflag = profileData?.data.filter_redflag
    const filterSleep = profileData?.data.filter_sleep // Assuming there's a similar field for sleep
    let filteredRooms = []

    // Filter by school
    if (filterSchool === 'find roommates who attend the same school') {
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.school === profileData?.data.school)
      })
    } else if (filterSchool === 'find roommates from any school') {
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.school !== profileData?.data.school)
      })
    } else if (filterSchool === 'find both') {
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.school)
      })
    }

    // Filter by major within the previously filtered rooms
    if (filterMajor === 'find roommates who study the same major') {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.major === profileData?.data.major)
      })
    } else if (filterMajor === 'find roommates from any major') {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.major !== profileData?.data.major)
      })
    } else if (filterMajor === 'find both') {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.major)
      })
    }

    // Filter by religion within the previously filtered rooms
    if (filterReligion === 'find roommates who have the same religion') {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.religion === profileData?.data.religion)
      })
    } else if (filterReligion === 'find roommates from any religion') {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []


        return reservations.some(reservation => reservation.Users?.religion !== profileData?.data.religion)
      })
    } else if (filterReligion === 'find both') {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.religion)
      })
    }

    // Filter by activity within the previously filtered rooms
    if (filterActivity) {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          const activities = reservation.Users?.activity || []
          const userActivities = profileData?.data.activity || []

          return activities.some(activity => userActivities.includes(activity))
        })
      })
    }

    // Filter by redflag within the previously filtered rooms
    if (filterRedflag) {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          const redflags = reservation.Users?.filter_redflag || []
          const userRedflags = profileData?.data.filter_redflag || []

          return redflags.some(redflag => userRedflags.includes(redflag))
        })
      })
    }

    // Filter by sleep within the previously filtered rooms
    if (filterSleep) {
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => reservation.Users?.sleep === profileData?.data.sleep)
      })
    }

    setDormitoryRoom(filteredRooms)
  }

  const handleClear = () => {
    router.reload()
  }



  return (
    <>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
        <Card>
          <CardContent>
            <Stack sx={{ width: '100%' }} spacing={4}>
              <Stepper alternativeLabel activeStep={2} connector={<ColorlibConnector />}>
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
              <Button onClick={handleDialogToggle}>Filter Room</Button>
            </Box>
            <Dialog open={dialogOpen} onClose={handleDialogToggle}>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Filter Room</Typography>
                  <IconButton onClick={handleDialogToggle}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ paddingRight: 2 }}>Bed Available</Typography>
                  <BedroomParentIcon fontSize='small' sx={{ marginRight: 2 }} />
                </Box>

                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={bedAvailableFilter === null} onChange={() => setBedAvailableFilter(null)} />
                    }
                    label='All'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={bedAvailableFilter === 0} onChange={() => setBedAvailableFilter(0)} />}
                    label='0'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={bedAvailableFilter === 1} onChange={() => setBedAvailableFilter(1)} />}
                    label='1'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={bedAvailableFilter === 2} onChange={() => setBedAvailableFilter(2)} />}
                    label='2'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={bedAvailableFilter === 3} onChange={() => setBedAvailableFilter(3)} />}
                    label='3'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={bedAvailableFilter === 4} onChange={() => setBedAvailableFilter(4)} />}
                    label='4'
                  />
                </Grid>

                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ paddingRight: 2 }}>Course</Typography>
                  <BedroomParentIcon fontSize='small' sx={{ marginRight: 2 }} />
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={courseFilter === ''} onChange={() => setCourseFilter('')} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={courseFilter === 'Single'} onChange={() => setCourseFilter('Single')} />
                    }
                    label='Single'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={courseFilter === 'Double'} onChange={() => setCourseFilter('Double')} />
                    }
                    label='Double'
                  />
                </Grid>

                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ paddingRight: 2 }}>Religion</Typography>
                  <BedroomParentIcon fontSize='small' sx={{ marginRight: 2 }} />
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={religionFilter === ''} onChange={() => setReligionFilter('')} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={religionFilter === 'Christianity'}
                        onChange={() => setReligionFilter('Christianity')}
                      />
                    }
                    label='Christianity'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox checked={religionFilter === 'Islam'} onChange={() => setReligionFilter('Islam')} />
                    }
                    label='Islam'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={religionFilter === 'Buddhism'}
                        onChange={() => setReligionFilter('Buddhism')}
                      />
                    }
                    label='Buddhism'
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={religionFilter === 'Hinduism'}
                        onChange={() => setReligionFilter('Hinduism')}
                      />
                    }
                    label='Hinduism'
                  />
                </Grid>

                <Grid container spacing={2} pb={5}>
                  <Button
                    onClick={() => {
                      setBedAvailableFilter(null)
                      setCourseFilter('')
                      setReligionFilter('')
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
      <Box sx={{ display: 'flex', pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant='contained' onClick={handleSmartReservation}>
            MATCHING ROOM
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' ,pl:3}}>
          <Button variant='contained' onClick={handleClear}>
            clear
          </Button>
        </Box>
      </Box>
      <h1> {dormitoryBuilding?.name}</h1>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: auto }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dormitoryRoom
                .filter(room => bedAvailableFilter === null || room.bed_available === bedAvailableFilter)
                .filter(room => courseFilter === '' || room.course === courseFilter)
                .filter(room => religionFilter === '' || room.religion === religionFilter)
                .map(room => (
                  <React.Fragment key={room.room_id}>
                    <TableRow hover role='checkbox' tabIndex={-1}>
                      <TableCell>
                        <IconButton aria-label='expand row' size='small' onClick={() => handleClick(room.room_id)}>
                          {open[room.room_id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align='center'>{room.room_number}</TableCell>
                      <TableCell align='center'>
                        {Array.from({ length: room.bed_available }, (_, index) => (
                          <Tooltip title='This bed already reserve.' key={index}>
                            <PersonIcon color='primary' />
                          </Tooltip>
                        ))}

                        {Array.from({ length: room.bed_capacity - room.bed_available }, (_, index) => (
                          <Tooltip title='This bed is available' key={index}>
                            <PersonIcon />
                          </Tooltip>
                        ))}
                      </TableCell>
                      <TableCell align='center'>
                        {room.room_rehearse ? (
                          room.status ? (
                            <CheckIcon />
                          ) : (
                            <CloseIcon color='primary' />
                          )
                        ) : (
                          <ConstructionIcon color='error' />
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        <Box>
                          {room.room_rehearse ? (
                            room.status ? (
                              <Button onClick={() => handleReservation(room.room_id)} variant='contained'>
                                Select
                              </Button>
                            ) : (
                              <Button variant='contained' color='error' disabled>
                                Full
                              </Button>
                            )
                          ) : (
                            <Button variant='contained' color='error' disabled>
                              Closed for maintenance
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open[room.room_id]} timeout='auto' unmountOnExit>
                          {' '}
                          <CardContent sx={{ margin: 0 }}>
                            {(reservationData.get(room.room_id) || []).map((reservation, index) => (
                              <Card sx={{ margin: 5 }} key={index}>
                                <CardContent>
                                  <Typography variant='h6' gutterBottom component='div'>
                                    {`BED ${index + 1}:`}
                                  </Typography>
                                  <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                      <Box display='flex' alignItems='center'>
                                        <SchoolIcon />
                                        <Typography variant='body1'>: {reservation.Users?.school}</Typography>
                                      </Box>
                                      <Box display='flex' alignItems='center'>
                                        <SchoolIcon />
                                        <Typography variant='body1'>: {reservation.Users?.major}</Typography>
                                      </Box>
                                      <Box display='flex' alignItems='center'>
                                        <MosqueIcon />
                                        <Typography variant='body1'>: {reservation.Users?.religion}</Typography>
                                      </Box>
                                      <Box display='flex' alignItems='center'>
                                        <PoolIcon />
                                        <Typography variant='body1'>: {reservation.Users?.activity}</Typography>
                                      </Box>
                                      <Box display='flex' alignItems='center'>
                                        <DangerousIcon />
                                        <Typography variant='body1'>: {reservation.Users?.filter_redflag}</Typography>
                                      </Box>
                                      <Box display='flex' alignItems='center'>
                                        <HotelIcon />
                                        <Typography variant='body1'>: {reservation.Users?.sleep}</Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            ))}
                          </CardContent>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}

export default ReservationRoomTest
