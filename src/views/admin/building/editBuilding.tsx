// ** React Imports
import { useState } from 'react'

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

interface FormData {
  name?: string
  room_total?: string
  images_url?: string
  type_gender?: string
  price?: string
  type_building?: string
  type_bathroom?: string
  type_bedtype?: string
  type_bedcapacity?: string
  type_roommate?: string
  type_furniture?: { title: string }[]
  type_facilities?: { title: string }[]
}

const EditBuilding = () => {
  // ** States

  const [buildingInfo, setBuildingInfo] = useState([])
  const [formData, setFormData] = useState<FormData>({})

  const router = useRouter()

 useEffect(() => {
   const fetchBuilding = async () => {
     try {
       const dorm_id = router.query.id
       const response = await fetch(`/api/admin/read/${dorm_id}`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json'
         }
       })
       const data = await response.json()
       if (data.buildingData) {
         setBuildingInfo(data.buildingData)
       } else {
         console.log('No data returned from API')
       }
     } catch (error) {
       console.error('Error fetching building data:', error)
     }
   }

   fetchBuilding()
 }, [router.query.id])

  const handleInputChange = e => {
    const { name, value } = e.target

    if (name === 'name') {
      setFormData({ ...formData, [name]: value })
      setBuildingInfo({ ...buildingInfo, [name]: value })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  const handleMultipleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      const dorm_id = router.query.id
      const response = await fetch(`/api/admin/edit/updateBuilding`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dorm_id, ...formData })
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Error updating building data:', error)
    }
    router.push('/admin/building')
  }

  return (
    <>
      <Card>
        <CardHeader title='Form for editing a dormitory' titleTypographyProps={{ variant: 'h6' }} />
        <Divider sx={{ margin: 0 }} />
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
                name='name'
                value={formData.name || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Room total'
                placeholder='Room total.'
                name='room_total'
                value={formData.room_total || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Images Url'
                placeholder='Images Url'
                name='images_url'
                value={formData.images_url || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Type Gender</InputLabel>
                <Select
                  label='Type Gender'
                  name='type_gender'
                  value={formData.type_gender || ''}
                  onChange={handleInputChange}
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
                name='price'
                value={formData.price || ''}
                onChange={handleInputChange}
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
                  name='type_building'
                  value={formData.type_building || ''}
                  onChange={handleInputChange}
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
                  name='type_bathroom'
                  value={formData.type_bathroom || ''}
                  onChange={handleInputChange}
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
                  name='type_bedtype'
                  value={formData.type_bedtype || ''}
                  onChange={handleInputChange}
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='bunk bed'>bunk bed</MenuItem>
                  <MenuItem value='single bed'>single bed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Bed Capacity</InputLabel>
                <Select
                  label='Bed Capacity'
                  name='type_bedcapacity'
                  value={formData.type_bedcapacity || ''}
                  onChange={handleInputChange}
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
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Roommate</InputLabel>
                <Select
                  label='type_roommate'
                  name='type_roommate'
                  value={formData.type_roommate || ''}
                  onChange={handleInputChange}
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
                value={formData.type_furniture || []}
                onChange={(event, newValue) => handleMultipleSelect('type_furniture', newValue)}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.title}
                  </li>
                )}
                style={{ width: 665 }}
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
                value={formData.type_facilities || []}
                onChange={(event, newValue) => handleMultipleSelect('type_facilities', newValue)}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.title}
                  </li>
                )}
                style={{ width: 665 }}
                renderInput={params => <TextField {...params} label='Facility' placeholder='Facility' />}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined'>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </>
  )
}

export default EditBuilding