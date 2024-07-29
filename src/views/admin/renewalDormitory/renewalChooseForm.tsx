import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { userStore } from 'src/stores/userStore'
import { Avatar } from '@mui/material'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import Confetti from 'react-confetti'
import Countdown from 'react-countdown'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { makeStyles } from '@mui/styles'
import sendLogsuser from 'src/pages/api/log/user/reservation/insert'

const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  success: {
    backgroundColor: theme.palette.success.dark
  }
}))

const RenewalChooseForm = () => {
  const { user } = userStore()
  const classes = useStyles()
  const [userRenewal, setUserRenewal] = useState('')
  const [formData, setFormData] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const userStoreInstance = userStore()
  const [userExistsInRenewalDormitory, setUserExistsInRenewalDormitory] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const loguser = async (rw: string) => {
    let content = '';
    if (rw === 'stay') {
      content = 'sent a renewal form';
    } else if (rw === 'leave') {
      content = 'sent a leave form';
    }

    await sendLogsuser(user?.student_id, user?.email, content, 'Renewal');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/renewalDormitory/read/fetchFormByDate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userStoreInstance.user.user_id })
        })
        const data = await response.json()
        setFormData(data)

        // Check if user exists in Renewal_Dormitory
        if (data.renewalData && data.renewalData.length > 0) {
          setUserExistsInRenewalDormitory(true)
        } else {
          setUserExistsInRenewalDormitory(false)
        }
      } catch (error) {
        console.error('Failed to fetch form data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const handleUserRenewalChange = (event: SelectChangeEvent) => {
    setUserRenewal(event.target.value as string)
  }

  const handleSubmit = async () => {
    if (
      formData &&
      formData.data &&
      formData.data.length > 0 &&
      formData.residentData &&
      formData.residentData.length > 0
    ) {
      try {
        const response = await fetch('/api/admin/renewalSystem/create/', {
          method: 'PUT', // change from 'POST' to 'PUT'
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userRenewal,
            residentData: formData.residentData[0]
          })
        })
        if (response.ok) {
          loguser(userRenewal)
          setDrawerOpen(false)
          setSnackbarMessage('Data updated successfully')
          setSnackbarSeverity('success')
          setSnackbarOpen(true)
        } else {
          console.error('Failed to update data')
          setSnackbarMessage('Failed to update data')
          setSnackbarSeverity('error')
          setSnackbarOpen(true)
        }
      } catch (error) {
        console.error('Error updating data:', error)
        setSnackbarMessage('Error updating data')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setDrawerOpen(open)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>Time is up!</span>
    } else {
      return (
        <div className='countdown'>
          <div className='countdown-item'>
            <span className='countdown-time'>{days}</span>
            <span className='countdown-label'>Days</span>
          </div>
          <div className='countdown-item'>
            <span className='countdown-time'>{hours}</span>
            <span className='countdown-label'>Hours</span>
          </div>
          <div className='countdown-item'>
            <span className='countdown-time'>{minutes}</span>
            <span className='countdown-label'>Minutes</span>
          </div>
          <div className='countdown-item'>
            <span className='countdown-time'>{seconds}</span>
            <span className='countdown-label'>Seconds</span>
          </div>
        </div>
      )
    }
  }

  const renderButton = () => {
    if (formData && formData.data && formData.data.length > 0) {
      const endDate = new Date(formData.data[0].end_date)

      return (
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
            }}
          >
            <Avatar
              sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
            >
              <PriorityHighIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
              Very important!
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2 }}>
              Every semester a stay-on questionnaire will be filled out for ease of use.
              <br />
              Please respond within{' '}
              <b>
                {new Date(formData.data[0].start_date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })}
              </b>{' '}
              to{' '}
              <b>
                {new Date(formData.data[0].end_date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })}
              </b>
              . Please ensure to submit your decision within this period.
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 2, cursor: 'pointer' }} onClick={() => setConfetti(true)}>
              <Countdown date={endDate} renderer={renderer} />
            </Typography>
            <Button
              variant='contained'
              sx={{ padding: theme => theme.spacing(1.75, 5.5), mt: 5 }}
              onClick={toggleDrawer(true)}
            >
              OPEN FORM
            </Button>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <>
      {!userExistsInRenewalDormitory && <>{renderButton()}</>}

      {confetti && <Confetti recycle={false} numberOfPieces={500} onConfettiComplete={() => setConfetti(false)} />}

      <Drawer
        anchor='bottom'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%',
            height: '35%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ width: 'auto', padding: 2 }} role='presentation'>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              {formData && formData.data && formData.data.length > 0 && (
                <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    Dormitory Renewal Form - Semester {formData.data[0].renewal_phase}, {formData.data[0].renewal_name}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 1 }}>
                    We kindly request you to indicate your intention to continue residing in the dormitory for the
                    upcoming term.
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 2 }}>
                    Please note that the renewal form will be available from{' '}
                    <b>
                      {new Date(formData.data[0].start_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </b>{' '}
                    to{' '}
                    <b>
                      {new Date(formData.data[0].end_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </b>
                    . Please ensure to submit your decision within this period.
                  </Typography>
                </CardContent>
              )}
              <IconButton
                edge='end'
                color='inherit'
                onClick={toggleDrawer(false)}
                aria-label='close'
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FormControl fullWidth>
                  <InputLabel id='user-renewal-select-label'>Stay Decision</InputLabel>
                  <Select
                    value={userRenewal}
                    onChange={handleUserRenewalChange}
                    id='user-renewal-select'
                    labelId='user-renewal-select-label'
                    input={<OutlinedInput label='Stay Decision' />}
                  >
                    <MenuItem value='stay'>Continue residing in this dormitory next semester</MenuItem>
                    <MenuItem value='leave'>Do not continue residing in this dormitory next semester</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent='center' sx={{ marginTop: 2 }}>
              <Grid item>
                <Button variant='contained' color='primary' onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {snackbarMessage}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseSnackbar}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />
    </>
  )
}

export default RenewalChooseForm
