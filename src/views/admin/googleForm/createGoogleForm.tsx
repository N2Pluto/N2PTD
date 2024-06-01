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
import Paper from '@mui/material/Paper'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const CreateGoogleForm = () => {
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [formName, setFormName] = useState('')
  const [formUrl, setFormUrl] = useState('')

  const onClose = () => {
    setDrawerOpen(false)
    setStartDate(null)
    setEndDate(null)
    setFormName('')
    setFormUrl('')
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

  const handleSubmit = async () => {
    const response = await fetch(' /api/admin/googleForm/create/', {
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

  return (
    <>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Google Form
          </Typography>
          <Typography variant='body2'>Click to Create Renewal Form. for Create a new Renewal Form</Typography>
        </CardContent>
        <Button
          variant='contained'
          sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          onClick={toggleDrawer(true)}
        >
          Create Google Form
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
            flexDirection: 'column',
            boxShadow: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 4 }}>
          <Typography variant='h6'>Create Google Form</Typography>

          <IconButton onClick={onClose}>
            <CloseIcon sx={{ fontSize: '35px' }} />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ flexGrow: 1, overflow: 'auto', padding: 4 }}>
          <Typography variant='body2' sx={{ marginBottom: 2 }}>
            Please fill out the form to indicate whether you wish to continue staying in the dormitory for the next
            academic term.
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Box
            sx={{
              margin: 2,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              border: '1px dashed rgba(0, 0, 0, 0.12)',
              borderRadius: 2
            }}
          >
            <Grid container spacing={2}>
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
        <Divider />
        <Box sx={{ padding: 3 }}>
          <Grid container spacing={2} justifyContent='flex-end'>
            <Grid item>
              <Button variant='contained' color='secondary' onClick={onClose}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant='contained' color='primary' onClick={handleSubmit}>
                Apply
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}

export default CreateGoogleForm
