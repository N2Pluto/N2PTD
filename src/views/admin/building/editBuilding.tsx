import { useState, useEffect } from 'react'
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
import Select from '@mui/material/Select'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useRouter } from 'next/router'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'

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

const EditBuilding = ({ dorm_id, onClose, setSnackbarEditOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    room_total: '',
    images_url: '',
    type_gender: '',
    price: '',
    type_building: '',
    type_bathroom: '',
    type_bedtype: '',
    type_bedcapacity: '',
    type_roommate: '',
    type_furniture: [],
    type_facilities: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/read/${dorm_id}`)
        const { data } = await response.json()
        if (data) {
          const parsedData = {
            ...data,
            type_furniture:
              typeof data.type_furniture === 'string' ? JSON.parse(data.type_furniture) : data.type_furniture,
            type_facilities:
              typeof data.type_facilities === 'string' ? JSON.parse(data.type_facilities) : data.type_facilities
          }
          setFormData(parsedData)
          console.log('setFormData data:', parsedData)
        } else {
          console.error('No data returned from API')
        }
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [dorm_id])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleMultipleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    try {
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
    setSnackbarEditOpen(true)
    onClose()
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ pb: 2, pt: 5, pr: 2, ml: 4 }}>
          Edit Dormitory
        </Typography>
        <IconButton onClick={onClose}>
          {' '}
          <CloseIcon sx={{ pt: 2, fontSize: '35px' }} />
        </IconButton>
      </Box>
      <Divider />

      <Card>
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
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Room total'
                placeholder='Room total.'
                name='room_total'
                value={formData.room_total}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Images Url'
                placeholder='Images Url'
                name='images_url'
                value={formData.images_url}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Type Gender</InputLabel>
                <Select
                  label='Type Gender'
                  name='type_gender'
                  value={formData.type_gender}
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
                value={formData.price}
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
                  value={formData.type_building}
                  onChange={handleInputChange}
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
                  value={formData.type_bathroom}
                  onChange={handleInputChange}
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
                  value={formData.type_bedtype}
                  onChange={handleInputChange}
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
                  label='type_bedcapacity'
                  name='type_bedcapacity'
                  value={formData.type_bedcapacity}
                  onChange={handleInputChange}
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
                  value={formData.type_roommate}
                  onChange={handleInputChange}
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
                value={furnitureOptions.filter(option => formData.type_furniture.includes(option.title))}
                onChange={(event, newValue) =>
                  handleMultipleSelect(
                    'type_furniture',
                    newValue.map(option => option.title)
                  )
                }
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
            <Grid item xs={12} sm={12}>
              <Autocomplete
                multiple
                id='checkboxes-tags-demo'
                options={facilityOptions}
                disableCloseOnSelect
                getOptionLabel={option => option.title}
                value={facilityOptions.filter(option => formData.type_facilities.includes(option.title))}
                onChange={(event, newValue) =>
                  handleMultipleSelect(
                    'type_facilities',
                    newValue.map(option => option.title)
                  )
                }
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.title}
                  </li>
                )}
                style={{ width: '100%' }}
                renderInput={params => <TextField {...params} label='Facility' placeholder='Facility' />}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button size='large' color='secondary' variant='outlined' onClick={onClose}>
            Cancel
          </Button>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        </CardActions>
      </Card>
    </>
  )
}

export default EditBuilding
