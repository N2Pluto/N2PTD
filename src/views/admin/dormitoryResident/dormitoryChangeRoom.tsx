import * as React from 'react'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Drawer from '@mui/material/Drawer'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface ChangeRoomProps {
  open: boolean
  onClose: () => void
  id: string
  resetSelected: () => void
  onOpenSnackbar: () => void
}

export default function ChangeRoom({ open, onClose, id, resetSelected, onOpenSnackbar }: ChangeRoomProps) {
  const [data, setData] = useState(null)
  const [newData, setNewData] = useState<any[]>([])
  const [building, setBuilding] = useState(null)
  const [room, setRoom] = useState(null)
  const [bed, setBed] = useState(null)
  const [newBuilding, setNewBuilding] = useState(null)
  const [newRoom, setNewRoom] = useState(null)
  const [newBed, setNewBed] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/admin/dormitoryResident/read/${id}`)
      const data = await res.json()
      setData(data)
      if (data) {
        setBuilding(data.dorm_id)
        setRoom(data.room_id)
        setBed(data.bed_id)
      }
    }
    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [id])

  useEffect(() => {
    let isCancelled = false
    const fetchDormitoryData = async () => {
      setLoading(true)
      const res = await fetch(`/api/admin/dormitoryResident/read/fetchDormitoryData`)
      const data = await res.json()

      if (!isCancelled) {
        setNewData(data.result)
        setLoading(false)
      }
    }

    fetchDormitoryData()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const res = await fetch(`/api/admin/dormitoryResident/update/changeRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newBuilding, newRoom, newBed, id })
    })

    if (res.ok) {
      resetSelected()
      handleClose()
      onOpenSnackbar()
    } else {
      console.error('Error:', res.status, res.statusText)
    }
  }

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

  const handleClose = () => {
    setNewBuilding(null)
    setNewRoom(null)
    setNewBed(null)
    onClose()
  }

  return (
    <React.Fragment>
      <Drawer
        anchor='bottom'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          sx: { padding: 3, height: '55%' } // Adjust the height as needed
        }}
      >
        <Box mb={2}>
          <Typography variant='h6'>Change Room Assignment</Typography>
        </Box>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant='subtitle1' gutterBottom>
                  Current Dormitory Information
                </Typography>
              </Box>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id='building-select-label'>Building</InputLabel>
                <Select
                  label='Building'
                  value={building || ''}
                  id='building-select'
                  labelId='building-select-label'
                  disabled
                >
                  <MenuItem value={data?.dorm_id}>{data?.Dormitory_Building?.name}</MenuItem>
                </Select>
                <Typography variant='body2' color='textSecondary'>
                  This field displays the current building where the resident is assigned.
                </Typography>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id='room-number-select-label'>Room Number</InputLabel>
                <Select
                  label='Room Number'
                  value={room || ''}
                  id='room-number-select'
                  labelId='room-number-select-label'
                  disabled
                >
                  <MenuItem value={data?.room_id}>{data?.Dormitory_Room?.room_number}</MenuItem>
                </Select>
                <Typography variant='body2' color='textSecondary'>
                  This field displays the current room number where the resident is assigned.
                </Typography>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id='bed-select-label'>Bed</InputLabel>
                <Select label='Bed' value={bed || ''} id='bed-select' labelId='bed-select-label' disabled>
                  <MenuItem value={data?.bed_id}>{data?.Dormitory_Bed?.bed_number}</MenuItem>
                </Select>
                <Typography variant='body2' color='textSecondary'>
                  This field displays the current bed where the resident is assigned.
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <Typography variant='subtitle1' gutterBottom>
                  New Dormitory Assignment
                </Typography>
              </Box>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id='new-building-select-label'>Building</InputLabel>
                <Select
                  label='Building'
                  value={newBuilding || ''}
                  onChange={handleNewBuildingChange}
                  id='new-building-select'
                  labelId='new-building-select-label'
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
                <Typography variant='body2' color='textSecondary'>
                  Select the new building to which you want to assign the resident.
                </Typography>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id='new-room-number-select-label'>Room Number</InputLabel>
                <Select
                  label='Room Number'
                  value={newRoom || ''}
                  onChange={handleNewRoomChange}
                  id='new-room-number-select'
                  labelId='new-room-number-select-label'
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
                <Typography variant='body2' color='textSecondary'>
                  Select the new room number within the selected building.
                </Typography>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel id='new-bed-select-label'>Bed</InputLabel>
                <Select
                  label='Bed'
                  value={newBed || ''}
                  onChange={handleNewBedChange}
                  id='new-bed-select'
                  labelId='new-bed-select-label'
                  disabled={!newRoom || loading}
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
                <Typography variant='body2' color='textSecondary'>
                  Select the new bed within the selected room.
                </Typography>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type='submit'>Update</Button>
        </DialogActions>
      </Drawer>
    </React.Fragment>
  )
}
