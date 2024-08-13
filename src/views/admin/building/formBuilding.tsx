// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import sendLogsadmincontorl from 'src/pages/api/log/admin/control/insert'
import { userStore } from 'src/stores/userStore'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

const furnitureOptions = [
  { title: 'closet' },
  { title: '3.5-foot mattress' },
  { title: 'reading desk' },
  { title: 'chair' }
]

const facilityOptions = [
  { title: 'high-speed internet' },
  { title: 'washing machine' },
  { title: 'clothes dryer' },
  { title: 'water dispenser' },
  { title: 'fingerprint access system' },
  { title: 'CCTV' },
  { title: '7-11 Automatic Food Cabinet' }
]

const FormBuilding = ({ onClose, setSnackbarOpen }) => {
  // ** States
  const [name, setName] = useState('')
  const [images_url, setImagesUrl] = useState('')
  const [type_gender, setTypeGender] = useState('')
  const [price, setPrice] = useState('')
  const [type_building, setTypeBuilding] = useState('')
  const [type_bathroom, setTypeBathroom] = useState('')
  const [type_bedtype, setTypeBed] = useState('')
  const [type_bedcapacity, setTypeBedCapacity] = useState('')
  const [type_roommate, setTypeRoommate] = useState('')
  const [type_furniture, setFurniture] = useState([])
  const [type_facilities, setFacility] = useState([])
  const [floor, setFloor] = useState('')
  const [roomsPerFloor, setRoomsPerFloor] = useState<string[]>([])
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const router = useRouter()
  const { user } = userStore()

  const loguseredit = async (name: string, room_total: number) => {
    const content = `Create '${name} Room total:'${room_total}' Gender:'${type_gender}' Price:'${price}' Bedcapacity:'${type_bedcapacity}'`
    await sendLogsadmincontorl(user?.student_id, content, 'Create')
  }

  const handleRoomsChange = (index: number, value: string) => {
    const newRoomsPerFloor = [...roomsPerFloor]
    newRoomsPerFloor[index] = value
    setRoomsPerFloor(newRoomsPerFloor)
  }

  const generateRoomNumbers = () => {
    const roomNumbers: string[] = []
    let floorNumber = 1
    for (const rooms of roomsPerFloor) {
      for (let i = 1; i <= parseInt(rooms, 10); i++) {
        const roomNumber = `${floorNumber}${String(i).padStart(2, '0')}`
        roomNumbers.push(roomNumber)
      }
      floorNumber++
    }

    return roomNumbers
  }

  const calculateRoomTotal = () => {
    return roomsPerFloor.reduce((total, rooms) => total + parseInt(rooms || '0', 10), 0)
  }

  const handleFloorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFloor(event.target.value as string)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const room_total = calculateRoomTotal()

    const response = await fetch('/api/admin/create/createBuilding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        room_total,
        images_url,
        type_gender,
        price,
        type_building,
        type_bathroom,
        type_bedtype,
        type_bedcapacity,
        type_roommate: type_bedcapacity,
        type_furniture: type_furniture.map(furniture => furniture.title),
        type_facilities: type_facilities.map(facility => facility.title),
        latitude,
        longitude
      })
    })
    loguseredit(name, room_total)

    if (!response.ok) {
      console.error('Failed to create dormitory')
      window.alert('Failed to create dormitory')
    } else {
      const data = await response.json()
      console.log('data', data)

      const dormId = data.data.dorm_id
      console.log('dormId', dormId)

      const roomNumbers = generateRoomNumbers()

      for (const roomNumber of roomNumbers) {
        const roomResponse = await fetch('/api/admin/create/createRoom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dorm_id: dormId,
            room_number: roomNumber,
            bed_capacity: type_bedcapacity
          })
        })

        if (!roomResponse.ok) {
          console.error('Failed to create room')
          window.alert('Failed to create room')
        } else {
          const roomData = await roomResponse.json()
          const roomId = roomData.data.room_id

          const bedResponse = await fetch('/api/admin/create/createBed', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              room_id: roomId,
              bed_capacity: type_bedcapacity
            })
          })

          if (!bedResponse.ok) {
            console.error('Failed to create beds')
            window.alert('Failed to create beds')
          }
        }
      }
      setSnackbarOpen(true)
      onClose()
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ pb: 2, pt: 5, pr: 2, ml: 4 }}>
          Create Dormitory
        </Typography>
        <IconButton onClick={onClose}>
          {' '}
          <CloseIcon sx={{ pt: 2, fontSize: '35px' }} />
        </IconButton>
      </Box>
      <Divider />

      <Card>
        <form onSubmit={handleFormSubmit}>
          <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  1. Building Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label='Dormitory name'
                  placeholder='WU Dormitory'
                  value={name}
                  onChange={event => setName(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label='Images Url'
                  placeholder='Images Url'
                  value={images_url}
                  onChange={event => setImagesUrl(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Type Gender</InputLabel>
                  <Select
                    label='Type Gender'
                    value={type_gender}
                    onChange={event => setTypeGender(event.target.value)}
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='male'>male</MenuItem>
                    <MenuItem value='female'>female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Price'
                  value={price}
                  onChange={event => setPrice(event.target.value)}
                  placeholder=''
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Type Building</InputLabel>
                  <Select
                    label='type_building'
                    value={type_building}
                    onChange={event => setTypeBuilding(event.target.value)}
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='Air conditioner'>Air conditioner</MenuItem>
                    <MenuItem value='Ceiling fan'>Ceiling fan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Type Bathroom</InputLabel>
                  <Select
                    label='type_bathroom'
                    value={type_bathroom}
                    onChange={event => setTypeBathroom(event.target.value)}
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='shared bathroom'>shared bathroom</MenuItem>
                    <MenuItem value='en suite bathroom'>en suite bathroom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Type Bed</InputLabel>
                  <Select
                    label='type_bedtype'
                    value={type_bedtype}
                    onChange={event => setTypeBed(event.target.value)}
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='bunk bed '>bunk bed</MenuItem>
                    <MenuItem value='single bed'>single bed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Bed Capacity</InputLabel>
                  <Select
                    label='Bed Capacity'
                    value={type_bedcapacity}
                    onChange={event => setTypeBedCapacity(event.target.value)}
                    defaultValue=''
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='2'>2</MenuItem>
                    <MenuItem value='4'>4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  id='checkboxes-tags-demo'
                  options={furnitureOptions}
                  disableCloseOnSelect
                  getOptionLabel={option => option.title}
                  value={type_furniture}
                  onChange={(event, newValue) => {
                    setFurniture(newValue)
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                      {option.title}
                    </li>
                  )}
                  style={{ width: '100%' }}
                  renderInput={params => <TextField {...params} label='Furniture' placeholder='Furniture' />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  multiple
                  id='checkboxes-tags-demo'
                  options={facilityOptions}
                  disableCloseOnSelect
                  getOptionLabel={option => option.title}
                  value={type_facilities}
                  onChange={(event, newValue) => {
                    setFacility(newValue)
                  }}
                  style={{ width: '100%' }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                      {option.title}
                    </li>
                  )}
                  renderInput={params => <TextField {...params} label='Facility' placeholder='Facility' />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Latitude'
                  placeholder='Latitude'
                  value={latitude}
                  onChange={event => setLatitude(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Longitude'
                  placeholder='Longitude'
                  value={longitude}
                  onChange={event => setLongitude(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ marginBottom: 0 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  2. Room Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel id='form-layouts-separator-select-label'>Floor</InputLabel>
                  <Select
                    label='Floor'
                    value={floor}
                    onChange={(event: SelectChangeEvent<string>) => {
                      if (event.target.value === 'reset') {
                        setFloor('')
                        setRoomsPerFloor([])
                      } else {
                        handleFloorChange(event)
                      }
                    }}
                    id='form-layouts-separator-select'
                    labelId='form-layouts-separator-select-label'
                  >
                    <MenuItem value='reset'>Reset</MenuItem>
                    <MenuItem value='1'>1</MenuItem>
                    <MenuItem value='2'>2</MenuItem>
                    <MenuItem value='3'>3</MenuItem>
                    <MenuItem value='4'>4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {Array.from({ length: Number(floor) || 0 }, (_, index) => (
                <Grid item xs={12} sm={12} key={index} container justifyContent='space-between' alignItems='center'>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={`Rooms in Floor ${index + 1}`}
                      placeholder='Input number of room'
                      value={roomsPerFloor[index] || ''}
                      onChange={event => handleRoomsChange(index, event.target.value)}
                    />
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12} sm={12}>
                {floor && floor !== 'reset' && (
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    Room Numbers: {generateRoomNumbers().join(', ')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ margin: 0 }} />
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <Button size='large' color='secondary' variant='outlined' onClick={onClose}>
              Cancel
            </Button>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
              Submit
            </Button>
          </CardActions>
        </form>
      </Card>
    </>
  )
}

export default FormBuilding
