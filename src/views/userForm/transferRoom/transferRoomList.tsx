import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { userStore } from 'src/stores/userStore'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

export default function TransferRoomList() {
  const theme = useTheme()
  const { user } = userStore()
  const [changeRoomData, setChangeRoomData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    if (!user) {
      console.error('User is null')
      return
    }

    setIsLoading(true)
    const user_id = user.user_id
    const response = await fetch(`/api/userForm/transferRoom/read/${user_id}`)
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
      const response = await fetch(`/api/userForm/transferRoom/delete/${requestId}`, { method: 'POST' })
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

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Grid container spacing={2}>
        {' '}
        {changeRoomData.map((item, index) => (
          <>
            {' '}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                key={item.id} // Ensure each card has a unique key based on the request id
                variant='outlined'
                sx={{ display: 'flex', width: 275, justifyContent: 'space-between', marginBottom: 2 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 'medium', marginBottom: 2 }}>
                      TRANSFER ROOM #{index + 1} 
                      {/* {item.userInfo?.name} {item.userInfo?.lastname} */}
                    </Typography>
                    <Typography variant='body2' gutterBottom sx={{ fontStyle: 'italic' }}>
                      Transfer Room Info
                    </Typography>
                    <Typography variant='body2' sx={{ marginBottom: 2, fontWeight: 'medium', color: '#4a4a4a' }}>
                      {item.Dormitory_Building?.name} ({item.Dormitory_Room?.room_number}/
                      {item.Dormitory_Bed?.bed_number})
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, ml: 9 }}>
                      <Typography variant='body2'>{getStatusChip(item.status)}</Typography>
                    </Box>
                    {item.status === 'Pending' && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, ml: 9 }}>
                        <Button
                          variant='outlined'
                          color='error'
                          size='small'
                          onClick={() => handleCancelRequest(item.id)}
                        >
                          Cancel Request
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 0.2,
                    writingMode: 'vertical-rl',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                    color: theme.palette.primary.main
                  }}
                >
                  Transfer REQUEST #{index + 1}
                </Box>
              </Card>
            </Grid>
          </>
        ))}
      </Grid>
    </>
  )
}
