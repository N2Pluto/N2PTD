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
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import { useState } from 'react'
import AccountOutline from 'mdi-material-ui/AccountOutline'

import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'



export default function ReservationForm() {
  const [open, setOpen] = React.useState(false)
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm')
  const [student_year, setStudentYear] = useState<string[]>([])
  const [roundName, setRoundName] = useState('')
  const [gender, setGender] = useState('')
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)

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
  // Send a POST request to the API endpoint with the form data when the form is submitted
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
    // Handle the response
  }

  return (
    <React.Fragment>
      <Button
        variant='contained'
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onClick={handleClickOpen}
      >
        Add Round Dormitory
      </Button>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        <DialogContent>
          <Typography variant='h5'>Option</Typography>
          <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    style={{ width: '283px' }}
                    value={roundName}
                    onChange={handleRoundNameChange}
                    label='Round Name'
                    placeholder='รอบที่ 1 ผู้ชาย ปี1 เท่านั้น'
                  />
                </Grid> */}
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
                      <MenuItem value='2023'>2023</MenuItem>
                      <MenuItem value='2024'>2024</MenuItem>
                      <MenuItem value='2025'>2025</MenuItem>
                      <MenuItem value='2026'>2026</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-multiple-select-label'>Student Year</InputLabel>
                    <Select
                      multiple
                      value={student_year}
                      onChange={handleSelectChange}
                      id='form-layouts-separator-multiple-select'
                      labelId='form-layouts-separator-multiple-select-label'
                      input={<OutlinedInput label='Language' id='select-multiple-language' />}
                    >
                      <MenuItem value='1'>ปี 1</MenuItem>
                      <MenuItem value='2'>ปี 2</MenuItem>
                      <MenuItem value='3'>ปี 3</MenuItem>
                      <MenuItem value='4'>ปี 4</MenuItem>
                      <MenuItem value='5'>ปี 5</MenuItem>
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
