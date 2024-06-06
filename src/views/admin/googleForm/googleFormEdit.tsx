import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface GoogleFormEditProps {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  id: number | null
}

const GoogleFormEdit: React.FC<GoogleFormEditProps> = ({ drawerOpen, setDrawerOpen, id }) => {
  console.log('Edit id', id)
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [formName, setFormName] = useState('')
  const [formUrl, setFormUrl] = useState('')

  useEffect(() => {
    const fetchFormData = async () => {
      if (id !== null) {
        try {
          const response = await fetch(`/api/admin/googleForm/read/readByID/${id}`)
          const result = await response.json()
          console.log('Result:', result)
          const { form_name, form_url, start_date, end_date } = result.data
          setFormName(form_name)
          setFormUrl(form_url)
          setStartDate(new Date(start_date))
          setEndDate(new Date(end_date))
        } catch (error) {
          console.error('Error fetching form data:', error)
        }
      }
    }

    if (drawerOpen) {
      fetchFormData()
    }
  }, [drawerOpen, id])

  const onClose = () => {
    setDrawerOpen(false)
  }

  const handleSubmit = async () => {
    const response = await fetch(`/api/admin/googleForm/update/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        formName,
        formUrl,
        startDate,
        endDate
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      onClose()
    }
  }

  const handleDelete = async () => {
    const response = await fetch(`/api/admin/googleForm/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      onClose()
    }
  }

  return (
    <Drawer
      anchor='right'
      open={drawerOpen}
      onClose={onClose}
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
          Edit Google Form
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon sx={{ pt: 2, fontSize: '35px' }} />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography variant='body2' sx={{ ml: 5, margin: 3 }}>
          Please fill out the form to update the Google Form details.
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
                <TextField label='Form Name' value={formName} onChange={e => setFormName(e.target.value)} fullWidth />
                <Typography variant='caption' display='block' gutterBottom>
                  Enter the name for the Google Form.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField label='Form URL' value={formUrl} onChange={e => setFormUrl(e.target.value)} fullWidth />
                <Typography variant='caption' display='block' gutterBottom>
                  Enter the URL for the Google Form.
                </Typography>
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
                    Select the start date for the Google Form period.
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
                    Select the end date for the Google Form period.
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
            <Button
              justifyContent='flex-start'
              variant='contained'
              color='error'
              fullWidth
              onClick={handleDelete}
              sx={{ ml: -28 }}
            >
              Delete
            </Button>
          </Grid>
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
  )
}

export default GoogleFormEdit
