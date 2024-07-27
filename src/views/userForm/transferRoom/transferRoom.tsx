import { ChangeEvent, forwardRef, MouseEvent, useState, useEffect } from 'react'
import {
  Card,
  Grid,
  Button,
  Divider,
  MenuItem,
  TextField,
  CardHeader,
  InputLabel,
  IconButton,
  Typography,
  CardContent,
  CardActions,
  FormControl,
  InputAdornment,
  Select,
  CircularProgress
} from '@mui/material'
import { userStore } from 'src/stores/userStore'
import { useRouter } from 'next/router'

const UserTransferRoom = () => {
  const router = useRouter()
  const [currentData, setCurrentData] = useState(null)
  const [newData, setNewData] = useState<any[]>([])
  const [building, setBuilding] = useState(null)
  const [room, setRoom] = useState(null)
  const [bed, setBed] = useState(null)
  const [newBuilding, setNewBuilding] = useState(null)
  const [newRoom, setNewRoom] = useState(null)
  const [newBed, setNewBed] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, clearStore } = userStore()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return // Check if user is available
      try {
        const user_id = user.user_id
        const res = await fetch(`/api/userForm/${user_id}`)
        const data = await res.json()
        setCurrentData(data)
        console.log('setCurrentData:', data)
        if (data) {
          setBuilding(data.dorm_id)
          setRoom(data.room_id)
          setBed(data.bed_id)
        }
      } catch (error) {
        console.error('Error fetching current data:', error)
      }
    }
    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [user])

  useEffect(() => {
    const fetchDormitoryData = async () => {
      if (!user) return // Check if user is available
      setLoading(true)
      try {
        const user_id = user.user_id
        const res = await fetch(`/api/userForm/transferRoom/read/fetchDormitory?user_id=${user_id}`)
        const data = await res.json()

        if (data) {
          console.log('fetchDormitoryData:', data)
          setNewData(data.result)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching dormitory data:', error)
        setLoading(false)
      }
    }
    fetchDormitoryData()
  }, [user])

  const handleNewBuildingChange = (event: SelectChangeEvent) => {
    const dorm_id = event.target.value as number
    setNewBuilding(dorm_id)
    setNewRoom(null) // Reset room and bed when building changes
    setNewBed(null)
  }

  const handleNewRoomChange = (event: SelectChangeEvent) => {
    const room_id = event.target.value as number
    setNewRoom(room_id)
    setNewBed(null) // Reset bed when room changes
  }

  const handleNewBedChange = (event: SelectChangeEvent) => {
    const bed_id = event.target.value as number
    setNewBed(bed_id)
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!user) return // Check if user is available
    try {
      const user_id = user.user_id
      const data = {
        user_id,
        newBuilding,
        newRoom,
        newBed
      }
      const res = await fetch('/api/userForm/transferRoom/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (res.headers.get('Content-Length') === '0' || !res.ok) {
        console.error('No content or bad response', res.status)
        handleClose()
        return
      }

      try {
        const result = await res.json()
      } catch (error) {
        console.error('Failed to parse JSON', error)
      }

      handleClose()
    } catch (error) {
      console.error('Error submitting transfer room request:', error)
    }
  }

  const handleClose = () => {
    router.push('/userGoogleForm/transferCard/')
  }

  return (
    <Card>
      <CardHeader title='Transfer Room Form' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Current Dormitory Info
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Current Building</InputLabel>
                <Select
                  label='Current Building'
                  value={building || ''}
                  disabled
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value={currentData?.dorm_id}>{currentData?.Dormitory_Building?.name}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Current Room</InputLabel>
                <Select
                  label='Current Room'
                  value={room || ''}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  disabled
                >
                  <MenuItem value={currentData?.room_id}>{currentData?.Dormitory_Room?.room_number}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Current Bed</InputLabel>
                <Select
                  label='Current Bed'
                  value={bed || ''}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  disabled
                >
                  <MenuItem value={currentData?.bed_id}>{currentData?.Dormitory_Bed?.bed_number}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. New Dormitory Assignment
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>New Building</InputLabel>
                <Select
                  label='New Building'
                  value={newBuilding || ''}
                  onChange={handleNewBuildingChange}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {loading ? (
                    <MenuItem disabled>
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    newData?.map((building: any) => (
                      <MenuItem key={building.dorm_id} value={building.dorm_id}>
                        {building.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>New Room</InputLabel>
                <Select
                  label='New Room'
                  value={newRoom || ''}
                  onChange={handleNewRoomChange}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                  disabled={!newBuilding || loading}
                >
                  {newData
                    ?.filter((building: any) => building.dorm_id === newBuilding)
                    .flatMap((building: any) => building.rooms)
                    .map((room: any) => (
                      <MenuItem key={room.room_id} value={room.room_id}>
                        {room.room_number}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>New Bed</InputLabel>
                <Select
                  label='New Bed'
                  value={newBed || ''}
                  onChange={handleNewBedChange}
                  disabled={!newRoom || loading}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {newData
                    ?.filter((building: any) => building.dorm_id === newBuilding)
                    .flatMap((building: any) => building.rooms)
                    .filter((room: any) => room.room_id === newRoom)
                    .flatMap((room: any) => room.beds)
                    .map((bed: any) => (
                      <MenuItem key={bed.bed_id} value={bed.bed_id}>
                        {bed.bed_number}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button size='large' color='secondary' variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default UserTransferRoom
