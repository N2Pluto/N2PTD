import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { CardHeader, Collapse, Divider, Grid, Paper, Table, TableCell, TableContainer, TableHead } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import { auto } from '@popperjs/core'
import { userStore, IUser } from 'src/stores/userStore'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import SchoolIcon from '@mui/icons-material/School'
import MosqueIcon from '@mui/icons-material/Mosque'
import PoolIcon from '@mui/icons-material/Pool'
import DangerousIcon from '@mui/icons-material/Dangerous'
import HotelIcon from '@mui/icons-material/Hotel'
import CardMedia from '@mui/material/CardMedia'
import FeedIcon from '@mui/icons-material/Feed'
import AllInboxIcon from '@mui/icons-material/AllInbox'

interface Column {
  id: 'DETAILS' | 'room' | 'code' | 'Viewdetails' | 'bedstatus'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'room', label: 'room', minWidth: 30, align: 'center' },
  { id: 'code', label: 'bed capacity', minWidth: 150, align: 'center' },
  {
    id: 'bedstatus',
    label: 'bed status',
    minWidth: 170,
    align: 'center'
  }
]

const ReservationRoomDetails = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [dormitoryRoomStatus, setDormitoryRoomStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [reservationData, setReservationData] = useState<Map<string, any[]>>(new Map())

  const [open, setOpen] = useState({}) // Change this line
  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance

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

    // const intervalId = setInterval(fetchDataAndUpdateStatus, 10000)

    // return () => clearInterval(intervalId)
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

  console.log('dormitoryBuilding:', dormitoryBuilding)

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

    // const intervalId = setInterval(fetchDataAndUpdateStatusRoom, 10000)

    // return () => clearInterval(intervalId)

  }, [])

  console.log('sdasdad:', dormitoryRoom)

  const handleReservation = (room_id: string) => {
    console.log('Reservation ROOM :', room_id)
    setUser({ ...userStoreInstance.user, room_id }) // Store room_id in userStore
    console.log('user:', userStoreInstance.user)
    router.push(`/Dormitory/bed/${room_id}`)
  }

  return (
    <>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, color: 'text.primary' }} variant='body2'>
                Dormitory
              </Typography>

              <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3, color: 'text.primary' }} variant='body2'>
                Building
              </Typography>

              <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3 }} variant='body2'>
                Room
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
        <Card sx={{ pb: 5 }}>
          {/* <CardMedia sx={{ height: '14.5625rem' }} image={dormitoryBuilding?.images_url} /> */}
          <CardContent>
            <Typography variant='h4' sx={{ marginBottom: 2 }}>
              {dormitoryBuilding?.name}
            </Typography>

            <Grid container spacing={6} sx={{ pt: 5 }}>
              <Grid item xs={12} sm={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
                  <Typography variant='body2' sx={{ pr: 2 }}>
                    <FeedIcon sx={{ fontSize: 50 }} />
                  </Typography>
                  <Typography variant='h5'>Information</Typography>
                </Box>
                <Box sx={{ pl: 3, pt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 10, pb: 5 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      Type building{' '}
                    </Typography>
                    <Typography variant='body1'> | {dormitoryBuilding?.type_building}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 10, pb: 5 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      {' '}
                      Gender{' '}
                    </Typography>
                    <Typography variant='body1'>| {dormitoryBuilding?.type_gender}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 10, pb: 5 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      {' '}
                      Price{' '}
                    </Typography>
                    <Typography variant='body1'>| {dormitoryBuilding?.price} baht / term</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 10, pb: 5 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      {' '}
                      Bathroom{' '}
                    </Typography>
                    <Typography variant='body1'>| {dormitoryBuilding?.type_bathroom}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 10, pb: 5 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      {' '}
                      Roommate{' '}
                    </Typography>
                    <Typography variant='body1'>| {dormitoryBuilding?.type_roommate} Person</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 10, pb: 5 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      {' '}
                      Bed type{' '}
                    </Typography>
                    <Typography variant='body1'>| {dormitoryBuilding?.type_bedtype}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: 10, pb: 15 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      {' '}
                      Bed capacity{' '}
                    </Typography>
                    <Typography variant='body1'>| {dormitoryBuilding?.type_bedcapacity} bed</Typography>
                  </Box>
                </Box>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
                  <Typography variant='body1' sx={{ pr: 2 }}>
                    <AllInboxIcon sx={{ fontSize: 50 }} />
                  </Typography>
                  <Typography variant='h5'>Facilities</Typography>
                </Box>
                <Box sx={{ pl: 3, pt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      Furniture{' '}
                    </Typography>
                    <Typography variant='body1'>
                      {' '}
                      | {JSON.parse(dormitoryBuilding?.type_furniture || '[]').join(', ')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', pb: 10 }}>
                    <Typography variant='body1' sx={{ width: 150 }}>
                      Facilities{' '}
                    </Typography>
                    <Typography variant='body1'>
                      {' '}
                      | {JSON.parse(dormitoryBuilding?.type_facilities || '[]').join(', ')}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Typography variant='h3' sx={{ marginBottom: 2, ml: 2 }}></Typography>
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
              {dormitoryRoom.map(room => (
                <React.Fragment key={room.room_id}>
                  <TableRow hover role='checkbox' tabIndex={-1}>
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
                    <TableCell align='center'>{room.status ? <CheckIcon /> : <CloseIcon color='primary' />}</TableCell>

                  </TableRow>
                  <TableRow>

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

export default ReservationRoomDetails
