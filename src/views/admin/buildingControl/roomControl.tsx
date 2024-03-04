// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import router from 'next/router'

const RoomControl = () => {
  const [room, setRoom] = useState([])
  const [dormitoryRoom, setDormitoryRoom] = useState([])

  useEffect(() => {
    const fetchDataRoomByDormID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
      setRoom(data)
      console.log('data:', data)
    }

    const fetchDataAndUpdateStatusRoom = async () => {
      await fetchDataRoomByDormID() // Fetch the updated data
    }

    fetchDataAndUpdateStatusRoom()
    const intervalId = setInterval(fetchDataAndUpdateStatusRoom, 50000)

    return () => clearInterval(intervalId)
  }, [])

  const handleSelect = (id: string) => {
    // Handle the selection of the building by its ID
    console.log(`Building with ID ${id} selected.`)
    alert(`Building with ID ${id} selected.`)
  }

  console.log('ตรงนี้', room)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>room number</TableCell>
            <TableCell align='center'>bed capacity</TableCell>
            <TableCell align='center'>status </TableCell>
            <TableCell align='center'>bed available </TableCell>
            <TableCell align='center'>detail </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {room.map(room => (
            <TableRow
              key={room?.room_number}
              sx={{
                '&:last-of-type td, &:last-of-type th': {
                  border: 0
                }
              }}
            >
              <TableCell component='th' scope='row' align='center'>
                {room.room_number}
              </TableCell>
              <TableCell align='center'>{room.bed_capacity}</TableCell>
              <TableCell align='center'>{room.status}</TableCell>
              <TableCell align='center'>{room.bed_available}</TableCell>
              <TableCell align='center'>
                <Button variant='contained' onClick={() => handleSelect(room.dorm_id)}>
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RoomControl
