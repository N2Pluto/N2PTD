import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import { userStore } from 'src/stores/userStore'

const MyRoommate = () => {
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [profileData, setProfileData] = useState(null)
  const [userReservations, setUserReservations] = useState({})

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await fetch(`/api/reservation/select?user_id=${user?.user_id}`)
        const { reservationData, userInfoData } = await response.json()
        setReservation(reservationData[0])
        setUserInfo(userInfoData[0])
      } catch (error) {
        console.error('Error fetching reservation data:', error)
      }
    }

    fetchReservationData()
  }, [user])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id })
        })
        const data = await response.json()
        setProfileData(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
    }
  }, [user])

  useEffect(() => {
    const fetchDataBedByRoomID = async () => {
      try {
        const response = await fetch(`/api/myroommate/${reservation?.room_id}`)
        const { data } = await response.json()
        setDormitoryRoom(data)
      } catch (error) {
        console.error('Error fetching bed data:', error)
      }
    }

    if (reservation?.room_id) {
      fetchDataBedByRoomID()
      const intervalId = setInterval(fetchDataBedByRoomID, 60000)

      return () => clearInterval(intervalId)
    }
  }, [reservation?.room_id])

  console.log('dormitoryRoom', dormitoryRoom)

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align='center'>Student ID</TableCell>
            <TableCell align='center'>school</TableCell>
            <TableCell align='center'>religion</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dormitoryRoom.map(room => (
            <TableRow key={room.id}>
              <TableCell component='th' scope='row'>
                {room.Users?.Users_Info[0].name.slice(0, 2) + '*****'}{' '}
                {room.Users?.Users_Info[0].lastname.slice(0, 2) + '*****'}
              </TableCell>
              {room.Users.Users_Info.length > 0 && (
                <>
                  <TableCell align='center'>{room.Users?.student_id.replace(/(?<=..)....../, '******')}</TableCell>
                  <TableCell align='center'>{room.Users?.Users_Info[0].school}</TableCell>
                  <TableCell align='center'>{room.Users?.Users_Info[0].religion}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default MyRoommate
