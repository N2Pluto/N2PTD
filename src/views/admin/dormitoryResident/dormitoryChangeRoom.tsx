import * as React from 'react'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface ChangeRoomProps {
  open: boolean
  onClose: () => void
  id: string
}

export default function ChangeRoom({ open, onClose, id }: ChangeRoomProps) {
  const [data, setData] = useState(null)
  const [newData, setNewData] = useState(null)
  const [building, setBuilding] = useState(null)
  const [room, setRoom] = useState(null)
  const [bed, setBed] = useState(null)
  const [newBuilding, setNewBuilding] = useState(null)
  const [newRoom, setNewRoom] = useState(null)
  const [newBed, setNewBed] = useState(null)

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
  }, [id])

  useEffect(() => {
    const fetchDormitoryData = async () => {
      const res = await fetch(`/api/admin/dormitoryResident/read/fetchDormitoryData`)
      const data = await res.json()
      setNewData(data)
    }

    fetchDormitoryData()
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
      handleClose()
    } else {
      console.error('Error:', res.status, res.statusText)
    }
  }

  const handleBuildingChange = (event: SelectChangeEvent) => {
    setBuilding(event.target.value as string)
  }

  const handleRoomChange = (event: SelectChangeEvent) => {
    setRoom(event.target.value as string)
  }

  const handleBedChange = (event: SelectChangeEvent) => {
    setBed(event.target.value as string)
  }

  const handleNewBuildingChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const dorm_id = event.target.value as number
    setNewBuilding(dorm_id)
    console.log('setNewBuilding', dorm_id)

    const res = await fetch(`/api/admin/dormitoryResident/read/fetchDormitoryData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dorm_id })
    })

    // handle the response
    if (res.ok) {
      const data = await res.json()
    } else {
      console.error('Error:', res.status, res.statusText)
    }
  }

  const handleNewRoomChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const room_id = event.target.value as number
    setNewRoom(room_id)

    const res = await fetch(`/api/admin/dormitoryResident/read/fetchDormitoryData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ room_id })
    })

    if (res.ok) {
      const data = await res.json()
    } else {
      console.error('Error:', res.status, res.statusText)
    }
  }

  const handleNewBedChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const bed_id = event.target.value as number
    setNewBed(bed_id)

    const res = await fetch(`/api/admin/dormitoryResident/read/fetchDormitoryData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bed_id })
    })

    if (res.ok) {
      const data = await res.json()
    } else {
      console.error('Error:', res.status, res.statusText)
    }
  }

  const handleClose = () => {
    setNewBuilding(null)
    setNewRoom(null)
    setNewBed(null)
    onClose()
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth='lg'
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        {/* <DialogTitle>Subscribe</DialogTitle> */}
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <InputLabel id='building-select-label'>Building</InputLabel>
                <Select
                  label='Building'
                  value={building || ''}
                  onChange={handleBuildingChange}
                  id='building-select'
                  labelId='building-select-label'
                  disabled
                >
                  <MenuItem value={data?.dorm_id}>{data?.Dormitory_Building?.name}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <InputLabel id='room-number-select-label'>Room Number</InputLabel>
                <Select
                  label='Room Number'
                  value={room || ''}
                  onChange={handleRoomChange}
                  id='room-number-select'
                  labelId='room-number-select-label'
                  disabled
                >
                  <MenuItem value={data?.room_id}>{data?.Dormitory_Room?.room_number}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <InputLabel id='bed-select-label'>Bed</InputLabel>
                <Select
                  label='Bed'
                  value={bed || ''}
                  onChange={handleBedChange}
                  id='bed-select'
                  labelId='bed-select-label'
                  disabled
                >
                  <MenuItem value={data?.bed_id}>{data?.Dormitory_Bed?.bed_number}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* //right cell */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <InputLabel id='building-select-label'>Building</InputLabel>
                <Select
                  label='Building'
                  value={newBuilding || ''}
                  onChange={handleNewBuildingChange}
                  id='building-select'
                  labelId='building-select-label'
                >
                  {newData?.newBuilding?.map((building: any) => (
                    <MenuItem key={building.dorm_id} value={building.dorm_id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <InputLabel id='room-number-select-label'>Room Number</InputLabel>
                <Select
                  label='Room Number'
                  value={newRoom || ''}
                  onChange={handleNewRoomChange}
                  id='room-number-select'
                  labelId='room-number-select-label'
                >
                  {newData?.newRoom
                    ?.filter((room: any) => room.dorm_id === building.dorm_id)
                    .map((room: any) => (
                      <MenuItem key={room.room_id} value={room.room_id}>
                        {room.room_number}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <InputLabel id='bed-select-label'>Bed</InputLabel>
                <Select
                  label='Bed'
                  value={newBed || ''}
                  onChange={handleNewBedChange}
                  id='bed-select'
                  labelId='bed-select-label'
                >
                  {newData?.newBed
                    ?.filter((room: any) => bed.room_id === room.room_id)
                    .map((bed: any) => (
                      <MenuItem key={bed.bed_id} value={bed.bed_id}>
                        {bed.bed_number}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type='submit'>Update</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
