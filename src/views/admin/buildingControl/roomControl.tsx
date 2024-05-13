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

    // Call fetchData immediately
    fetchData()

    // Then call fetchData every 50 seconds
    // const intervalId = setInterval(fetchData, 50000)

    // Clear interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchDataRoomByDormID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
      setRoom(data)
    }

    const fetchDataAndUpdateStatusRoom = async () => {
      await fetchDataRoomByDormID() // Fetch the updated data
    }

    fetchDataAndUpdateStatusRoom()
    // const intervalId = setInterval(fetchDataAndUpdateStatusRoom, 50000)

    // return () => clearInterval(intervalId)
  }, [])

  const handleSelect = (id: string) => {
    // Handle the selection of the building by its ID
    console.log(`Building with ID ${id} selected.`)
    alert(`Building with ID ${id} selected.`)
  }

  const discordHandle = async (room_rehearse: boolean, room_number: string, dormitoryBuilding: string) => {
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

  const handleUserInfo = async (roomId: string, currentStatus: boolean, roomNum: string, domname: string) => {
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

      discordHandle(!currentStatus, roomNum, domname)

      setTimeout(() => {
        router.reload()
      }, 2000)

    } catch (error) {
      console.error('Error Update data into Users table:', error.message)
    }
  }

  const handleInputfield = (id: string) => {
    console.log('id:', id)
    router.push(`/admin/buildingControl/room/${id}`)
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
                <Switch
                  checked={room.room_rehearse}
                  onChange={() =>
                    handleUserInfo(room.room_id, room.room_rehearse, room.room_number, dormitoryBuilding.name)
                  }
                  icon={<BuildCircleIcon sx={{ display: 'flex', alignItems: 'center', mt: -0.3 }} color='error' />}
                />
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

// onChange={() => handleUserInfo(room.room_id, room.room_rehearse)}
