import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Paper from '@mui/material/Paper'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Snackbar from '@mui/material/Snackbar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { makeStyles } from '@mui/styles'
import sendLogsadmincreate from 'src/pages/api/log/admin/create/insert'
import { userStore } from 'src/stores/userStore'

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
}))

const RenewalForm = () => {
  const classes = useStyles()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [renewalName, setRenewalName] = useState('')
  const [renewalPhase, setRenewalPhase] = useState<number[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const { user } = userStore()

  const onClose = () => {
    setDrawerOpen(false)
  }

  const loguser = async () => {
    const content = `Creat "Renewal Period"  Round: '${renewalName}' Phase: '${renewalPhase}' start_date: '${startDate}' end_date: '${endDate}'`
    await sendLogsadmincreate(user?.student_id, content, 'Renewal Period')
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

  const handleRenewalNameChange = (event: SelectChangeEvent) => {
    setRenewalName(event.target.value as string)
  }

  const handleSelectChange = (event: SelectChangeEvent<typeof renewalPhase>) => {
    const {
      target: { value }
    } = event
    setRenewalPhase(typeof value === 'string' ? Number(value) : value)
  }

  const handleSubmit = async () => {
    // Check if startDate is less than endDate
    if (new Date(startDate) >= new Date(endDate)) {
      alert('Start date must be before end date.') // Or handle this error appropriately
      return // Exit the function to prevent the form submission
    }

    const response = await fetch('/api/admin/renewalDormitory/create/createRenewalForm', {
      method: 'POST',
      body: JSON.stringify({
        renewalName,
        renewalPhase,
        startDate,
        endDate
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      loguser()
      setSnackbarMessage('Create Renewal Period successfully!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      onClose() // Close the form or modal if the request is successful
    } else {
      setSnackbarMessage('Failed to Create Renewal Period. Please try again.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <>
      <Card>
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Renewal Period
          </Typography>
          <Typography variant='body2'>Click to Create Renewal Period. for Create a new Renewal Period</Typography>
        </CardContent>
        <Button
          variant='contained'
          sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          onClick={toggleDrawer(true)}
        >
          Create Renewal Period
        </Button>
      </Card>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '30%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ pb: 2, pt: 5, pr: 2, ml: 4 }}>
            Create Renewal Form
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon sx={{ pt: 2, fontSize: '35px' }} />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Typography variant='body2' sx={{ ml: 5, margin: 3 }}>
            Please fill out the form to indicate whether you wish to continue staying in the dormitory for the next
            academic term.
          </Typography>
          <Divider />
          <Box
            sx={{
              margin: 2,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              border: '1px dashed rgba(0, 0, 0, 0.12)' // Add this line
            }}
          >
            <Box sx={{ margin: 5 }}>
              <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-round-select-label'>Renewal</InputLabel>
                    <Select
                      value={renewalName}
                      onChange={handleRenewalNameChange}
                      id='form-layouts-separator-round-select'
                      labelId='form-layouts-separator-round-select-label'
                      input={<OutlinedInput label='Renewal' />}
                    >
                      {
                        // Dynamically generate MenuItem components for years
                        Array.from({ length: 4 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <MenuItem key={year} value={year.toString()}>
                            {year}
                          </MenuItem>
                        ))
                      }
                    </Select>
                    <Typography variant='caption' display='block' gutterBottom>
                      Select the renewal year for the dormitory stay.
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-phase-select-label'>Renewal Phase</InputLabel>
                    <Select
                      value={renewalPhase}
                      onChange={handleSelectChange}
                      id='form-layouts-separator-phase-select'
                      labelId='form-layouts-separator-phase-select-label'
                      input={<OutlinedInput label='Renewal Phase' />}
                    >
                      <MenuItem value={1}>ภาคเรียนที่ 1</MenuItem>
                      <MenuItem value={2}>ภาคเรียนที่ 2</MenuItem>
                      <MenuItem value={3}>ภาคเรียนที่ 3</MenuItem>
                    </Select>
                    <Typography variant='caption' display='block' gutterBottom>
                      Choose the academic term(s) for which you wish to renew your dormitory stay.
                    </Typography>
                  </FormControl>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={12}>
                    <DatePicker
                      label='Start Date'
                      value={startDate}
                      onChange={newValue => setStartDate(newValue)}
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                    <Typography variant='caption' display='block' gutterBottom>
                      Select the start date for the dormitory renewal period.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <DatePicker
                      label='End Date'
                      value={endDate}
                      onChange={newValue => setEndDate(newValue)}
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                    <Typography variant='caption' display='block' gutterBottom>
                      Select the end date for the dormitory renewal period.
                    </Typography>
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ padding: 3 }}>
          <Grid container spacing={4} alignItems='center' justifyContent='flex-end'>
            <Grid item xs={3}>
              <Button variant='contained' color='primary' fullWidth onClick={onClose} sx={{ ml: -1 }}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button variant='contained' color='primary' fullWidth onClick={handleSubmit} sx={{ ml: -3 }}>
                Apply
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={
          <Box display='flex' alignItems='center'>
            <CheckCircleIcon fontSize='small' style={{ marginRight: '8px' }} />
            {snackbarMessage}
          </Box>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        ContentProps={{ className: snackbarSeverity === 'success' ? classes.success : classes.error }}
      />
    </>
  )
}

export default RenewalForm
