import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { userStore } from 'src/stores/userStore'
import Grid, { GridProps } from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import { DialogActions, DialogContent } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
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

const ReservationBedDetails = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [userReservations, setUserReservations] = useState<{ [key: string]: any }>({})

  const userStoreInstance = userStore()
  const { user, setUser } = userStoreInstance
  const [value, setValue] = useState<string>('1')
  const [open, setOpen] = useState(false)

  const handleChange = async (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)

    if (!userReservations[newValue]) {
      const { data } = await fetch(`/api/reservation/checkUserReservBed?bed_id=${newValue}`).then(res => res.json())
      setUserReservations(prevReservations => ({ ...prevReservations, [newValue]: data }))
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/bed/${router.query.id}`).then(res => res.json())
    setDormitoryBed(data)
  }

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData()])
    }
  }, [fetchData, router.query.id])

  useEffect(() => {
    const fetchDataBedByRoomID = async () => {
      console.log('router.query.id:', router.query.id)
      const { data } = await fetch(`/api/bed/room/${router.query.id}`).then(res => res.json())
      setDormitoryRoom(data)
    }
    const fetchDataAndUpdateStatus = async () => {
      await fetchDataBedByRoomID() // Fetch the updated data
    }
    fetchDataAndUpdateStatus()
    const intervalId = setInterval(fetchDataAndUpdateStatus, 50000)

    return () => clearInterval(intervalId)
  }, [router.query.id])

  const handleReservation = async (bed_id: string) => {
    console.log('Reservation Bed ID:', bed_id)

    try {
      if (!user) {
        console.error('User data is missing.')

        return
      }

      const checkResponse = await fetch(`/api/reservation/checkReservation?user_id=${user.user_id}`)
      const { hasReservation } = await checkResponse.json()

      if (hasReservation) {
        handleOpen()

        return
      }

      const handleClickOpen = () => {
        setOpen(true)
      }

      const checkBedResponse = await fetch(`/api/reservation/checkRepeat?bed_id=${bed_id}`)
      const { isReserved } = await checkBedResponse.json()

      if (isReserved) {
        handleClickOpen()

        return
      }
    } catch (error) {
      console.error('Error inserting data into Reservation table:', error.message)
    }
  }
  console.log('dormitoryRoom:', dormitoryRoom)

  return (
    <>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ pb: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, color: 'text.primary' }} variant='body2'>
                Dormitory
              </Typography>

              <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3, color: 'text.primary' }} variant='body2'>
                Building
              </Typography>

              <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3 ,color: 'text.primary'}} variant='body2'>
                Room
              </Typography>
              <FiberManualRecordIcon sx={{ fontSize: '5px' }} />

              <Typography sx={{ whiteSpace: 'nowrap', pr: 3, pl: 3 }} variant='body2'>
                Bed
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid pb={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ marginBottom: 2 }}>
              Select Bed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Card>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='card navigation example'>
            {dormitoryRoom.map((room, index) => (
              <Tab key={index} value={room.bed_id.toString()} label={`Bed ${room.bed_number}`} />
            ))}
          </TabList>

          <CardContent>
            {dormitoryRoom.map((room, index) => (
              <TabPanel key={index} value={room.bed_id.toString()} sx={{ p: 0 }}>
                <Box>
                  <Typography variant='body2' sx={{ marginBottom: 2 }}>
                    Bed ID: {room.bed_id}
                  </Typography>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    Bed Number: {room.bed_number}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 4 }}>
                    Bed Status: {room.bed_status ? <CheckIcon /> : <CloseIcon />}
                  </Typography>
                  {userReservations[room.bed_id] &&
                    userReservations[room.bed_id].map((reservation, index) => (
                      <Typography key={index} variant='body2' sx={{ marginBottom: 2 }}>
                        <Box>
                          <Typography variant='body2' sx={{ marginBottom: 2 }}>
                            Student_Year: {reservation.Users?.student_year}
                          </Typography>
                          <Typography variant='body2' sx={{ marginBottom: 2 }}>
                            Course: {reservation.Users?.course}
                          </Typography>
                          <Typography variant='body2' sx={{ marginBottom: 2 }}>
                            Region: {reservation.Users?.region}
                          </Typography>
                          <Typography variant='body2' sx={{ marginBottom: 2 }}>
                            Religion: {reservation.Users?.religion}
                          </Typography>
                        </Box>
                      </Typography>
                    ))}
                </Box>
              </TabPanel>
            ))}
          </CardContent>
        </TabContext>
      </Card>
    </>
  )
}

export default ReservationBedDetails
