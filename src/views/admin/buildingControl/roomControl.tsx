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

// ** MUI Icons

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const RoomControl = () => {
  const [room, setRoom] = useState([])

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

  const handleUserInfo = async (roomId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/room/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_id: roomId,
          room_rehearse: !currentStatus // Toggle the status
        })
      })

      router.reload()

      // ... rest of the function

    } catch (error) {
      console.error('Error Update data into Users table:', error.message)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>room number</TableCell>
            <TableCell align='center'>bed capacity</TableCell>
            <TableCell align='center'>bed available </TableCell>
            <TableCell align='center'>status </TableCell>
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
              <TableCell align='center'>{room.bed_available}</TableCell>
              <TableCell align='center'>
                <Button onClick={() => handleUserInfo(room.room_id, room.room_rehearse)}>
                  {room.room_rehearse ? <CheckIcon /> : <CloseIcon color='primary' />}
                </Button>
              </TableCell>

              <TableCell align='center'>
                {/* <Button variant='contained' onClick={() => handleSelect(room.dorm_id)}>
                  Select
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RoomControl
