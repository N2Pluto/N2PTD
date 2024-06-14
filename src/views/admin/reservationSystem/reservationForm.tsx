// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent } from 'react'
import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useState } from 'react'
import List from '@mui/material/List'

import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

export default function ReservationForm() {
  const [open, setOpen] = React.useState(false)
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
  const [student_year, setStudentYear] = useState<string[]>([])
  const initialYears = [63, 64, 65, 66, 67, 68]
  const [years, setYears] = useState(initialYears)

  const [roundName, setRoundName] = useState('')
  const currentYear = new Date().getFullYear()
  const yearsAhead = 5 // Adjust this value to show more years
  const [gender, setGender] = useState('')
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)

  const yearMenuItems = Array.from({ length: yearsAhead }, (_, index) => (
    <MenuItem key={index} value={currentYear + index}>
      {currentYear + index}
    </MenuItem>
  ))

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    resetForm()
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
    handleClose()
  }

  return (
    <React.Fragment>
      <Button
        variant='contained'
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onClick={handleClickOpen}
      >
        Create Booking Period
      </Button>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        <DialogContent>
          <Typography variant='h5'>Create Booking Period</Typography>
          <DialogContentText>
            You can create a booking period for your reservations. This feature allows you to specify the start and end
            dates, ensuring that your bookings are organized and manageable.
          </DialogContentText>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                  </FormControl>
                </Grid>

                <Grid item xs={6} sm={6}>
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
                  </FormControl>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label='Start Date'
                      value={startDate}
                      onChange={newValue => {
                        setStartDate(newValue)
                      }}
                      renderInput={params => <TextField {...params} />}
                      format='dd/MM/yyyy'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label='End Date'
                      value={endDate}
                      onChange={newValue => {
                        setEndDate(newValue)
                      }}
                      renderInput={params => <TextField {...params} />}
                      format='dd/MM/yyyy'
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
