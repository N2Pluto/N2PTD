import React, { useState } from 'react'
import {
  Box,
  Button,
  Drawer,
  DialogProps,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  OutlinedInput,
  TextField,
  Grid,
  Card,
  Typography,
  CardContent,
  List,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import { makeStyles } from '@mui/styles'
import Divider from '@mui/material/Divider'

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
}))

export default function ReservationForm() {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [student_year, setStudentYear] = useState<string[]>([])
  const initialYears = [63, 64, 65, 66, 67, 68]
  const [years, setYears] = useState(initialYears)

  const [roundName, setRoundName] = useState('')
  const currentYear = new Date().getFullYear()
  const yearsAhead = 5 // Adjust this value to show more years
  const [gender, setGender] = useState('')
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const yearMenuItems = Array.from({ length: yearsAhead }, (_, index) => (
    <MenuItem key={index} value={currentYear + index}>
      {currentYear + index}
    </MenuItem>
  ))

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setDrawerOpen(open)
    if (!open) resetForm()
  }

  const resetForm = () => {
    setStudentYear([])
    setRoundName('')
    setStartDate(null)
    setEndDate(null)
    setGender('')
  }

  // Handle Select
  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setStudentYear(event.target.value as string[])
  }

  const addYear = () => {
    const maxYear = Math.max(...years)
    const newYear = maxYear + 1
    setYears([...years, newYear])
  }

  const MenuProps = {
    PaperProps: {},
    getContentAnchorEl: null, // This is important to make the footer stick to the bottom
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left'
    }
  }

  // Update state variables when the field values change
  const handleRoundNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoundName(event.target.value)
  }

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)
  }

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)
  }

  const handleGenderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGender(event.target.value as string)
  }

  const onClose = () => {
    setDrawerOpen(false)
  }

  // Send a POST request to the API endpoint with the form data when the form is submitted
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Ensure start_date is before end_date
    if (new Date(startDate) >= new Date(endDate)) {
      alert('Start date must be before end date.')
      return
    }

    const studentYearValue = student_year.length > 1 ? student_year.join(',') : student_year[0]

    // Check for duplicate dates
    const duplicateCheckResponse = await fetch('/api/admin/reservationSystem/create/checkDuplicateDate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate
      })
    })

    const duplicateCheckData = await duplicateCheckResponse.json()

    // If there is an active round, stop the function execution
    if (duplicateCheckData.error) {
      alert(duplicateCheckData.error)
      return
    }

    // If there are duplicate dates, stop the function execution
    if (duplicateCheckData.isDuplicate) {
      alert('The selected date range is already reserved.')
      return
    }

    // If there are no duplicate dates, proceed with creating the reservation
    const response = await fetch('/api/admin/reservationSystem/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        round_name: roundName,
        start_date: startDate,
        end_date: endDate,
        gender: gender,
        student_year: studentYearValue
      })
    })

    const data = await response.json()
    setDrawerOpen(false)
    setSnackbarOpen(true) // Show the Snackbar on success
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <React.Fragment>
      <Button
        variant='contained'
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onClick={toggleDrawer(true)}
      >
        Create Booking Period
      </Button>
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
            Create Booking Period
          </Typography>
          <IconButton onClick={toggleDrawer(false)}>
            {' '}
            <CloseIcon sx={{ pt: 2, fontSize: '35px' }} />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Typography variant='body2' sx={{ ml: 5, margin: 3 }}>
            {' '}
            You can create a booking period for your reservations. This feature allows you to specify the start and end
            dates, ensuring that your bookings are organized and manageable.
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
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-multiple-select-label'>Round</InputLabel>
                    <Select
                      value={roundName}
                      onChange={handleRoundNameChange}
                      id='form-layouts-separator-multiple-select'
                      labelId='form-layouts-separator-multiple-select-label'
                      input={<OutlinedInput label='Language' id='select-multiple-language' />}
                    >
                      {yearMenuItems}
                    </Select>
                    <Typography variant='caption' display='block' gutterBottom>
                      Select the Round name.
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-multiple-select-label'>Student Year</InputLabel>
                    <Select
                      multiple
                      value={student_year}
                      onChange={handleSelectChange}
                      id='form-layouts-separator-multiple-select'
                      labelId='form-layouts-separator-multiple-select-label'
                      input={<OutlinedInput label='Student Year' id='select-multiple-language' />}
                      MenuProps={MenuProps}
                      renderValue={selected => selected.join(', ')}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                      <List component='nav' style={{ padding: 0 }}>
                        <Button onClick={addYear} style={{ width: '100%' }}>
                          Add More
                        </Button>
                      </List>
                    </Select>
                    <Typography variant='caption' display='block' gutterBottom>
                      Select the Student Year.
                    </Typography>
                  </FormControl>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={12} sm={12}>
                    <DatePicker
                      label='Start Date'
                      value={startDate}
                      onChange={newValue => {
                        setStartDate(newValue)
                      }}
                      renderInput={params => <TextField {...params} />}
                      format='dd/MM/yyyy'
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                    <Typography variant='caption' display='block' gutterBottom>
                      Select the Start Date.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <DatePicker
                      label='End Date'
                      value={endDate}
                      onChange={newValue => {
                        setEndDate(newValue)
                      }}
                      renderInput={params => <TextField {...params} />}
                      format='dd/MM/yyyy'
                      renderInput={params => <TextField {...params} fullWidth />}
                    />
                    <Typography variant='caption' display='block' gutterBottom>
                      Select the End Date.
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
              <Button variant='contained' onClick={toggleDrawer(false)} sx={{ ml: -1 }}>
                Close
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button variant='contained' onClick={handleSubmit} sx={{ ml: -3 }}>
                Submit
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
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'Create Booking Period Successfully'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        ContentProps={{ className: classes.success }}
      />
    </React.Fragment>
  )
}
