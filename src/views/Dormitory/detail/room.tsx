import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { CardHeader, Collapse, Divider, Grid, Paper, Table, TableCell, TableContainer, TableHead } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TablePagination from '@mui/material/TablePagination'
import { auto } from '@popperjs/core'
import { userStore, IUser } from 'src/stores/userStore'
import { Refresh } from 'mdi-material-ui'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import IconButton from '@mui/material/IconButton'
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import Tooltip from '@mui/material/Tooltip'
import { CircularProgress } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

interface Column {
  id: 'DETAILS' | 'room' | 'code' | 'Viewdetails' | 'bedstatus'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'DETAILS', label: 'DETAILS', minWidth: 30 },
  { id: 'room', label: 'room', minWidth: 30, align: 'center' },
  { id: 'code', label: 'bed capacity', minWidth: 150, align: 'center' },
  {
    id: 'bedstatus',
    label: 'bed status',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'Viewdetails',
    label: 'View details',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toFixed(2)
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

              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3,color: 'text.primary' }} variant='body2'>
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
              {dormitoryRoom.map(room => (
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
                    <TableCell align='center'>{room.status ? <CheckIcon /> : <CloseIcon color='primary' />}</TableCell>
                    <TableCell align='center'>
                      <Box>
                        {room.status ? (
                          <Button onClick={() => handleReservation(room.room_id)} variant='contained'>
                            Details
                          </Button>
                        ) : (
                          <Button onClick={() => handleReservation(room.room_id)} variant='contained' color='error' >
                            Details
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={open[room.room_id]} timeout='auto' unmountOnExit>
                        {' '}
                        <Box sx={{ margin: 1 }}>
                          {(reservationData.get(room.room_id) || []).map((reservation, index) => (
                            <Typography key={index} variant='body1' gutterBottom component='div'>
                              <strong>{`BED ${index + 1}:`}</strong>
                              <strong>Student ID:</strong> {reservation.Users?.student_id}
                              <strong>Year:</strong> {reservation.Users?.student_year}
                              <strong>Course:</strong> {reservation.Users?.course}
                              <strong>Religion:</strong> {reservation.Users?.religion}
                            </Typography>
                          ))}
                        </Box>
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

export default ReservationRoomDetails
