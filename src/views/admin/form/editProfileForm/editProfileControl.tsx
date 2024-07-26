import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { userStore } from 'src/stores/userStore'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Backdrop,
  CircularProgress,
  IconButton,
  Drawer,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Tabs,
  Tab,
  TablePagination
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

export default function EditProfileControl() {
  const theme = useTheme()
  const { user } = userStore()
  const [changeRoomData, setChangeRoomData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [userData, setUserData] = useState({
    student_id: '',
    user_id: '',
    email: ''
  })
  const [userInfoData, setUserInfoData] = useState({
    department: '',
    school: '',
    major: '',
    gender: '',
    lastname: '',
    name: '',
    phone: '',
    religion: '',
    student_year: ''
  })

  const [tabValue, setTabValue] = useState('Pending')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue)
    setPage(0) // Reset page when changing tabs
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) // Reset page when changing rows per page
  }

  const handleSubmit = async () => {
    if (!selectedRequest) {
      console.error('No request selected')
      return
    }

    const filteredRequest = Object.entries(selectedRequest).reduce((acc, [key, value]) => {
      if (value !== null) {
        acc[key] = value
      }
      return acc
    }, {})

    setIsLoading(true) // Show loading indicator

    try {
      const response = await fetch(`/api/userForm/editProfile/update/${selectedRequest.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filteredRequest) // Send the filteredRequest as the request body
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      console.log('Profile updated successfully:', result)

      const emailHtml = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <header style="padding: 10px 0; text-align: center;">
      <img src="https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png" alt="Walailak University" style="width: 100px; height: auto;" />
      <h2 style="margin-top: 10px; color: #007bff;">Dormitory Reservation System</h2>
      <h4 style="margin-top: 5px; color: #555;">Walailak University</h4>
    </header>
    <main style="padding: 20px; background-color: #f9f9f9; border-radius: 10px; margin: 20px;">
      <p>Dear <strong>${userInfoData.name} ${userInfoData.lastname}</strong>,</p>
      <p>We are pleased to inform you that your request to edit your profile has been successfully processed. Below are the details of the changes:</p>
      <ul style="list-style-type: none; padding: 0;">
        ${
          selectedRequest.name
            ? `<li style="padding: 5px 0;"><strong>First Name:</strong> ${selectedRequest.name}</li>`
            : ''
        }
        ${
          selectedRequest.lastname
            ? `<li style="padding: 5px 0;"><strong>Last Name:</strong> ${selectedRequest.lastname}</li>`
            : ''
        }
        ${
          selectedRequest.gender
            ? `<li style="padding: 5px 0;"><strong>Gender:</strong> ${selectedRequest.gender}</li>`
            : ''
        }
        ${
          selectedRequest.religion
            ? `<li style="padding: 5px 0;"><strong>Religion:</strong> ${selectedRequest.religion}</li>`
            : ''
        }
        ${
          selectedRequest.phone
            ? `<li style="padding: 5px 0;"><strong>Phone:</strong> ${selectedRequest.phone}</li>`
            : ''
        }
        ${
          selectedRequest.school
            ? `<li style="padding: 5px 0;"><strong>School:</strong> ${selectedRequest.school}</li>`
            : ''
        }
        ${
          selectedRequest.department
            ? `<li style="padding: 5px 0;"><strong>Department:</strong> ${selectedRequest.department}</li>`
            : ''
        }
        ${
          selectedRequest.major
            ? `<li style="padding: 5px 0;"><strong>Major:</strong> ${selectedRequest.major}</li>`
            : ''
        }
      </ul>
      <p>Thank you for using the Dormitory Reservation System.</p>
    </main>
    <footer style="text-align: center; padding: 10px 0; color: #777;">
      <p style="margin: 0;">&copy; 2024 Walailak University. All rights reserved.</p>
    </footer>
  </div>
`

      const emailResponse = await fetch('/api/userForm/nodemailer/nodemailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: selectedEmail,
          subject: 'Edit Profile Form Submission',
          text: 'Your request to edit the profile has been processed.',
          html: emailHtml
        })
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email')
      }

      const emailResult = await emailResponse.json()
      console.log('Email sent successfully:', emailResult)

      fetchData() // Assuming fetchData fetches the latest data
      handleCloseDrawer() // Close the drawer
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false) // Hide loading indicator
    }
  }

  const fetchUserProfile = async () => {
    if (!selectedUserId) return // Do not fetch if selectedUserId is not set

    try {
      const response = await fetch('/api/profile/fetchUserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: selectedUserId }) // Use selectedUserId here
      })
      const data = await response.json()
      setProfileData(data) // Set the received user data
      setUserData(data.userData) // Set userData state
      setUserInfoData(data.userInfoData) // Set userInfoData state
      console.log('User data:', data)
    } catch (error) {
      console.error('Failed to fetch user profile', error)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [selectedUserId])

  const fetchData = async () => {
    if (!user) {
      console.error('User is null')
      return
    }

    setIsLoading(true)
    const user_id = user.user_id

    const response = await fetch(`/api/userForm/editProfile/read/fetchEditProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id })
    })

    const data = await response.json()
    setIsLoading(false)

    if (response.ok) {
      console.log('setEditProfileData:', data)
      setChangeRoomData(data)
    } else {
      console.error(data.error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const handleCancelRequest = async requestId => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/userForm/editProfile/delete/${requestId}`, { method: 'POST' })

      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        result = { error: 'Invalid JSON response' }
      }

      fetchData()
      if (response.ok) {
        console.log('Request cancelled successfully:', result)
        fetchData()

        const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <header style="padding: 10px 0; text-align: center;">
            <img src="https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png" alt="Walailak University" style="width: 100px; height: auto;" />
            <h2 style="margin-top: 10px; color: #007bff;">Dormitory Reservation System</h2>
            <h4 style="margin-top: 5px; color: #555;">Walailak University</h4>
          </header>
          <main style="padding: 20px; background-color: #f9f9f9; border-radius: 10px; margin: 20px;">
            <p>Dear <strong>${userInfoData.name} ${userInfoData.lastname}</strong>,</p>
            <p>We regret to inform you that your request to edit your profile has been cancelled. Below are the details of the changes that were requested:</p>
            <p>If you have any questions or need further assistance, please feel free to contact us at <a href="mailto:dormitoryawalailak@gmail.com" style="color: #007bff; text-decoration: none;">dormitoryawalailak@gmail.com</a>.</p>
            <p>Thank you for using the Dormitory Reservation System.</p>
          </main>
          <footer style="text-align: center; padding: 10px 0; color: #777;">
            <p style="margin: 0;">&copy; 2024 Walailak University. All rights reserved.</p>
          </footer>
        </div>
      `

        // Send email notification
        const emailResponse = await fetch('/api/userForm/nodemailer/nodemailer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: selectedEmail,
            subject: 'Edit Profile Form Request Cancelled',
            text: 'Your request to edit the profile has been cancelled.',
            html: emailHtml
          })
        })

        if (!emailResponse.ok) {
          const emailError = await emailResponse.json()
          console.error('Error sending email:', emailError)
        }
      } else {
        fetchData()
        console.error('Error cancelling request:', result.error || 'Unknown error')
      }
    } catch (error) {
      fetchData()
      console.error('Error cancelling request:', error)
    } finally {
      setIsLoading(false)
      handleCloseDrawer()
      fetchData()
    }
  }

  const getStatusChip = status => {
    let color = 'default'
    if (status === 'Pending') color = 'warning'
    else if (status === 'Approve') color = 'success'
    else if (status === 'Reject') color = 'error'

    return <Chip label={status} color={color} />
  }

  const handleOpenDrawer = request => {
    console.log('Selected request:', request)
    fetchUserProfile()
    setSelectedRequest(request) // Assuming you have a state for this
    setDrawerOpen(true) // Assuming you have a state for this
    setSelectedUserId(request.user_id) // Set the selected user_id
    setSelectedEmail(request.email) // Set the selected email
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedRequest(null)
  }

  const filteredData = changeRoomData.filter(item => item.status === tabValue)

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        sx={{ '.MuiTabs-flexContainer': { justifyContent: 'flex-start' } }}
      >
        <Tab label='Pending' value='Pending' />
        <Tab label='Approve' value='Approve' />
      </Tabs>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request #</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Edit Information</TableCell>
              <TableCell>Status</TableCell>
              {tabValue !== 'Approve' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>#{index + 1}</TableCell>
                  <TableCell>
                    {item.userInfo?.name} {item.userInfo?.lastname}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const infoParts = []
                      if (item.name || item.lastname) infoParts.push('Name')
                      if (item.school || item.department || item.major) infoParts.push('Education')
                      if (item.gender) infoParts.push('Gender')
                      if (item.religion) infoParts.push('Religion')
                      if (item.phone) infoParts.push('Contact')

                      const infoString = infoParts.join(', ')

                      return infoString ? <Chip label={infoString} color='error' /> : null
                    })()}
                  </TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
                  {tabValue !== 'Approve' && (
                    <TableCell>
                      <IconButton onClick={() => handleOpenDrawer(item)}>
                        <SettingsIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow style={{ height: 100 }}>
                <TableCell colSpan={11}>
                  <Paper
                    style={{
                      padding: '20px',
                      height: '100%',
                      width: '100%',
                      backgroundColor: 'rgba(128, 128, 128, 0.05)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                      }}
                    >
                      <img
                        src='https://img5.pic.in.th/file/secure-sv1/erase_1981540.png'
                        alt='No Data'
                        width='100'
                        height='100'
                        style={{ marginBottom: '10px' }}
                      />
                      <Typography variant='body2'>Request Not Found</Typography>
                    </div>
                  </Paper>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: '50%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
            padding: 2
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' sx={{ pb: 2, pt: 5, pr: 2, ml: 4 }}>
            Edit Profile Request
          </Typography>
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon sx={{ fontSize: '35px' }} />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, mb: 2, pt: 5, pr: 2, ml: 4 }}>
              Request Information
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2 }}>
              <Table aria-label='profile comparison'>
                <TableHead>
                  <TableRow>
                    <TableCell>Topic</TableCell>
                    <TableCell>Current Information</TableCell>
                    <TableCell>Requested Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>First Name</strong>
                    </TableCell>
                    <TableCell>{userInfoData.name}</TableCell>
                    <TableCell>{selectedRequest?.name || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Last Name</strong>
                    </TableCell>
                    <TableCell>{userInfoData.lastname}</TableCell>
                    <TableCell>{selectedRequest?.lastname || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Student ID</strong>
                    </TableCell>
                    <TableCell>{userData.student_id}</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Gender</strong>
                    </TableCell>
                    <TableCell>{userInfoData.gender}</TableCell>
                    <TableCell>{selectedRequest?.gender || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Religion</strong>
                    </TableCell>
                    <TableCell>{userInfoData.religion}</TableCell>
                    <TableCell>{selectedRequest?.religion || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>
                    <TableCell>{userInfoData.phone}</TableCell>
                    <TableCell>{selectedRequest?.phone || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>School</strong>
                    </TableCell>
                    <TableCell>{userInfoData.school}</TableCell>
                    <TableCell>{selectedRequest?.school || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Department</strong>
                    </TableCell>
                    <TableCell>{userInfoData.department}</TableCell>
                    <TableCell>{selectedRequest?.department || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Major</strong>
                    </TableCell>
                    <TableCell>{userInfoData.major}</TableCell>
                    <TableCell>{selectedRequest?.major || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2} justifyContent='space-between'>
            <Grid item>
              <IconButton onClick={() => handleCancelRequest(selectedRequest.id)} color='error'>
                <DeleteIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container spacing={2} justifyContent='flex-end'>
                <Grid item>
                  <Button variant='contained' onClick={handleCloseDrawer}>
                    Close
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' onClick={handleSubmit}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}
