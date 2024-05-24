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
import { FaEdit } from 'react-icons/fa'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { PiStudent } from 'react-icons/pi'
import ChurchIcon from '@mui/icons-material/Church'
import { BsGenderMale } from 'react-icons/bs'
import { IoSchoolOutline } from 'react-icons/io5'
import { LiaSchoolSolid } from 'react-icons/lia'
import { LuSchool } from 'react-icons/lu'
import { useEffect, useState } from 'react'

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

export default function EditUser({ id }: { id: number }) {
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [fullWidth, setFullWidth] = React.useState(true)
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [studentId, setStudentId] = useState('')
  const [gender, setGender] = useState('')
  const [religion, setReligion] = useState('')
  const [school, setSchool] = useState('')
  const [department, setDepartment] = useState('')
  const [major, setMajor] = useState('')

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
        user_id: user?.user_id,
        gender,
        religion,
        school,
        department,
        major
      })
    })
    const data = await res.json()

    // Check if the update was successful
    if (res.ok) {
      // Close the dialog
      handleClose()
    } else {
      // Handle the error...
    }
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

  const handleClose = () => {
    setOpen(false)
  }

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    )
  }

  const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullWidth(event.target.checked)
  }

  return (
    <React.Fragment>
      <Button variant='outlined' onClick={handleClickOpen}>
        <FaEdit />
      </Button>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
        {/* <DialogContent sx={{ py: 5 }}>User Data Management</DialogContent> */}
        <DialogContent>
          <Grid container spacing={6}>
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
                      <AccountOutline />
                    </InputAdornment>
                  )
                }}
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
                      <AccountOutline />
                    </InputAdornment>
                  )
                }}
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
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Religion'
                placeholder='Enter Religion'
                value={religion}
                onChange={e => setReligion(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <ChurchIcon size={20} />
                    </InputAdornment>
                  )
                }}
              />
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleUpdate}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
