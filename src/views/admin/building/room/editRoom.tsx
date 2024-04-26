// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { IoSettingsOutline } from 'react-icons/io5'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import SettingRoom from './settingRoom'
import CreateRoom from './createRoom'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

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

function createData(
  room_id: number,
  dorm_id: number,
  room_number: number,
  bed_capacity: number
) {
  return { room_id, dorm_id, room_number, bed_capacity }
}



const furnitureOptions = [
  { title: 'closet' },
  { title: '3.5-foot mattress' },
  { title: 'reading desk' },
  { title: 'chair' }
]

const facilityOptions = [
  { title: 'high-speed internet' },
  { title: 'washing machine' },
  { title: 'clothes dryer' },
  { title: 'water dispenser' },
  { title: 'fingerprint access system' },
  { title: 'CCTV' },
  { title: '7-11 Automatic Food Cabinet' }
]

const EditRoom = () => {
  // ** States
 
  const [floor, setFloor] = useState('')
  const [bedCapacity, setBedCapacity] = useState('')
  const [roomsPerFloor, setRoomsPerFloor] = useState<string[]>([])
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const router = useRouter()

 useEffect(() => {
   const fetchDataRoomByDormID = async () => {
     console.log('router.query.id:', router.query.id)
     const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
     setDormitoryRoom(data)
     console.log('data:', data)
   }

   const intervalId = setInterval(fetchDataRoomByDormID, 5000) // Fetch data every 5 seconds

   return () => clearInterval(intervalId) // Clean up the interval on component unmount
 }, [])

   const rows = dormitoryRoom.map(room => createData(room.room_id, room.dorm_id, room.room_number, room.bed_capacity))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dorm_id = router.query.id
        const { data } = await fetch(`/api/admin/read/${dorm_id}`).then(res => res.json())
        if (data) {
          setDormitoryBuilding(Array.isArray(data) ? data : [data])
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    const intervalId = setInterval(fetchData, 5000) // Fetch data every 5 seconds

    return () => clearInterval(intervalId) // Clean up the interval on component unmount
  }, [])

 
  const handleRoomsChange = (index: number, value: string) => {
    const newRoomsPerFloor = [...roomsPerFloor]
    newRoomsPerFloor[index] = value
    setRoomsPerFloor(newRoomsPerFloor)
  }

  const generateRoomNumbers = () => {
    const roomNumbers: string[] = []
    let floorNumber = 1
    for (const rooms of roomsPerFloor) {
      for (let i = 1; i <= parseInt(rooms, 10); i++) {
        const roomNumber = `${floorNumber}${String(i).padStart(2, '0')}`
        roomNumbers.push(roomNumber)
      }
      floorNumber++
    }

    return roomNumbers
  }

  const handleFloorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFloor(event.target.value as string)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
  }

  const handleToSetting = (event: MouseEvent) => {
    router.push('/admin/building/editBuilding')
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Form for Edit Room'
          titleTypographyProps={{ variant: 'h6' }}
          action={
            <CreateRoom id={dormitoryBuilding.dorm_id}>
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
                  <StyledTableCell>Dorm ID</StyledTableCell>
                  <StyledTableCell align='right'>Room ID</StyledTableCell>
                  <StyledTableCell align='right'>Room Number</StyledTableCell>
                  <StyledTableCell align='right'>Bed Capacity</StyledTableCell>
                  <StyledTableCell align='right'>Setting</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <StyledTableRow key={row.room_id}>
                    <StyledTableCell component='th' scope='row'>
                      {row.dorm_id}
                    </StyledTableCell>
                    <StyledTableCell align='right'>{row.room_id}</StyledTableCell>
                    <StyledTableCell align='right'>{row.room_number}</StyledTableCell>
                    <StyledTableCell align='right'>{row.bed_capacity}</StyledTableCell>
                    <StyledTableCell align='right'>
                      <SettingRoom id={row.room_id}>
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
    </>
  )
}

export default EditRoom 
