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

import { useRouter } from 'next/router'
import { useEffect } from 'react'

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

const EditRoom = () => {
  // ** States
 
  const [floor, setFloor] = useState('')
  const [bedCapacity, setBedCapacity] = useState('')
  const [roomsPerFloor, setRoomsPerFloor] = useState<string[]>([])
  const [dormitoryBuilding, setDormitoryBuilding] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dorm_id = router.query.id
        const { data } = await fetch(`/api/admin/read/${dorm_id}`).then(res => res.json())
        if (data) {
          // Ensure data is an array
          setDormitoryBuilding(Array.isArray(data) ? data : [data])
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  console.log('building', dormitoryBuilding)

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

  const handleFloorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFloor(event.target.value as string)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
  }

  return (
    <>
        <Card >
          <CardHeader title='Form for Ediit Room' titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ margin: 0 }} />
          <form onSubmit={handleFormSubmit}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Divider sx={{ marginBottom: 0 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    2. Room Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={2} key={index} container justifyContent='space-between' alignItems='center'>
                    <Grid item xs={10}>
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
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    Room Numbers: {generateRoomNumbers().join(', ')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label'>Bed Capacity</InputLabel>
                    <Select
                      label='Bed Capacity'
                      value={bedCapacity}
                      onChange={event => setBedCapacity(event.target.value)}
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                    >
                      <MenuItem value='2'>2</MenuItem>
                      <MenuItem value='4'>4</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Divider sx={{ margin: 0 }} />
            <CardActions>
              <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
                Submit
              </Button>
              <Button size='large' color='secondary' variant='outlined'>
                Cancel
              </Button>
            </CardActions>
          </form>
        </Card>
    </>
  )
}

export default EditRoom 
