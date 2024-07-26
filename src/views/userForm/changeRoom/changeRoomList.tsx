import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { userStore } from 'src/stores/userStore'
import {
  Backdrop,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'

export default function ChangeRoomList() {
  const theme = useTheme()
  const { user } = userStore()
  const [changeRoomData, setChangeRoomData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState('Pending')

  const fetchData = async () => {
    if (!user) {
      console.error('User is null')
      return
    }

    setIsLoading(true)
    const user_id = user.user_id
    const response = await fetch(`/api/userForm/read/${user_id}`)
    const data = await response.json()
    setIsLoading(false)

    if (response.ok) {
      console.log('setChangeRoomData:', data)
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

      if (response.ok) {
        console.log('Request cancelled successfully:', result)
      } else {
        console.error('Error cancelling request:', result.error)
      }
    } catch (error) {
      console.error('Error cancelling request:', error)
    } finally {
      setIsLoading(false)
      fetchData() // Fetch data again to refresh the list
    }
  }

  const getStatusChip = status => {
    let color = 'default'
    if (status === 'Pending') color = 'warning'
    else if (status === 'Approve') color = 'success'
    else if (status === 'Reject') color = 'error'

    return <Chip label={status} color={color} />
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  const filterDataByStatus = status => {
    return changeRoomData.filter(item => item.status === status)
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label='Pending' value='Pending' />
          <Tab label='Approve' value='Approve' />
        </Tabs>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Request Number</TableCell>
              <TableCell align='center'>Request Details</TableCell>
              <TableCell align='center'>Status</TableCell>
              {currentTab === 'Pending' && <TableCell align='center'>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filterDataByStatus(currentTab).length > 0 ? (
              filterDataByStatus(currentTab).map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>
                    <Typography variant='body2' sx={{ fontWeight: 'medium', color: '#4a4a4a' }}>
                      Change Room #{index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Chip
                      label={`${item.Dormitory_Building?.name} (${item.Dormitory_Room?.room_number}/${item.Dormitory_Bed?.bed_number})`}
                      sx={{ fontWeight: 'medium', color: '#4a4a4a' }}
                    />
                  </TableCell>
                  <TableCell align='center'>{getStatusChip(item.status)}</TableCell>
                  {currentTab === 'Pending' && (
                    <TableCell align='center'>
                      {item.status === 'Pending' && (
                        <Button
                          variant='contained'
                          color='error'
                          size='small'
                          startIcon={<CancelIcon sx={{ color: 'white' }} />}
                          sx={{ backgroundColor: '#ff4d4f' }}
                          onClick={() => handleCancelRequest(item.id)}
                        >
                          <Typography variant='body2' sx={{ color: 'white' }}>
                            Cancel Request
                          </Typography>
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow style={{ height: 100 }}>
                <TableCell colSpan={currentTab === 'Pending' ? 4 : 3}>
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
                        height: '100%',
                        width: '100%'
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
      </TableContainer>
    </>
  )
}
