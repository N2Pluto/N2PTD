import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { userStore } from 'src/stores/userStore'
import Grid from '@mui/material/Grid'
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
import SuccessBarBed from './component'
import Allresult from '../result/result'

const ReservationBedviwe = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [userReservations, setUserReservations] = useState<{ [key: string]: any }>({})
  const [value, setValue] = useState<string>('1')
  const [open, setOpen] = useState(false)
  const [openAllResult, setOpenAllResult] = useState(false)
  const steps = ['Reservation', 'Building', 'Room', 'Bed']
  const [roundData, setRoundData] = useState(null)

  const userStoreInstance = userStore()
  const { user } = userStoreInstance

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

  const handleOpenAllResult = () => {
    setOpenAllResult(true)
  }

  const handleCloseAllResult = () => {
    setOpenAllResult(false)
  }

  const fetchData = async () => {
    const { data } = await fetch(`/api/bed/${router.query.id}`).then(res => res.json())
    setDormitoryBed(data)
  }

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData()])
    }
  }, [router.query.id])

  useEffect(() => {
    const fetchDataBedByRoomID = async () => {
      const { data } = await fetch(`/api/bed/room/${router.query.id}`).then(res => res.json())
      setDormitoryRoom(data)
    }
    const fetchDataAndUpdateStatus = async () => {
      await fetchDataBedByRoomID()
    }
    fetchDataAndUpdateStatus()

    const intervalId = setInterval(fetchDataAndUpdateStatus, 60000)

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
      } catch (error) {
        console.error('Error fetching round profile:', error)
      }
    }
    fetchRoundProfile()
  }, [])

  const handleReservation = async (bed_id: string) => {
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

      const checkBedResponse = await fetch(`/api/reservation/checkRepeat?bed_id=${bed_id}`)
      const { isReserved } = await checkBedResponse.json()

      if (isReserved) {
        handleOpen()
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
        setOpenAllResult(true)
      }
    } catch (error) {
      console.error('Error inserting data into Reservation table:', error.message)
    }
  }

  return (
    <>
      <SuccessBarBed />

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
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img2.pic.in.th/pic/profile_3135768.png'
                                    alt='School Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Info[0]?.name.slice(0, -3) + '***'}{' '}
                                    {reservation.Users?.Users_Info[0]?.lastname.replace(/./g, '*')}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/card_9199345.png'
                                    alt='School Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.student_id.replace(/(?<=..)....../, '******')}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/school_2602414.png'
                                    alt='School Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'> : {reservation.Users?.Users_Info[0]?.school}</Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/book_2232470.png'
                                    alt='Major Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Info[0]?.department}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/graduate_401672.png'
                                    alt='Major Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'> : {reservation.Users?.Users_Info[0]?.major}</Typography>
                                </Box>

                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/religion_9311967.png'
                                    alt='Religion Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Info[0]?.religion}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/time-management_2027497.png'
                                    alt='Activity Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Req[0]?.activity}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/flag_1452046.png'
                                    alt='Redflag Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'>
                                    {' '}
                                    : {reservation.Users?.Users_Req[0].filter_redflag}
                                  </Typography>
                                </Box>
                                <Box display='flex' alignItems='center' mb={2}>
                                  <img
                                    src='https://img5.pic.in.th/file/secure-sv1/bed-time_12178656.png'
                                    alt='Sleep Icon'
                                    style={{ width: '24px', height: '24px' }}
                                  />
                                  <Typography variant='body1'> : {reservation.Users?.Users_Req[0].sleep}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </CardContent>
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
          <DialogContentText id='alert-dialog-description'>THIS BED IS ALREADY RESERVED!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Accept</Button>
        </DialogActions>
      </Dialog>

      <Allresult open={openAllResult} handleClose={handleCloseAllResult} />
    </>
  )
}

export default ReservationBedviwe
