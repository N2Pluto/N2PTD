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
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

interface State {
  password: string
  password2: string
  showPassword: boolean
  showPassword2: boolean
}

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

const FormBuilding = () => {
  // ** States
  const [language, setLanguage] = useState<string[]>([])
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [values, setValues] = useState<State>({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })

  // Handle Password
  const handlePasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Confirm Password
  const handleConfirmChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 })
  }
  const handleMouseDownConfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  // Handle Select
  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setLanguage(event.target.value as string[])
  }

  return (
    <Card>
      <CardHeader title='Form for adding a dormitory' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Building Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField fullWidth label='dormitory name' placeholder='WU Dormitory ' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Gender</InputLabel>
                <Select
                  label='Gender'
                  defaultValue=''
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
                label='price'
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
                <InputLabel id='form-layouts-separator-select-label'>Bathroom</InputLabel>
                <Select
                  label='type_bathroom'
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
                <InputLabel id='form-layouts-separator-select-label'>Bed</InputLabel>
                <Select
                  label='type_bedtype'
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
                <InputLabel id='form-layouts-separator-select-label'>Roommate</InputLabel>
                <Select
                  label='type_roommate'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='4 '>4</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Furniture' placeholder='' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Facilities' placeholder='' />
            </Grid>


            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Room Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='First Name' placeholder='Leonard' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Last Name' placeholder='Carter' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Country</InputLabel>
                <Select
                  label='Country'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='UK'>UK</MenuItem>
                  <MenuItem value='USA'>USA</MenuItem>
                  <MenuItem value='Australia'>Australia</MenuItem>
                  <MenuItem value='Germany'>Germany</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-multiple-select-label'>Language</InputLabel>
                <Select
                  multiple
                  value={language}
                  onChange={handleSelectChange}
                  id='form-layouts-separator-multiple-select'
                  labelId='form-layouts-separator-multiple-select-label'
                  input={<OutlinedInput label='Language' id='select-multiple-language' />}
                >
                  <MenuItem value='English'>English</MenuItem>
                  <MenuItem value='French'>French</MenuItem>
                  <MenuItem value='Spanish'>Spanish</MenuItem>
                  <MenuItem value='Portuguese'>Portuguese</MenuItem>
                  <MenuItem value='Italian'>Italian</MenuItem>
                  <MenuItem value='German'>German</MenuItem>
                  <MenuItem value='Arabic'>Arabic</MenuItem>
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
  )
}

export default FormBuilding
