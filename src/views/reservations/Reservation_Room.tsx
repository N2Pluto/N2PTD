import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { CardHeader, Collapse, Divider, Grid, Paper, Stack, Step, StepConnector, StepLabel, Stepper, Table, TableCell, TableContainer, TableHead, stepConnectorClasses } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'

import TablePagination from '@mui/material/TablePagination'
import { auto } from '@popperjs/core'
import { userStore, IUser } from 'src/stores/userStore'
import { Refresh } from 'mdi-material-ui'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import Tooltip from '@mui/material/Tooltip'
import SettingsIcon from '@mui/icons-material/Settings'
import { Theme, styled } from '@mui/material/styles'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import BedIcon from '@mui/icons-material/Bed';
import BedroomParentIcon from '@mui/icons-material/BedroomParent'

const StyledGrid = styled(Grid)<GridProps>(({ theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('md')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

interface Column {
  id: 'room' | 'code' | 'details' | 'bedstatus'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'room', label: 'room', minWidth: 30, align: 'center' },
  { id: 'code', label: 'bed capacity', minWidth: 150, align: 'center' },
  {
    id: 'bedstatus',
    label: 'bed status',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'details',
    label: 'details',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toFixed(2)
  }
]

const ReservationRoomTest = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [dormitoryRoomStatus, setDormitoryRoomStatus] = useState([])
  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance
  const steps = ['Reservation', 'Building', 'Room' ,'Bed']

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1
    }
  }))



  const ColorlibStepIconRoot = styled('div')<{ theme: Theme
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props

    const icons: { [index: string]: React.ReactElement } = {
      1: <SettingsIcon />,
      2: <CorporateFareIcon />,
      3: <BedroomParentIcon />,
      4: <BedIcon />
    }

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    )
  }


  useEffect(() => {
    const fetchDataRoomStatus = async () => {
      try {
        const dorm_id = router.query.id // Add the missing declaration for dorm_id
        const response = await fetch(`/api/reservation/checkStatusRoom?dorm_id=${dorm_id}`)
        const data = await response.json()
        setDormitoryRoomStatus(data)
        console.log('data bed capacity:', data)
      } catch (error) {
        console.error('Error fetching room status:', error)
      }
    }
    const fetchDataAndUpdateStatus = async () => {
      await fetchDataRoomStatus() // Fetch the updated data
    }

    fetchDataAndUpdateStatus()
    const intervalId = setInterval(fetchDataAndUpdateStatus, 1000)

    return () => clearInterval(intervalId)
  }, []) // Remove dormitoryRoomStatus from dependencies

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData()])
    }
  }, [router.query.id])

  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
    setDormitoryBuilding(data)
  }

  useEffect(() => {
    const fetchDataRoomByDormID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
      setDormitoryRoom(data)
      console.log('data:', data)
    }

    const fetchDataAndUpdateStatusRoom = async () => {
      await fetchDataRoomByDormID() // Fetch the updated data
    }

    fetchDataAndUpdateStatusRoom()
    const intervalId = setInterval(fetchDataAndUpdateStatusRoom, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleReservation = (room_id: string) => {
    console.log('Reservation ROOM :', room_id)
    setUser({ ...userStoreInstance.user, room_id }) // Store room_id in userStore
    console.log('user:', userStoreInstance.user)
    router.push(`/reservation/bed/${room_id}`)
  }

  return (
    <>
    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
          <Card>
            <CardContent>
              <Stack sx={{ width: '100%' }} spacing={4}>
                <Stepper alternativeLabel activeStep={2} connector={<ColorlibConnector />}>
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
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
                  <TableCell align='center'>{room.room_number}</TableCell>
                  <TableCell align='center'>
                    {Array.from({ length: room.bed_available }, (_, index) => (
                      <Tooltip title='Booking information goes here' key={index}>
                        <PersonIcon color='primary' />
                      </Tooltip>
                    ))}

                    {Array.from({ length: room.bed_capacity - room.bed_available }, (_, index) => (
                      <Tooltip title='no information ' key={index}>
                        <PersonIcon />
                      </Tooltip>
                    ))}
                  </TableCell>
                  <TableCell align='center'>{room.status ? <CheckIcon /> : <CloseIcon color='primary' />}</TableCell>
                  <TableCell align='center'>
                    <Box>
                      {room.status ? (
                        <Button onClick={() => handleReservation(room.room_id)} variant='contained'>
                          Select
                        </Button>
                      ) : (
                        <Button variant='contained' color='error' disabled>
                          Select
                        </Button>
                      )}
                    </Box>
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
