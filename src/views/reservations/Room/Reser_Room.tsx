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
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import SuccessฺฺBarRoom from './component'

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
  const [floorFilter, setFloorFilter] = useState<number | null>(null)
  const [schoolFilter, setSchoolFilter] = useState('')

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
    const intervalId = setInterval(fetchDataAndUpdateStatus, 3000)

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
    const intervalId = setInterval(fetchDataAndUpdateStatusRoom, 30000)

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
    const filterActivity = profileData?.data.activity
    const filterRedflag = profileData?.data.filter_redflag
    const filterSleep = profileData?.data.sleep
    let filteredRooms = []

    // Filter by school
    if (filterSchool === 'find roommates who attend the same school') {
      console.log('Filtering by same school')
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('User Reservation School :', reservation.Users?.school)
          console.log('User School :', profileData?.data.school)

          return reservation.Users?.school === profileData?.data.school
        })
      })
    } else if (filterSchool === 'find roommates from any school') {
      console.log('Filtering by any school')
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('User Reservation School :', reservation.Users?.school)
          console.log('User School :', profileData?.data.school)

          return reservation.Users?.school !== profileData?.data.school
        })
      })
    } else if (filterSchool === 'find all school') {
      console.log('Filtering by all school')
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('User Reservation School :', reservation.Users?.school)

          return reservation.Users?.school
        })
      })
    }

    // Filter by major
    if (filterMajor === 'find roommates who attend the same major') {
      console.log('Filtering by same major')
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('Users Reservation Major', reservation.Users?.major)
          console.log('User Major:', profileData?.data.major)

          return reservation.Users?.major === profileData?.data.major
        })
      })
    } else if (filterMajor === 'find roommates from any major') {
      console.log('Filtering by any major')
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('Users Reservation Major', reservation.Users?.major)
          console.log('User Major:', profileData?.data.major)

          return reservation.Users?.major !== profileData?.data.major
        })
      })
    } else if (filterMajor === 'find all major') {
      console.log('Filtering by all majors')
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('Users Reservation Major', reservation.Users?.major)

          return reservation.Users?.major
        })
      })
    }

    // Filter by religion
    if (filterReligion === 'find roommates who have the same religion') {
      console.log('Filtering by same religion')
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('Users Reservation Religion', reservation.Users?.religion)
          console.log('Users Religion', profileData?.data.religion)

          return reservation.Users?.religion === profileData?.data.religion
        })
      })
    } else if (filterReligion === 'find roommates from any religion') {
      console.log('Filtering by any religion')
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('Users Reservation Religion', reservation.Users?.religion)
          console.log('Users Religion', profileData?.data.religion)

          return reservation.Users?.religion !== profileData?.data.religion
        })
      })
    } else if (filterReligion === 'find all religion') {
      console.log('Filtering by all religions')
      filteredRooms = filteredRooms.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('Users Reservation Religion', reservation.Users?.religion)

          return reservation.Users?.religion
        })
      })
    }

    // If no rooms match the previous criteria, filter by sleep
    if (filteredRooms.length === 0 && filterSleep) {
      console.log('Filtering by sleep')
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          console.log('Users Reservation Sleep', reservation.Users?.sleep)

          return reservation.Users?.sleep === filterSleep
        })
      })
    }
    // If no rooms match the previous criteria, filter by activity
    else if (filteredRooms.length === 0 && filterActivity) {
      console.log('Filtering by activity')
      const userActivities = filterActivity.split(',').map(activity => activity.trim())
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          const activities = reservation.Users?.activity || []
          console.log('Users Reservation Activity', reservation.Users?.activity)

          return userActivities.some(activity => activities.includes(activity))
        })
      })
    } // If no rooms match the previous criteria, filter by redflag
    else if (filteredRooms.length === 0 && filterRedflag) {
      console.log('Filtering by redflag')
      const userRedflags = filterRedflag.split(',').map(redflag => redflag.trim())
      filteredRooms = dormitoryRoom.filter(room => {
        const reservations = reservationData.get(room.room_id) || []

        return reservations.some(reservation => {
          const redflags = reservation.Users?.filter_redflag || []
          console.log('Users Reservation Redflag', reservation.Users?.filter_redflag)

          return userRedflags.some(redflag => redflags.includes(redflag))
        })
      })
    }
    setDormitoryRoom(filteredRooms)
  }

  const handleClear = () => {
    router.reload()
  }

  const mapToFloorCategory = (floorNumber: number): number => {
    if (floorNumber >= 101 && floorNumber <= 105) {
      return 1
    } else if (floorNumber >= 201 && floorNumber <= 205) {
      return 2
    } else if (floorNumber >= 301 && floorNumber <= 305) {
      return 3
    } else if (floorNumber >= 401 && floorNumber <= 405) {
      return 4
    } else {
      return -1 // Or any other default value if the floor number doesn't match any category
    }
  }

  return (
    <>
      <SuccessฺฺBarRoom />
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
                {' '}
                <Box sx={{ display: 'flex' }}>
                  <HolidayVillageIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Floor</Typography>
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <FormControlLabel
                    control={<Checkbox checked={floorFilter === null} onChange={() => setFloorFilter(null)} />}
                    label='All'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={floorFilter === 1} onChange={() => setFloorFilter(1)} />}
                    label='1'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={floorFilter === 2} onChange={() => setFloorFilter(2)} />}
                    label='2'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={floorFilter === 3} onChange={() => setFloorFilter(3)} />}
                    label='3'
                  />
                  <FormControlLabel
                    control={<Checkbox checked={floorFilter === 4} onChange={() => setFloorFilter(4)} />}
                    label='4'
                  />
                </Grid>
                <Box sx={{ display: 'flex' }}>
                  <BedroomParentIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Bed Available</Typography>
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
                  <MiscellaneousServicesIcon fontSize='small' sx={{ marginRight: 2 }} />
                  <Typography sx={{ paddingRight: 2 }}>Requirement</Typography>
                </Box>
                <Grid container spacing={2} pb={5} pt={1}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox checked={schoolFilter === ''} onChange={() => setSchoolFilter('')} />}
                      label='All'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={schoolFilter === 'Same School'}
                          onChange={() => setSchoolFilter('Same School')}
                        />
                      }
                      label='Same School'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={schoolFilter === 'Same Major'}
                          onChange={() => setSchoolFilter('Same Major')}
                        />
                      }
                      label='Same Major'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={schoolFilter === 'Same Religion'}
                          onChange={() => setSchoolFilter('Same Religion')}
                        />
                      }
                      label='Same Religion'
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} pb={5}>
                  <Button
                    onClick={() => {
                      setBedAvailableFilter(null)
                      setFloorFilter(null)
                      setSchoolFilter('')
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 3 }}>
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
                .filter(room => floorFilter === null || mapToFloorCategory(room.room_number) === floorFilter)
                .filter(room => {
                  const reservations = reservationData.get(room.room_id) || []
                  if (schoolFilter === 'Same School') {
                    return reservations.some(reservation => reservation.Users?.school === profileData?.data.school)
                  } else if (schoolFilter === 'Same Major') {
                    return reservations.some(reservation => reservation.Users?.major === profileData?.data.major)
                  } else if (schoolFilter === 'Same Religion') {
                    return reservations.some(reservation => reservation.Users?.religion === profileData?.data.religion)
                  } else {
                    return true // If no school filter is selected, return true to include all rooms
                  }
                })
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
                          <CardContent sx={{ margin: -5 }}>
                            {(reservationData.get(room.room_id) || []).map((reservation, index) => (
                              <Card sx={{ margin: 3 }} key={index}>
                                <CardContent sx={{ mt: -5, mb: -5 }}>
                                  <Typography variant='body1' gutterBottom component='div'>
                                    {`BED ${index + 1}:`}
                                  </Typography>
                                  <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                      <Grid item xs={12}>
                                        <Box
                                          display='inline-flex'
                                          alignItems='center'
                                          sx={{
                                            backgroundColor:
                                              reservation.Users?.school === profileData?.data.school
                                                ? '#ffe0e0'
                                                : 'inherit'
                                          }}
                                        >
                                          <SchoolIcon />
                                          <Typography variant='body2'>: {reservation.Users?.school}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        {' '}
                                        <Box
                                          display='inline-flex'
                                          alignItems='center'
                                          sx={
                                            reservation.Users?.major === profileData?.data.major
                                              ? { backgroundColor: '#ffe0e0' }
                                              : {}
                                          }
                                        >
                                          <SchoolIcon />
                                          <Typography variant='body2'>: {reservation.Users?.major}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box
                                          display='inline-flex'
                                          alignItems='center'
                                          sx={
                                            reservation.Users?.religion === profileData?.data.religion
                                              ? { backgroundColor: '#ffe0e0' }
                                              : {}
                                          }
                                        >
                                          <MosqueIcon />
                                          <Typography variant='body2'>: {reservation.Users?.religion}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box
                                          display='inline-flex'
                                          alignItems='center'
                                          sx={
                                            reservation.Users?.activity === profileData?.data.activity
                                              ? { backgroundColor: '#ffe0e0' }
                                              : {}
                                          }
                                        >
                                          <PoolIcon />
                                          <Typography variant='body2'>: {reservation.Users?.activity}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box
                                          display='inline-flex'
                                          alignItems='center'
                                          sx={
                                            reservation.Users?.filter_redflag === profileData?.data.filter_redflag
                                              ? { backgroundColor: '#ffe0e0' }
                                              : {}
                                          }
                                        >
                                          <DangerousIcon />
                                          <Typography variant='body2'>: {reservation.Users?.filter_redflag}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box
                                          display='inline-flex'
                                          alignItems='center'
                                          sx={
                                            reservation.Users?.sleep === profileData?.data.sleep
                                              ? { backgroundColor: '#ffe0e0' }
                                              : {}
                                          }
                                        >
                                          <HotelIcon />
                                          <Typography variant='body2'>: {reservation.Users?.sleep}</Typography>
                                        </Box>
                                      </Grid>
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
