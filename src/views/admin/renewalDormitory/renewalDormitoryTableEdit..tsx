import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@mui/styles'
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
import TuneIcon from '@mui/icons-material/Tune'
import Snackbar from '@mui/material/Snackbar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import sendLogsadmincreate from 'src/pages/api/log/admin/create/insert'
import { userStore } from 'src/stores/userStore'
import Alert from '@mui/material/Alert'

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  }
}))

const RenewalFormEdit = ({ id, showSnackbar }) => {
  const classes = useStyles()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [renewalName, setRenewalName] = useState('')
  const [renewalPhase, setRenewalPhase] = useState<string[]>([])
  const { user } = userStore()
  const [errorMessage, setErrorMessage] = useState('')

  const loguserdelete = async () => {
    const content = `Delete "Renewal Period"  Round: '${renewalName}' Phase: '${renewalPhase}' start_date: '${startDate}' end_date: '${endDate}'`
    await sendLogsadmincreate(user?.student_id, content, 'Renewal Period')
  }

  const loguseredit = async () => {
    const content = `Edit "Renewal Period"  Round: '${renewalName}' Phase: '${renewalPhase}' start_date: '${startDate}' end_date: '${endDate}'`
    await sendLogsadmincreate(user?.student_id, content, 'Renewal Period')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/renewalDormitory/read/readByID/${id}`)
        const result = await response.json()
        if (response.ok) {
          const data = result.data
          setRenewalName(data.renewal_name || '')
          setRenewalPhase(data.renewal_phase ? [`ภาคเรียนที่ ${data.renewal_phase}`] : [])
          setStartDate(data.start_date ? new Date(data.start_date) : null)
          setEndDate(data.end_date ? new Date(data.end_date) : null)
        } else {
          console.error('Failed to fetch data:', result.error)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [id])

  const onClose = () => {
    setDrawerOpen(false)
    setErrorMessage('')
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
    setRenewalPhase(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSubmit = async () => {
    try {
      // Convert startDate and endDate to Date objects for comparison
      const start = new Date(startDate)
      const end = new Date(endDate)

      // Check if start_date is less than end_date
      if (start >= end) {
        setErrorMessage('Start date must be before end date.') // Or handle this error appropriately
        return // Stop execution if the condition is not met
      }

      const duplicateCheckResponse = await fetch('/api/admin/renewalDormitory/create/checkEditDate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          start_date: startDate,
          end_date: endDate
        })
      })

      const duplicateCheckData = await duplicateCheckResponse.json()

      if (duplicateCheckData.error) {
        setErrorMessage('Failed to check for duplicate dates. Please try again.') // Or handle this error appropriately
        return // Exit the function to prevent the form submission
      }

      // If there are duplicate dates, stop the function execution
      if (duplicateCheckData.isDuplicate) {
        setErrorMessage('Failed to Update Form. The selected date range is already reserved.')
        return
      }

      const response = await fetch(`/api/admin/renewalDormitory/updateByID/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          renewal_name: renewalName,
          renewal_phase: renewalPhase.length ? renewalPhase[0].replace('ภาคเรียนที่ ', '') : '',
          start_date: startDate ? startDate.toISOString() : null,
          end_date: endDate ? endDate.toISOString() : null
        })
      })
      const result = await response.json()
      if (response.ok) {
        loguseredit()
        showSnackbar('Update successful', classes.success)
        onClose() // Assuming onClose is a function to close the form or dialog
      } else {
        console.error('Failed to update data:', result.error)
      }
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/renewalDormitory/deleteByID/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (response.ok) {
        loguserdelete()
        showSnackbar('Delete successful', classes.error)
        onClose()
      } else {
        console.error('Failed to delete data:', result.error)
      }
    } catch (error) {
      console.error('Error deleting data:', error)
    }
  }

  return (
    <>
      <Button
        sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        onClick={toggleDrawer(true)}
      >
        <TuneIcon />
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
            Edit Renewal Form
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
              border: '1px dashed rgba(0, 0, 0, 0.12)'
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
                      <MenuItem value='2023'>2023</MenuItem>
                      <MenuItem value='2024'>2024</MenuItem>
                      <MenuItem value='2025'>2025</MenuItem>
                      <MenuItem value='2026'>2026</MenuItem>
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
                      <MenuItem value='ภาคเรียนที่ 1'>ภาคเรียนที่ 1</MenuItem>
                      <MenuItem value='ภาคเรียนที่ 2'>ภาคเรียนที่ 2</MenuItem>
                      <MenuItem value='ภาคเรียนที่ 3'>ภาคเรียนที่ 3</MenuItem>
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
        {errorMessage && (
          <Alert severity='error' sx={{ ml: 5, mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Divider />
        <Box sx={{ padding: 3 }}>
          <Grid container spacing={4} alignItems='center' justifyContent='space-between'>
            <Grid item>
              <Button variant='contained' color='error' onClick={handleDelete}>
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Box>
                <Button variant='contained' color='primary' onClick={onClose} sx={{ marginRight: 2 }}>
                  Cancel
                </Button>
                <Button variant='contained' color='primary' onClick={handleSubmit}>
                  Apply
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}

export default RenewalFormEdit
