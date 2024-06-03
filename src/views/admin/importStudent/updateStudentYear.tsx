import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import MuiAlert from '@mui/material/Alert'

const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const UpdateStudentYear = ({ drawerUpdateOpen, setDrawerUpdateOpen }) => {
  const [studentYears, setStudentYears] = useState(Array(8).fill(''))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (drawerUpdateOpen) {
      fetchExistingData()
    }
  }, [drawerUpdateOpen])

  const fetchExistingData = async () => {
    try {
      const response = await fetch('/api/admin/yearSystem/read')
      const data = await response.json()

      if (response.ok) {
        const existingData = Array(8).fill('')
        data.forEach(item => {
          existingData[item.year - 1] = item.student_id
        })
        setStudentYears(existingData)
      } else {
        throw new Error('Failed to fetch existing data.')
      }
    } catch (error) {
      setError('Failed to fetch existing data.')
    }
  }

  const handleDrawerClose = () => {
    setDrawerUpdateOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setStudentYears(Array(8).fill(''))
    setError('')
  }

  const handleYearChange = (index, value) => {
    const updatedStudentYears = studentYears.map((year, i) => (i === index ? value : year))
    setStudentYears(updatedStudentYears)
  }

  const handleImport = async () => {
    const data = studentYears.map((prefix, index) => ({ year: index + 1, student_id: prefix }))

    try {
      const response = await fetch('/api/admin/yearSystem/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        handleDrawerClose()
        setSuccess(true)
      } else {
        throw new Error('Failed to update student years.')
      }
    } catch (error) {
      setError('Failed to update student years.')
    }
  }

  return (
    <Card>
      {/* <CardContent>
        <Box display='flex' justifyContent='flex-end' mb={2}>
          <Button variant='contained' color='primary' onClick={() => setDrawerUpdateOpen(true)}>
            Update Student Year
          </Button>
        </Box>
      </CardContent> */}

      <Drawer anchor='right' open={drawerUpdateOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: '30vw', padding: 4, margin: 5 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Update Student Year
          </Typography>

          <Divider sx={{ borderWidth: '1px', mb: 2 }} />

          <Typography variant='body2' sx={{ mb: 2 }}>
            Enter student ID prefixes for each year.
          </Typography>

          <Grid container spacing={2}>
            {studentYears.map((year, index) => (
              <Grid item xs={6} key={index}>
                <TextField
                  label={`Year ${index + 1}`}
                  variant='outlined'
                  fullWidth
                  value={year}
                  onChange={e => handleYearChange(index, e.target.value)}
                  sx={{ margin: 2 }}
                  helperText={`Enter the student ID prefix for year ${index + 1}`}
                />
              </Grid>
            ))}
          </Grid>

          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Divider sx={{ borderWidth: '1px', mt: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant='outlined' onClick={handleDrawerClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' onClick={handleImport}>
              Update Years
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Card>
  )
}

export default UpdateStudentYear
