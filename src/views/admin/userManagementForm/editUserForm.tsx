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

      handleClose()

      // Send email after successful update
      const emailResponse = await fetch(`/api/admin/user/userForm/nodemailer/nodemailer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: newUsers[0].email,
          subject: 'User Update Successful',
          html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e6e6e6;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #e6e6e6;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: normal;
            color: #333;
          }
          .content {
            padding: 20px 0;
          }
          .content p {
            line-height: 1.6;
            color: #555;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #aaaaaa;
            border-top: 1px solid #e6e6e6;
          }
          .footer p {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>User Update Notification</h1>
          </div>
          <div class="content">
            <p>Dear Student,</p>
            <p>We would like to inform you that your user information has been successfully updated.</p>
            <p>Thank you for your attention to this matter.</p>
            <br>
            <p>Best regards,</p>
            <p>Your University Administration Team</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 University Administration. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `
        })
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email. HTTP status ' + emailResponse.status)
      }
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/user/userForm/delete/deleteByID/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      if (!response.ok) {
        throw new Error('HTTP status ' + response.status)
      }

      handleClose()

      // Send email after successful deletion
      const emailResponse = await fetch(`/api/admin/user/userForm/nodemailer/nodemailer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: newUsers[0].email,
          subject: 'User Deletion Successful',
          html: `
     <html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f8f9fa;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #e6e6e6;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #e6e6e6;
      }
      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: normal;
        color: #333;
      }
      .content {
        padding: 20px 0;
      }
      .content p {
        line-height: 1.6;
        color: #555;
        margin: 10px 0;
      }
      .button-container {
        text-align: center;
        margin: 20px 0;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
      }
      .button:hover {
        background-color: #0056b3;
      }
      .footer {
        text-align: center;
        padding: 10px 0;
        font-size: 12px;
        color: #aaaaaa;
        border-top: 1px solid #e6e6e6;
      }
      .footer p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Student ID Error Notification</h1>
      </div>
      <div class="content">
        <p>Dear Student,</p>
        <p>We have detected an error in the Student ID you provided in the Google Form. Please be advised that the ID you entered is incorrect.</p>
        <p>We kindly request you to fill out the form again with the correct Student ID by clicking the button below.</p>
        <div class="button-container">
          <a href="https://docs.google.com/forms/d/1Y3TaC7LohvwaSNPZAo_27dnYdOkfhzG1BY0IGBiAr14/" class="button">Fill Out Form Again</a>
        </div>
        <p>Thank you for your attention to this matter.</p>
        <p>Best regards,</p>
        <p>Your University Administration Team</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 University Administration. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
    `
        })
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email. HTTP status ' + emailResponse.status)
      }
    } catch (error) {
      console.error('Error deleting user data:', error)
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
        <DialogTitle>Edit User Information</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id='alert-dialog-slide-description'>Modify the user information below:</DialogContentText> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6'>Current User Info</Typography>
                  <List>
                    {users.length > 0 ? (
                      users.map((user, index) => (
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
                      ))
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                          src='https://img5.pic.in.th/file/secure-sv1/cancel_190406.png'
                          alt='Cancel Icon'
                          style={{ marginRight: '10px', width: '100px', height: '100px' }}
                        />
                        <Typography variant='h6'>Student ID does not exist in the system</Typography>
                      </div>
                    )}
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
                            .filter(([key]) => !['Timestamp', 'email', 'username', 'StudentID'].includes(key))
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
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={handleUpdate}>Update</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
