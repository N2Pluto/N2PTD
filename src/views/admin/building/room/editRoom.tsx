import { ChangeEvent, forwardRef, MouseEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton' // Import Skeleton component
import { IoSettingsOutline } from 'react-icons/io5'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import SettingRoom from './settingRoom'
import CreateRoom from './createRoom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  success: {
    backgroundColor: theme.palette.success.dark
  }
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

function createData(room_id: number, dorm_id: number, room_number: number, bed_capacity: number) {
  return { room_id, dorm_id, room_number, bed_capacity }
}

const EditRoom = () => {
  const classes = useStyles()
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarDeleteRoom, setSnackbarDeleteRoom] = useState(false)
  const router = useRouter()

  const handleSnackbarDeleteRoomClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarDeleteRoom(false)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  useEffect(() => {
    const fetchDataRoomByDormID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
      setDormitoryRoom(data)
      console.log('fetchDataRoomByDormID data:', data)
    }
    const intervalId = setInterval(fetchDataRoomByDormID, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const rows = dormitoryRoom.map(room => createData(room.room_id, room.dorm_id, room.room_number, room.bed_capacity))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/read/${router.query.id}`)
        const { data } = await response.json()
        if (data) {
          console.log('setDormitoryBuilding data:', data)
          setDormitoryBuilding(Array.isArray(data) ? data : [data])
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      } finally {
        setLoading(false)
      }
    }

    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [router.query.id])

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
  }

  return (
    <>
      <Backdrop
        open={loading}
        style={{ zIndex: 9999, color: '#fff', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress color='inherit' />
        <Typography variant='h6' style={{ marginTop: '20px' }}>
          Loading, please wait...
        </Typography>
      </Backdrop>
      {loading ? (
        <Typography variant='h1'>{loading ? <Skeleton /> : 'h1'}</Typography>
      ) : (
        <Card>
          <CardHeader
            title={`Edit Room - ${dormitoryBuilding.length > 0 ? dormitoryBuilding[0].name : ''}`}
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <CreateRoom
                setSnackbarOpen={setSnackbarOpen}
                id={dormitoryBuilding.length > 0 ? dormitoryBuilding[0].dorm_id : ''}
                dormitoryName={dormitoryBuilding.length > 0 ? dormitoryBuilding[0].name : ''}
              >
                <Button variant='contained' color='primary'>
                  Add Room
                </Button>
              </CreateRoom>
            }
          />
          <Divider sx={{ margin: 0 }} />
          <form onSubmit={handleFormSubmit}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Dorm ID</TableCell>
                    <TableCell>Room ID</TableCell>
                    <TableCell align='center'>Room Number</TableCell>
                    <TableCell align='center'>Bed Capacity</TableCell>
                    <TableCell align='center'>Setting</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <StyledTableRow key={row.room_id}>
                      <StyledTableCell component='th' scope='row'>
                        {dormitoryBuilding.length > 0 ? dormitoryBuilding[0]?.name : ''}
                      </StyledTableCell>
                      <StyledTableCell>{row.room_id}</StyledTableCell>
                      <StyledTableCell align='center'>{row.room_number}</StyledTableCell>
                      <StyledTableCell align='center'>{row.bed_capacity}</StyledTableCell>
                      <StyledTableCell align='center'>
                        <SettingRoom
                          id={row.room_id}
                          room_number={row.room_number}
                          dormitoryName={dormitoryBuilding.length > 0 ? dormitoryBuilding[0].name : ''}
                          setSnackbarDeleteRoom={setSnackbarDeleteRoom}
                        >
                          <Button>
                            <IoSettingsOutline size={25} />
                          </Button>
                        </SettingRoom>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ margin: 0 }} />
          </form>
        </Card>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`Create room in ${dormitoryBuilding.length > 0 ? dormitoryBuilding[0]?.name : ''} Successfully!`}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />
      <Snackbar
        open={snackbarDeleteRoom}
        autoHideDuration={5000}
        onClose={handleSnackbarDeleteRoomClose}
        message={
          <span>
            <ErrorIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {`Delete room in ${dormitoryBuilding.length > 0 ? dormitoryBuilding[0]?.name : ''} Successfully!`}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarDeleteRoomClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.error }}
      />
    </>
  )
}

export default EditRoom
