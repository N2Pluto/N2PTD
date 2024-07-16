import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { userStore } from 'src/stores/userStore'
import {
  Backdrop,
  CircularProgress,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Drawer,
  Box,
  Typography,
  Divider,
  Grid,
  Tabs,
  Tab,
  TablePagination
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'

export default function ChangeRoomControl() {
  const theme = useTheme()
  const { user } = userStore()
  const [changeRoomData, setChangeRoomData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)
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

    // Filter out null values from selectedRequest
    const filteredRequest = Object.entries(selectedRequest).reduce((acc, [key, value]) => {
      if (value !== null) {
        acc[key] = value
      }
      return acc
    }, {})

    setIsLoading(true) // Show loading indicator

    try {
      const response = await fetch(`/api/userForm/update/${selectedRequest.id}`, {
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

      // Optionally, refresh data or close the drawer here
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

    const response = await fetch(`/api/userForm/read/fetchChangeRoom`, {
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
      const response = await fetch(`/api/userForm/delete/${requestId}`, { method: 'POST' })
      const result = await response.json()
      fetchData()
      if (response.ok) {
        console.log('Request cancelled successfully:', result)
        fetchData()
      } else {
        fetchData()
        console.error('Error cancelling request:', result.error)
      }
    } catch (error) {
      fetchData()
      console.error('Error cancelling request:', error)
    } finally {
      setIsLoading(false)
      setDrawerOpen(false)
      fetchData()
    }
  }

  const handleDrawerOpen = request => {
    console.log('Selected request:', request)
    fetchUserProfile()
    setSelectedRequest(request)
    setDrawerOpen(true)
    setSelectedUserId(request.user_id)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedRequest(null)
  }

  const getStatusChip = status => {
    let color = 'default'
    if (status === 'Pending') color = 'warning'
    else if (status === 'Approve') color = 'success'
    else if (status === 'Reject') color = 'error'

    return <Chip label={status} color={color} />
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request #</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Change Room Info</TableCell>
              <TableCell>Status</TableCell>
              {tabValue !== 'Approve' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>#{index + 1}</TableCell>
                  <TableCell>
                    {item.userInfo?.name} {item.userInfo?.lastname}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${item.Dormitory_Building?.name} (${item.Dormitory_Room?.room_number}/${item.Dormitory_Bed?.bed_number})`}
                      color='error'
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(item.status)}</TableCell>
                  {tabValue !== 'Approve' && (
                    <TableCell>
                      <IconButton onClick={() => handleDrawerOpen(item)}>
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
            Change Room Request
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
                      <strong>Building</strong>
                    </TableCell>
                    <TableCell>{profileData?.dormitoryBuildingName}</TableCell>
                    <TableCell>{selectedRequest?.Dormitory_Building?.name || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Room</strong>
                    </TableCell>
                    <TableCell>{profileData?.dormitoryRoomNumber}</TableCell>
                    <TableCell>{selectedRequest?.Dormitory_Room?.room_number || '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Bed</strong>
                    </TableCell>
                    <TableCell>{profileData?.dormitoryBedNumber}</TableCell>
                    <TableCell>{selectedRequest?.Dormitory_Bed?.bed_number || '-'}</TableCell>
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
