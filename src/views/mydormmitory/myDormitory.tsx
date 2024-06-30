// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import { userStore } from 'src/stores/userStore'
import { Chip } from '@mui/material'
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';


const Mydormitorydetail = () => {
  const { user } = userStore()
  const [reservation, setReservation] = useState(null)
  const [userInfo, setUserInfo] = useState(null)





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

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Dormitory Name </TableCell>
            <TableCell align='center'>Round</TableCell>
            <TableCell align='center'>Reservation Status</TableCell>
            <TableCell align='center'>Payment Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{
              '&:last-of-type td, &:last-of-type th': {
                border: 0
              }
            }}
          >
            <TableCell component='th' scope='row' >
            <Chip label={reservation?.Dormitory_Building?.name} variant="outlined" onClick={handleClick} />  {'\u00A0\u00A0'}
            <Chip label={`Room ${reservation?.Dormitory_Room?.room_number}`} variant="outlined" onClick={handleClick} />  {'\u00A0\u00A0'}
            <Chip label={`Bed ${reservation?.Dormitory_Bed?.bed_number}`} variant="outlined" onClick={handleClick} />
            </TableCell>
            <TableCell align='center'>
            <Chip label={reservation?.Reservation_System?.round_name} variant="outlined" onClick={handleClick} />
             </TableCell>
            <TableCell align='center' >
            <Chip icon={<WhereToVoteIcon style={{ color: 'green', borderColor: 'green' }} />} label={reservation?.status} variant="outlined"  style={{ color: 'green', borderColor: 'green' }}/>
               </TableCell>
            <TableCell align='center'>
            <Chip icon={<WhereToVoteIcon style={{ color: 'green', borderColor: 'green' }}/>} label={reservation?.payment_status} variant="outlined"style={{ color: 'green', borderColor: 'green' }} /></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>


  )
}

export default Mydormitorydetail
