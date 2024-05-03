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
import BedroomParentIcon from '@mui/icons-material/BedroomParent'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'
import BedIcon from '@mui/icons-material/Bed'
import {
  DialogActions,
  DialogContent,
  Stack,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  stepConnectorClasses
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import VideoLabelIcon from '@mui/icons-material/VideoLabel'
import SchoolIcon from '@mui/icons-material/School'
import MosqueIcon from '@mui/icons-material/Mosque'
import PoolIcon from '@mui/icons-material/Pool'
import DangerousIcon from '@mui/icons-material/Dangerous'
import HotelIcon from '@mui/icons-material/Hotel'
import ConstructionIcon from '@mui/icons-material/Construction'
import SuccessฺฺBarBed from './component'

const ReservationBedviwe = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [userReservations, setUserReservations] = useState<{ [key: string]: any }>({})

  const userStoreInstance = userStore()
  const { user, setUser } = userStoreInstance
  const [value, setValue] = useState<string>('1')
  const [open, setOpen] = useState(false)
  const steps = ['Reservation', 'Building', 'Room', 'Bed']
  const [roundData, setRoundData] = useState(null)

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

   useEffect(() => {
     const fetchRoundProfile = async () => {
       try {
         const response = await fetch('/api/reservation/fetchRoundProfile', {
           method: 'GET'
         })
         const data = await response.json()
         setRoundData(data)
         console.log('Round Info', data)
       } catch (error) {
         console.error('Error fetching round profile:', error)
       }
     }
     fetchRoundProfile()
   }, [])


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

      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.user_id,
          bed_id: bed_id,
          round_id: roundData?.data?.id
        })
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error inserting data into Reservation table:', error.message)
      } else {
        console.log('Data inserted successfully:', data)

        router.push(`/reservation/result/${user.user_id}`)
      }
    } catch (error) {
      console.error('Error inserting data into Reservation table:', error.message)
    }
  }
  console.log('dormitoryRoom:', dormitoryRoom)

  return (
    <>
      <SuccessฺฺBarBed />

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
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    Bed Number: {room.bed_number}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 4 }}>
                    Bed Status: {room.bed_status ? <CheckIcon /> : <CloseIcon />}
                  </Typography>
                  {userReservations[room.bed_id] &&
                    userReservations[room.bed_id].map((reservation, index) => (
                      <CardContent sx={{ margin: 0 }} key={index}>
                        <Card sx={{ margin: 5 }} key={index}>
                          <CardContent>
                            <Grid container spacing={6}>
                              <Grid item xs={12}>
                                <Box display='flex' alignItems='center'>
                                  <SchoolIcon sx={{ pr: 2 }} />
                                  <Typography variant='body1'> : {reservation.Users?.school}</Typography>
                                </Box>
                                <Box display='flex' alignItems='center'>
                                  <SchoolIcon sx={{ pr: 2 }} />
                                  <Typography variant='body1'> : {reservation.Users?.major}</Typography>
                                </Box>
                                <Box display='flex' alignItems='center'>
                                  <MosqueIcon sx={{ pr: 2 }} />
                                  <Typography variant='body1'> : {reservation.Users?.religion}</Typography>
                                </Box>
                                <Box display='flex' alignItems='center'>
                                  <PoolIcon sx={{ pr: 2 }} />
                                  <Typography variant='body1'> : {reservation.Users?.activity}</Typography>
                                </Box>
                                <Box display='flex' alignItems='center'>
                                  <DangerousIcon sx={{ pr: 2 }} />
                                  <Typography variant='body1'> : {reservation.Users?.filter_redflag}</Typography>
                                </Box>
                                <Box display='flex' alignItems='center'>
                                  <HotelIcon sx={{ pr: 2 }} />
                                  <Typography variant='body1'> : {reservation.Users?.sleep}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </CardContent>

                      // <Typography key={index} variant='body2' sx={{ marginBottom: 2 }}>
                      //   <Box>
                      //     <Typography variant='body2' sx={{ marginBottom: 2 }}>
                      //       Student_Year: {reservation.Users?.student_year}
                      //     </Typography>
                      //     <Typography variant='body2' sx={{ marginBottom: 2 }}>
                      //       Course: {reservation.Users?.course}
                      //     </Typography>
                      //     <Typography variant='body2' sx={{ marginBottom: 2 }}>
                      //       Religion: {reservation.Users?.religion}
                      //     </Typography>
                      //   </Box>
                      // </Typography>
                    ))}

                  <Box
                    sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', pt: 5 }}
                  >
                    {room.bed_status ? (
                      <Button onClick={() => handleReservation(room.bed_id)} variant='contained'>
                        Select!
                      </Button>
                    ) : (
                      <Button onClick={handleOpen} variant='contained' disabled>
                        Select!
                      </Button>
                    )}
                  </Box>
                </Box>
              </TabPanel>
            ))}
          </CardContent>
        </TabContext>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Warn'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>THIS BED IS ALREADY RESERVE!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>accept</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ReservationBedviwe
