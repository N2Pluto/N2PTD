import { ChangeEvent, forwardRef, MouseEvent, useState } from 'react'
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import TuneIcon from '@mui/icons-material/Tune'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { useEffect } from 'react'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import List from '@mui/material/List'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
}))

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{'Round Info'}</DialogTitle>
        <DialogContent>
          <Card>
            <form onSubmit={e => e.preventDefault()}>
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      2. Round Info
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      style={{ width: '250px' }}
                      value={roundName}
                      onChange={handleRoundNameChange}
                      label='Round Name'
                      placeholder='รอบที่ 1 ผู้ชาย ปี1 เท่านั้น'
                    />
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
                      />
                    </Grid>
                  </LocalizationProvider>
                </Grid>
              </CardContent>
              <Divider sx={{ margin: 0 }} />
            </form>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleUpdate}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
