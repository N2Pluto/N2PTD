import React, { useState, useEffect, Fragment } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { userStore } from 'src/stores/userStore'
import { Avatar, Badge } from '@mui/material'

import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import BellOutline from 'mdi-material-ui/BellOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import ErrorIcon from '@mui/icons-material/Error'

const RenewalChooseForm = () => {
  const [userRenewal, setUserRenewal] = useState('')
  const [formData, setFormData] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const userStoreInstance = userStore()
  const [userExistsInRenewalDormitory, setUserExistsInRenewalDormitory] = useState(false)
  const [residentData, setResidentData] = useState(null)

  useEffect(() => {
    const fetchResidentData = async () => {
      try {
        const response = await fetch('/api/admin/renewalDormitory/create/pullFormResident', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setResidentData(data)
      } catch (error) {
        console.error('Failed to fetch resident data:', error)
      }
    }

    fetchResidentData()
    const intervalId = setInterval(fetchResidentData, 2000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/renewalDormitory/read/fetchFormByDate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userStoreInstance.user.user_id })
        })
        const data = await response.json()
        setFormData(data)

        // Check if user exists in Renewal_Dormitory
        if (data.renewalData && data.renewalData.length > 0) {
          setUserExistsInRenewalDormitory(true)
        } else {
          setUserExistsInRenewalDormitory(false)
        }
      } catch (error) {
        console.error('Failed to fetch form data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 2000)

    return () => clearInterval(intervalId)
  }, [])

  console.log('userExistsInRenewalDormitory', userExistsInRenewalDormitory)

  const handleUserRenewalChange = (event: SelectChangeEvent) => {
    setUserRenewal(event.target.value as string)
  }

  const handleSubmit = async () => {
    if (
      formData &&
      formData.data &&
      formData.data.length > 0 &&
      formData.residentData &&
      formData.residentData.length > 0
    ) {
      try {
        const response = await fetch('/api/admin/renewalSystem/create/', {
          method: 'PUT', // change from 'POST' to 'PUT'
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userRenewal,
            residentData: formData.residentData[0]
          })
        })
        if (response.ok) {
          console.log('Data updated successfully') 
          setDrawerOpen(false)
        } else {
          console.error('Failed to update data') 
        }
      } catch (error) {
        console.error('Error updating data:', error) 
      }
    }
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

  const renderButton = () => {
    if (formData && formData.data && formData.data.length > 0) {
      return (
        <Card>
          <CardContent
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
            }}
          >
            <Avatar
              sx={{ width: 50, height: 50, marginBottom: 2.25, color: 'common.white', backgroundColor: 'primary.main' }}
            >
              <PriorityHighIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography variant='h6' sx={{ marginBottom: 2.75 }}>
              Very important
            </Typography>
            <Typography variant='body2' sx={{ marginBottom: 6 }}>
              every semester A stay-on questionnaire will be filled out for ease of use. Please respond within 15 days.
            </Typography>
            <Button
              variant='contained'
              sx={{ padding: theme => theme.spacing(1.75, 5.5) }}
              onClick={toggleDrawer(true)}
            >
              OPEN FORM
            </Button>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <>
      {!userExistsInRenewalDormitory && <>{renderButton()}</>}

      <Drawer
        anchor='bottom'
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%',
            height: '35%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ width: 'auto', padding: 2 }} role='presentation'>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              {formData && formData.data && formData.data.length > 0 && (
                <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    Dormitory Renewal Form - Semester {formData.data[0].renewal_phase}, {formData.data[0].renewal_name}
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 1 }}>
                    We kindly request you to indicate your intention to continue residing in the dormitory for the
                    upcoming term.
                  </Typography>
                  <Typography variant='body2' sx={{ marginBottom: 2 }}>
                    Please note that the renewal form will be available from{' '}
                    <b>
                      {new Date(formData.data[0].start_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </b>{' '}
                    to{' '}
                    <b>
                      {new Date(formData.data[0].end_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </b>
                    . Please ensure to submit your decision within this period.
                  </Typography>
                </CardContent>
              )}
              <IconButton
                edge='end'
                color='inherit'
                onClick={toggleDrawer(false)}
                aria-label='close'
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FormControl fullWidth>
                  <InputLabel id='user-renewal-select-label'>Stay Decision</InputLabel>
                  <Select
                    value={userRenewal}
                    onChange={handleUserRenewalChange}
                    id='user-renewal-select'
                    labelId='user-renewal-select-label'
                    input={<OutlinedInput label='Stay Decision' />}
                  >
                    <MenuItem value='stay'>อยู่ต่อ</MenuItem>
                    <MenuItem value='leave'>ไม่อยู่ต่อ</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent='center' sx={{ marginTop: 2 }}>
              <Grid item>
                <Button variant='contained' color='primary' onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}

export default RenewalChooseForm
