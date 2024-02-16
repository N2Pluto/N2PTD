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

function createData(name: string, code: string, population: number, size: number): Data {
  const density = population / size

  return { name, code, population, size, density }
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767)
]

const ReservationRoomTest = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])

  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

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
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
    </>


  )
}

export default ReservationRoomTest
