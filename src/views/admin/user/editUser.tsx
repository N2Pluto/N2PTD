import * as React from 'react'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import AccountOutlineIcon from 'mdi-material-ui/AccountOutline'
import { PiStudent } from 'react-icons/pi'
import ChurchIcon from '@mui/icons-material/Church'
import { BsGenderMale } from 'react-icons/bs'
import { IoSchoolOutline } from 'react-icons/io5'
import { LiaSchoolSolid } from 'react-icons/lia'
import { LuSchool } from 'react-icons/lu'
import { useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import EditIcon from '@mui/icons-material/Edit'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

interface User {
  id: number
  student_id: string
  name: string
  lastname: string
  student_year: string
  school: string
  department: string
  major: string
  gender: string
  religion: string
}

export default function EditUser({ id, onUpdateSuccess }: { id: number; onUpdateSuccess: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [studentId, setStudentId] = useState('')
  const [gender, setGender] = useState('')
  const [religion, setReligion] = useState('')
  const [school, setSchool] = useState('')
  const [department, setDepartment] = useState('')
  const [major, setMajor] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setLastname(user.lastname)
      setStudentId(user.Users.student_id)
      setGender(user.gender)
      setReligion(user.religion)
      setSchool(user.school)
      setDepartment(user.department)
      setMajor(user.major)
    }
  }, [user])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/user/update/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: user?.id,
          name,
          lastname,
          student_id: studentId,
          gender,
          religion,
          school,
          department,
          major
        })
      })

      if (res.ok) {
        console.log('Update successful, closing drawer...')
        handleClose()
        onUpdateSuccess()
      } else {
        const data = await res.json()
        console.error('Update failed:', data)
      }
    } catch (error) {
      console.error('Failed to update:', error)
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const res = await fetch(`/api/admin/user/read/${id}`)
        const data = await res.json()
        setUser(data.data)
      }
      fetchData()
    }
  }, [open, id])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  return (
    <>
      <Button onClick={handleDrawerToggle} variant='contained' startIcon={<EditIcon />}>
        EDIT
      </Button>
      <Drawer
        anchor='right'
        open={open}
        onClose={handleClose}
        variant='temporary'
        sx={{
          width: '50vw',
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: '50vw', boxSizing: 'border-box', padding: '16px' }
        }}
      >
        <Box>
          <Grid container spacing={3}>
            <Grid container alignItems='center'>
              <Grid item xs={12}>
                <Typography variant='body1' sx={{ pb: 2, pt: 5, pr: 2, ml: 4, fontWeight: 'bold' }}>
                  Edit User {studentId}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Firstname'
                placeholder='Enter Firstname'
                value={name}
                onChange={e => setName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountOutlineIcon />
                    </InputAdornment>
                  )
                }}
                helperText='Please enter the first name.'
                sx={{ '& input': { fontSize: '0.8rem' } }} // Adjust font size here
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Lastname'
                placeholder='Enter Lastname'
                value={lastname}
                onChange={e => setLastname(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AccountOutlineIcon />
                    </InputAdornment>
                  )
                }}
                helperText='Please enter the last name.'
                sx={{ '& input': { fontSize: '0.8rem' } }} // Adjust font size here
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Student ID'
                placeholder='Enter Student ID'
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PiStudent size={20} />
                    </InputAdornment>
                  )
                }}
                helperText='Please enter the student ID.'
                sx={{ '& input': { fontSize: '0.8rem' } }} // Adjust font size here
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label='Gender'
                placeholder='Enter Gender'
                value={gender}
                onChange={e => setGender(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <BsGenderMale size={20} />
                    </InputAdornment>
                  )
                }}
                helperText='Please select the gender.'
                sx={{ '& .MuiSelect-select': { fontSize: '0.8rem' } }} // Adjust font size here for select
              >
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label='Religion'
                placeholder='Enter Religion'
                value={religion}
                onChange={e => setReligion(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <ChurchIcon />
                    </InputAdornment>
                  )
                }}
                helperText='Please select the religion.'
                sx={{ '& .MuiSelect-select': { fontSize: '0.8rem' } }} // Adjust font size here for select
              >
                <MenuItem value='Buddhism'>Buddhism</MenuItem>
                <MenuItem value='Christianity'>Christianity</MenuItem>
                <MenuItem value='Islam'>Islam</MenuItem>
                <MenuItem value='Hinduism'>Hinduism</MenuItem>
                <MenuItem value='Other'>Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='School'
                placeholder='Enter School'
                value={school}
                onChange={e => setSchool(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LuSchool size={20} />
                    </InputAdornment>
                  )
                }}
                helperText='Please enter the school name.'
                sx={{ '& input': { fontSize: '0.8rem' } }} // Adjust font size here
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Department'
                placeholder='Enter Department'
                value={department}
                onChange={e => setDepartment(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LiaSchoolSolid size={20} />
                    </InputAdornment>
                  )
                }}
                helperText='Please enter the department.'
                sx={{ '& input': { fontSize: '0.8rem' } }} // Adjust font size here
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Major'
                placeholder='Enter Major'
                value={major}
                onChange={e => setMajor(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <IoSchoolOutline size={20} />
                    </InputAdornment>
                  )
                }}
                helperText='Please enter the major.'
                sx={{ '& input': { fontSize: '0.8rem' } }} // Adjust font size here
              />
            </Grid>
          </Grid>
        </Box>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleUpdate} variant='contained' color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Drawer>
      <Backdrop open={loading} style={{ color: '#fff', zIndex: 1500 }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}
