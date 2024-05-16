// ** React Imports
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

import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import { CarBrakeFluidLevel } from 'mdi-material-ui'
import DatePicker from '@mui/lab/DatePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function DeleteRound({ id }: { id: number }) {
  const [open, setOpen] = React.useState(false)
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)
  const [student_year, setStudentYear] = useState<string[]>([])
  const [roundName, setRoundName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/admin/reservationSystem/read/${id}`)
      const data = await response.json()

      // Set the state variables with the fetched data
      setStartDate(new Date(data.data.start_date))
      setEndDate(new Date(data.data.end_date))
      setStudentYear(data.data.student_year.split(',').map(Number))
      setRoundName(data.data.round_name)
    }

    fetchData()
  }, [id])

  console.log('id', id)

  const handleUpdate = async () => {
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
      handleClose()
    } else {
      const responseData = await response.json()
      alert(responseData.error) // Show an alert with the error message
    }
  }

  const handleRoundNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoundName(event.target.value)
  }

  // Handle Select
  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setStudentYear(event.target.value as string[])
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
    setOpen(false)
  }

  console.log(id)

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
        <DialogTitle>{'Delete This Round?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>You Want to Delete This Round?</DialogContentText>
          <Card>
            <CardHeader title='Multi Column with Form Separator' titleTypographyProps={{ variant: 'h6' }} />
            <Divider sx={{ margin: 0 }} />
            <form onSubmit={e => e.preventDefault()}>
              <CardContent>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Divider sx={{ marginBottom: 0 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      2. Round Info
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      style={{ width: '283px' }}
                      value={roundName}
                      onChange={handleRoundNameChange}
                      label='Round Name'
                      placeholder='รอบที่ 1 ผู้ชาย ปี1 เท่านั้น'
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
                      >
                        <MenuItem value={1}>ปี 1</MenuItem>
                        <MenuItem value={2}>ปี 2</MenuItem>
                        <MenuItem value={3}>ปี 3</MenuItem>
                        <MenuItem value={4}>ปี 4</MenuItem>
                        <MenuItem value={5}>ปี 5</MenuItem>
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
