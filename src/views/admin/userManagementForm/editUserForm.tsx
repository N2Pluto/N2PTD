import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TuneIcon from '@mui/icons-material/Tune'
import { useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import styled from '@mui/material/styles/styled'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import PersonIcon from '@mui/icons-material/Person'
import Grid from '@mui/material/Grid'

interface User {
  id: number
  name: string
  lastname: string
  student_year: string
  school: string
  department: string
  major: string
  religion: string
  gender: string
  phone: string
  student_id: string
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function EditUserForm({ id, student_id }: { id: number; student_id: string }) {
  const [users, setUsers] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [newUsers, setNewUsers] = React.useState([])
  const [updateUsers, setUpdateUsers] = React.useState([])
  const [filteredNewUsers, setFilteredNewUsers] = React.useState(null)

  console.log('id', id)
  console.log('student_id', student_id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/user/userForm/read/readByID/${id}/`)
        const { data } = await response.json()
        if (data) {
          setNewUsers(Array.isArray(data) ? data : [data])
          setUpdateUsers(Array.isArray(data) ? data : [data])
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [id])

  console.log('newUsers', newUsers)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/user/read/readByID/${student_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ student_id })
        })
        const { data } = await response.json()
        if (data) {
          setUsers(data)
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchData()
  }, [student_id, id])

  console.log('users info:', users)

  const handleUpdate = async () => {
    const filteredUsers = updateUsers.map(user => {
      const filteredUser = Object.fromEntries(Object.entries(user).filter(([key, value]) => value && value !== ''))

      return filteredUser
    })

    setFilteredNewUsers(filteredUsers)

    try {
      const response = await fetch('/api/admin/user/userForm/update/updateUserForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filteredUsers, id })
      })

      if (!response.ok) {
        throw new Error('HTTP status ' + response.status)
      }

      console.log('id ใน อัพเดท1', id)

      if (response.ok) {
        const fetchFormResponse = await fetch(`/api/admin/user/userForm/update/updateByID/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        })

        if (!fetchFormResponse.ok) {
          throw new Error('HTTP status ' + fetchFormResponse.status)
        }
      } else {
        console.error('Response was not successful')
      }
      console.log('id ใน อัพเดท2', id)
      handleClose()
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const filterUserData = (user, reference) => {
    if (!reference) {
      console.error('Reference is undefined')

      return user
    }

    return Object.fromEntries(
      Object.entries(user).filter(([key]) => key in reference && reference[key] && reference[key] !== '')
    )
  }

  return (
    <div>
      <Tooltip title='Edit User'>
        <IconButton onClick={handleClickOpen}>
          <TuneIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>Modify the user information below:</DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6'>Current User Info</Typography>
                  <List>
                    {users.map((user, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${user.name} ${user.lastname} (${user.Users.student_id})`}
                          secondary={Object.entries(filterUserData(user, newUsers[0])).map(([key, value]) => (
                            <Typography key={key} variant='body2'>{`Current ${key}: ${value}`}</Typography>
                          ))}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6'>New User Info</Typography>
                  <List>
                    {newUsers.map((user, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          secondary={Object.entries(user)
                            .filter(([key]) => !['Timestamp', 'Email Address', 'username', 'StudentID'].includes(key))
                            .map(([key, value]) => (
                              <Typography key={key} variant='body2'>{`New ${key}: ${value}`}</Typography>
                            ))}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
