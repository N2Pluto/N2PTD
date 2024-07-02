import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import router from 'next/router'

// ** MUI Icons
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import { sendDiscordMessage } from 'src/pages/api/discord/admin'
import { userStore } from 'src/stores/userStore'

const RoomControl = () => {
  const [room, setRoom] = useState([])
  const { user } = userStore()
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
      setDormitoryBuilding(data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchDataRoomByDormID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
      setRoom(data)
    }

    fetchDataRoomByDormID()
  }, [])

  const discordHandle = async (room_rehearse, room_number, dormitoryBuilding) => {
    if (!room_rehearse) {
      await sendDiscordMessage(
        `${user.student_id}`,
        `${user.email}`,
        `ได้ทำการ ปิด ห้องที่ ${room_number} ของอาคาร ${dormitoryBuilding} แล้ว ❌`
      )
    } else {
      await sendDiscordMessage(
        `${user.student_id}`,
        `${user.email}`,
        `ได้ทำการ เปิด ห้องที่ ${room_number} ของอาคาร ${dormitoryBuilding} แล้ว ✅`
      )
    }
  }

  const handleUserInfo = async (roomId, currentStatus, roomNum, domname) => {
    try {
      const response = await fetch('/api/room/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_id: roomId,
          room_rehearse: !currentStatus,
          roomNum: roomNum,
          domname: domname
        })
      })

      if (response.ok) {
        discordHandle(!currentStatus, roomNum, domname)

        // Update the room state immediately
        setRoom(prevRoom =>
          prevRoom.map(room => (room.room_id === roomId ? { ...room, room_rehearse: !currentStatus } : room))
        )
      }
    } catch (error) {
      console.error('Error Update data into Users table:', error.message)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>Room Number</TableCell>
            <TableCell align='center'>Bed Capacity</TableCell>
            <TableCell align='center'>Bed Available</TableCell>
            <TableCell align='center'>Status</TableCell>
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
                <Switch
                  checked={room.room_rehearse}
                  onChange={() =>
                    handleUserInfo(room.room_id, room.room_rehearse, room.room_number, dormitoryBuilding.name)
                  }
                  icon={<BuildCircleIcon sx={{ display: 'flex', alignItems: 'center', mt: -0.3 }} color='error' />}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RoomControl
