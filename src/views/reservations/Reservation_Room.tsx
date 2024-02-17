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

interface Column {
  id: 'room' | 'code' | 'status' | 'details'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'room', label: 'room', minWidth: 170 },
  { id: 'code', label: 'bed capacity', minWidth: 100 },
  {
    id: 'status',
    label: 'status',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US')
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


  const handleReservation = (id: string) => { // specify the type of 'id' as string
    // Handle the reservation with the card ID
    console.log('Reservation ROOM :', id)
  }

  console.log('dormitoryBuilding:', dormitoryBuilding)
  console.log('dormitoryRoom:', dormitoryRoom)

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
                <TableCell >{room.room_number}</TableCell>
                <TableCell>{room.bed_capacity}</TableCell>
                <TableCell align='right'>{room.status}</TableCell>
                <TableCell align='right'>
                <Link href={`/reservations/reservations_room/reservations_bed/${room.room_id}`} passHref>
                  <Box>
                    <Button onClick={() => handleReservation(room.room_id)} variant='contained'>
                    Select
                    </Button>
                  </Box>

                </Link>
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
