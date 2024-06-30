import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import { DialogActions, DialogContent } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SuccessBarBed from './component'
import Allresult from '../result/result'
import { userStore } from 'src/stores/userStore'

const ReservationBedviwe = () => {
  const router = useRouter()
  const [dormitoryBed, setDormitoryBed] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [userReservations, setUserReservations] = useState<{ [key: string]: any }>({})
  const [openWarn, setOpenWarn] = useState(false)
  const [openAllResult, setOpenAllResult] = useState(false)
  const [roundData, setRoundData] = useState(null)
  const [expanded, setExpanded] = useState<string | false>(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null)

  const userStoreInstance = userStore()
  const { user } = userStoreInstance

  const handleChange = async (bedId: string) => {
    setExpanded(expanded === bedId ? false : bedId)
    if (!userReservations[bedId]) {
      const { data } = await fetch(`/api/reservation/checkUserReservBed?bed_id=${bedId}`).then(res => res.json())
      setUserReservations(prevReservations => ({ ...prevReservations, [bedId]: data }))
    }
  }

  console.log('userReservations5555',userReservations)

  const handleOpenWarn = () => {
    setOpenWarn(true)
  }

  const handleCloseWarn = () => {
    setOpenWarn(false)
  }

  const handleOpenAllResult = () => {
    setOpenAllResult(true)
  }

  const handleCloseAllResult = () => {
    setOpenAllResult(false)
  }

  const handleOpenConfirmation = (bedId: string) => {
    setSelectedBedId(bedId)
    setConfirmationOpen(true)
  }

  const handleCloseConfirmation = () => {
    setSelectedBedId(null)
    setConfirmationOpen(false)
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

  const handleReservation = async () => {
    try {
      if (!user || !selectedBedId) {
        console.error('User data or bed ID is missing.')

        return
      }

      const checkResponse = await fetch(`/api/reservation/checkReservation?user_id=${user.user_id}`)
      const { hasReservation } = await checkResponse.json()

      if (hasReservation) {
        handleOpenWarn()
        handleCloseConfirmation()

        return
      }

      const checkBedResponse = await fetch(`/api/reservation/checkRepeat?bed_id=${selectedBedId}`)
      const { isReserved } = await checkBedResponse.json()

      if (isReserved) {
        handleOpenWarn()
        handleCloseConfirmation()

        return
      }

      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.user_id,
          bed_id: selectedBedId,
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
      handleCloseConfirmation()
    } catch (error) {
      console.error('Error inserting data into Reservation table:', error.message)
      handleCloseConfirmation()
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

      <Grid container spacing={0}>
        {dormitoryRoom.map((room, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ maxWidth: '90%' }}>
              <Box>
                <img
                  height='100%'
                  width='100%'
                  src={`https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/bedimg/be${index + 1}.png`}
                  alt={`Bed Image ${index + 1}`}
                />
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    {room.bed_status ? (
                      <Button onClick={() => handleOpenConfirmation(room.bed_id)} variant='contained'>
                        Select
                      </Button>
                    ) : (
                      <Button onClick={handleOpenWarn} variant='contained' disabled>
                        Close
                      </Button>
                    )}
                  </Box>
                  {!room.bed_status && (
                    <IconButton onClick={() => handleChange(room.bed_id)} sx={{ alignSelf: 'flex-end' }}>
                      {expanded === room.bed_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  )}
                </Box>
                <Collapse in={expanded === room.bed_id}>
                  <Box mt={2}>
                    {userReservations[room.bed_id] &&
                      userReservations[room.bed_id].map((reservation, index) => (
                        <Grid sx={{ marginTop: 5 }} key={index}>
                          <Grid container spacing={6}>
                            <Grid item xs={12}>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img2.pic.in.th/pic/profile_3135768.png'
                                  alt='School Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Info[0]?.name.slice(0, -3) + '***'}{' '}
                                    {reservation.Users?.Users_Info[0]?.lastname.replace(/./g, '*')}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/card_9199345.png'
                                  alt='School Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.student_id.replace(/(?<=..)....../, '******')}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/school_2602414.png'
                                  alt='School Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Info[0]?.school}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/book_2232470.png'
                                  alt='Major Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Info[0]?.department}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/graduate_401672.png'
                                  alt='Major Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Info[0]?.major}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/religion_9311967.png'
                                  alt='Religion Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Info[0]?.religion}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/time-management_2027497.png'
                                  alt='Activity Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Req[0]?.activity}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/flag_1452046.png'
                                  alt='Redflag Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Req[0].filter_redflag}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display='flex' alignItems='flex-start' mb={2}>
                                <img
                                  src='https://img5.pic.in.th/file/secure-sv1/bed-time_12178656.png'
                                  alt='Sleep Icon'
                                  style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                />
                                <Box display='flex' flexDirection='column' justifyContent='center'>
                                  <Typography variant='body1' sx={{ fontSize: '0.85rem' }}>
                                    : {reservation.Users?.Users_Req[0].sleep}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openWarn}
        onClose={handleCloseWarn}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Warn'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>THIS BED IS ALREADY RESERVED!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarn}>Accept</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby='confirmation-dialog-title'
        aria-describedby='confirmation-dialog-description'
      >
        <DialogTitle id='confirmation-dialog-title'>{'Confirm Reservation'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='confirmation-dialog-description'>
            Are you sure you want to reserve this bed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={handleReservation} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Allresult open={openAllResult} handleClose={handleCloseAllResult} />
    </>
  )
}

export default ReservationBedviwe
