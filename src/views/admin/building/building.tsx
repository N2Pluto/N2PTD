import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  Grid,
  Typography,
  IconButton
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { styled } from '@mui/material/styles'
import DeleteBuilding from './deleteBuilding'
import EditBuilding from './editBuilding'
import FormBuilding from './formBuilding'
import EditRoom from './room/editRoom'
import DeleteIcon from '@mui/icons-material/Delete'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  success: {
    backgroundColor: theme.palette.success.dark
  }
}))

const Building = ({ dorm_id }) => {
  const classes = useStyles()
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editBuildingDrawerOpen, setEditBuildingDrawerOpen] = useState(false)
  const [editRoomDrawerOpen, setEditRoomDrawerOpen] = useState(false)
  const [currentEditingDormId, setCurrentEditingDormId] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarEditOpen, setSnackbarEditOpen] = useState(false)
  const [snackbarDeleteOpen, setSnackbarDeleteOpen] = useState(false)
  const router = useRouter()

  const handleSnackbarDeleteClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarDeleteOpen(false)
  }

  const handleSnackbarEditClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarEditOpen(false)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const handleClick = () => {
    setDrawerOpen(true)
  }

  const handleEditBuilding = (id: string) => {
    setCurrentEditingDormId(id) // Store the dorm_id of the building being edited
    setEditBuildingDrawerOpen(true)
  }
  const handleEditRoom = (id: string) => {
    router.push(`/admin/building/editBuilding/editRoom/${id}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/admin/read/fetch_building').then(res => res.json())
        if (data) {
          setDormitoryBuilding(data)
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const handleDeleteBuilding = async dorm_id => {
    try {
      const response = await fetch('/api/admin/delete/building/deleteBuildingByID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dorm_id })
      })

      if (!response.ok) {
        throw new Error(`Response is not ok. Status: ${response.status}, Status Text: ${response.statusText}`)
      }

      // Refresh the dormitoryBuilding data after successful deletion
      const { data } = await fetch('/api/admin/read/fetch_building').then(res => res.json())

      setDormitoryBuilding(data)
      setSnackbarDeleteOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Adding a building ' titleTypographyProps={{ variant: 'h6' }} />
        <CardMedia
          sx={{ height: '20.375rem' }}
          image='https://cdn.pixabay.com/photo/2022/06/26/16/07/shop-7285838_1280.png'
        />
        <CardContent sx={{ padding: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Dormitory
          </Typography>
          <Typography variant='body2'>Click to add a dormitory. for building a new dormitory</Typography>
        </CardContent>
        <Button
          onClick={handleClick}
          variant='contained'
          sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
          Add To Dormitory
        </Button>
      </Card>

      <Grid container spacing={3} sx={{ pt: 5 }}>
        {dormitoryBuilding &&
          dormitoryBuilding.map(dorm => (
            <Grid item xs={12} sm={6} md={4} key={dorm.dorm_id}>
              <Card>
                <CardActionArea>
                  <CardMedia sx={{ height: '14.5625rem' }} image={dorm.images_url} />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {dorm.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {dorm.dorm_description}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <CardActions>
                  <Box display='flex' justifyContent='space-between' width='100%'>
                    <Box>
                      <Button size='small' color='primary' onClick={() => handleEditBuilding(dorm.dorm_id)}>
                        EDIT BUILDING
                      </Button>
                      <Button size='small' color='primary' onClick={() => handleEditRoom(dorm.dorm_id)}>
                        EDIT ROOM
                      </Button>
                    </Box>
                    <DeleteBuilding
                      dorm_id={dorm.dorm_id}
                      name={dorm.name}
                      handleDeleteBuilding={handleDeleteBuilding}
                    ></DeleteBuilding>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Drawer anchor='right' open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: '50vw', p: 3 }}>
          {' '}
          <FormBuilding onClose={() => setDrawerOpen(false)} setSnackbarOpen={setSnackbarOpen} />
        </Box>
      </Drawer>
      <Drawer anchor='right' open={editBuildingDrawerOpen} onClose={() => setEditBuildingDrawerOpen(false)}>
        <Box sx={{ width: '50vw', p: 3 }}>
          <EditBuilding
            onClose={() => setEditBuildingDrawerOpen(false)}
            dorm_id={currentEditingDormId}
            setSnackbarEditOpen={setSnackbarEditOpen}
          />
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'  Dormitory created successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />

      <Snackbar
        open={snackbarEditOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarEditClose}
        message={
          <span>
            <CheckCircleIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'  Dormitory edited successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarEditClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.success }}
      />

      <Snackbar
        open={snackbarDeleteOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarDeleteClose}
        message={
          <span>
            <ErrorIcon fontSize='small' style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {'  Dormitory deleted successfully!'}
          </span>
        }
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarDeleteClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{ className: classes.error }}
      />
    </>
  )
}

export default Building
