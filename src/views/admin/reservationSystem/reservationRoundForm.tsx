import { ChangeEvent, forwardRef, MouseEvent, useState, useEffect } from 'react'
import * as React from 'react'
import {
  Button,
  Drawer,
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
  IconButton,
  Box,
  Divider
} from '@mui/material'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'
import DeleteIcon from '@mui/icons-material/Delete'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
}))

export default function DeleteRound({ id, setSnackbarOpen, setSnackbarMessage, setSnackbarSeverity }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)
  const [student_year, setStudentYear] = useState<string[]>([])
  const initialYears = [63, 64, 65, 66, 67, 68]
  const [years, setYears] = useState(initialYears)
  const [roundName, setRoundName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/admin/reservationSystem/read/${id}`)
      const data = await response.json()
      setStartDate(new Date(data.data.start_date))
      setEndDate(new Date(data.data.end_date))
      setStudentYear(data.data.student_year.split(',').map(Number))
      setRoundName(data.data.round_name)
    }
    fetchData()
  }, [id])

  const handleUpdate = async () => {
    if (new Date(startDate) >= new Date(endDate)) {
      alert('Start date must be less than end date.')
      return
    }
    const response = await fetch(`/api/admin/reservationSystem/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        start_date: startDate,
        end_date: endDate,
        student_year: student_year.join(','),
        round_name: roundName
      })
    })

    if (response.ok) {
      setSnackbarSeverity('success')
      setSnackbarMessage('Update Booking Period Successfully')
      setSnackbarOpen(true)
      handleClose()
    } else {
      const responseData = await response.json()
      alert(responseData.error)
    }
  }

  const handleRoundNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoundName(event.target.value)
  }

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
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left'
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = async () => {
    await fetch(`/api/admin/reservationSystem/delete/${id}`, {
      method: 'DELETE'
    })
    setSnackbarSeverity('error')
    setSnackbarMessage('Delete Booking Period Successfully')
    setSnackbarOpen(true)
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <TuneIcon />
      </Button>
      <Drawer
        anchor='right'
        open={open}
        onClose={handleClose}
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
            Edit Booking Period
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ pt: 2, fontSize: '35px' }} />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Typography variant='body2' sx={{ ml: 5, margin: 3 }}>
            You can update or delete the booking period for your reservations. This feature allows you to specify the
            start and end dates, ensuring that your bookings are organized and manageable.
          </Typography>
          <Divider />
          <Box
            sx={{
              margin: 2,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              border: '1px dashed rgba(0, 0, 0, 0.12)'
            }}
          >
            <Box sx={{ margin: 5 }}>
              <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    value={roundName}
                    onChange={handleRoundNameChange}
                    label='Round Name'
                    placeholder='รอบที่ 1 ผู้ชาย ปี1 เท่านั้น'
                    helperText='Enter the name of the reservation round.'
                  />
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
                    <Typography variant='caption' display='block' gutterBottom sx={{ marginLeft: '10px' }}>
                      Select the student year(s) that are eligible.
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
                      renderInput={params => (
                        <TextField
                          {...params}
                          helperText='Select the start date for the reservation round.'
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <DatePicker
                      label='End Date'
                      value={endDate}
                      onChange={newValue => {
                        setEndDate(newValue)
                      }}
                      renderInput={params => (
                        <TextField {...params} helperText='Select the end date for the reservation round.' fullWidth />
                      )}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ padding: 3 }}>
          <Grid container spacing={4} alignItems='center'>
            <Grid item xs={12} container justifyContent='space-between'>
              <Grid item>
                <Button variant='contained' onClick={handleDelete} color='error'>
                  Delete
                </Button>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant='contained' onClick={handleClose}>
                      Close
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant='contained' onClick={handleUpdate}>
                      Agree
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </React.Fragment>
  )
}
