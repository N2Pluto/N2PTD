import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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

interface Column {
  id: 'room' | 'code' | 'details' | 'bedstatus'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'room', label: 'room', minWidth: 170 },
  { id: 'code', label: 'bed capacity', minWidth: 100 },
  {
    id: 'bedstatus',
    label: 'bed status',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'details',
    label: 'details',
    minWidth: 170,
    align: 'right',
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

  // const [count, setCount] = useState(0)
  // const [hasReloaded, setHasReloaded] = useState(false)

  // useEffect(() => {
  //   if (count === 0 && !hasReloaded) {
  //     setCount(1)
  //     setHasReloaded(true) // Update hasReloaded to prevent further reloads
  //     router.reload()
  //   }
  //   console.log('count:', count) // This will log 'count: 1'
  // }, [])

  useEffect(() => {
    const fetchDataRoomStatus = async () => {
      try {
        const dorm_id = router.query.id // Add the missing declaration for dorm_id
        const response = await fetch(`/api/reservation/checkStatusRoom?dorm_id=${dorm_id}`)
        const data = await response.json()
        setDormitoryRoomStatus(data)
      } catch (error) {
        console.error('Error fetching room status:', error)
      }
    }

    fetchDataRoomStatus()
  }, [])

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData(), fetchDataRoomByDormID()])
    }
  }, [router.query.id])

  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
    setDormitoryBuilding(data)
  }

  const fetchDataRoomByDormID = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
    setDormitoryRoom(data)
    console.log('data:', data)
  }

  const handleReservation = (room_id: string) => {
    console.log('Reservation ROOM :', room_id)
    setUser({ ...userStoreInstance.user, room_id }) // Store room_id in userStore
    console.log('user:', userStoreInstance.user)
    router.push(`/reservation/bed/${room_id}`)
  }

  return (
    <>
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
                <TableRow hover role='checkbox' tabIndex={-1} key={room.room_id}>
                  <TableCell>{room.room_number}</TableCell>
                  <TableCell>
                    {' '}
                    {room.bed_available} / {room.bed_capacity}{' '}
                  </TableCell>
                  <TableCell align='right'>{room.status ? 'เปิด' : 'ปิด'}</TableCell>
                  <TableCell align='right'>
                    <Box>
                      <Button onClick={() => handleReservation(room.room_id)} variant='contained'>
                        Select
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}

export default ReservationRoomTest
