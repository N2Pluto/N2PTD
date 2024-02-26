// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'



const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {

  const [course, setCourse] = useState('')
  const [school, setSchool] = useState('')
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [religion, setReligion] = useState('')
  const [region, setRegion] = useState('')

  const handleupdate = async (event: SyntheticEvent) => {
    try {
      event.preventDefault()
      const response = await fetch('/api/account-setting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course,
          lastname,
          name,
          region,
          religion,
          school,
        })
      })

      const data = await response.json()
      console.log(data)
    }catch(error){
      console.error('Error updating data:', error)
    }
  }


  return (
    <CardContent>
      <form onSubmit={handleupdate}>
        <Grid container spacing={7}>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='name' placeholder='' defaultValue='' onChange={e => setName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='lastname' placeholder='' defaultValue='' onChange={e => setLastname(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='school' placeholder='' defaultValue='' onChange={e => setSchool(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='course' placeholder='' defaultValue='' onChange={e => setCourse(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='religion' placeholder='' defaultValue='' onChange={e => setReligion(e.target.value)} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='region' placeholder='' defaultValue='' onChange={e => setRegion(e.target.value)} />
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>

          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
