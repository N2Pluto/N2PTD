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
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled } from '@mui/material/styles'

const ExpandMore = styled(props => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

export default function EditProfileList() {
  const theme = useTheme()
  const { user } = userStore()
  const [changeRoomData, setChangeRoomData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expanded, setExpanded] = useState(-1) // Initialize with -1 to indicate no card is expanded

  const handleExpandClick = index => {
    setExpanded(expanded === index ? -1 : index) // Toggle the expanded state
  }

  const fetchData = async () => {
    if (!user) {
      console.error('User is null')
      return
    }

    setIsLoading(true)
    const user_id = user.user_id
    const response = await fetch(`/api/userForm/editProfile/read/${user_id}`)
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
        {changeRoomData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              variant='outlined'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginBottom: 2,
                height: '100%'
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 'medium', marginBottom: 2 }}>
                    EDIT PROFILE #{index + 1} 
                    {/* {item.userInfo?.name} {item.userInfo?.lastname} */}
                  </Typography>
                  {/* Conditional rendering for Edit Profile Info messages */}
                  {(item.name || item.lastname) && (
                    <Typography variant='body2' gutterBottom sx={{ fontStyle: 'italic', marginBottom: 1 }}>
                      Request to edit name and surname
                    </Typography>
                  )}
                  {(item.school || item.department || item.major) && (
                    <Typography variant='body2' gutterBottom sx={{ fontStyle: 'italic', marginBottom: 1 }}>
                      Request to edit educational information
                    </Typography>
                  )}
                  {item.gender && (
                    <Typography variant='body2' gutterBottom sx={{ fontStyle: 'italic', marginBottom: 1 }}>
                      Request to edit gender information
                    </Typography>
                  )}
                  {item.religion && (
                    <Typography variant='body2' gutterBottom sx={{ fontStyle: 'italic', marginBottom: 1 }}>
                      Request to edit religious information
                    </Typography>
                  )}
                  {item.phone && (
                    <Typography variant='body2' gutterBottom sx={{ fontStyle: 'italic', marginBottom: 1 }}>
                      Request to edit contact information
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>{getStatusChip(item.status)}</Box>
                {item.status === 'Pending' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button variant='outlined' color='error' size='small' onClick={() => handleCancelRequest(item.id)}>
                      Cancel Request
                    </Button>
                  </Box>
                )}
              </CardContent>
           
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
