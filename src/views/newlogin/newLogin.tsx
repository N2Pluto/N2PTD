// ** React Imports
import { useState, ElementType, SyntheticEvent } from 'react'

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
import { ConsoleNetwork } from 'mdi-material-ui'
import { userStore } from 'src/stores/userStore'
import { user, setUser } from 'src/stores/userStore'
import { route } from 'next/dist/server/router'
import router from 'next/router'

// const ImgStyled = styled('img')(({ theme }) => ({
//   width: 120,
//   height: 120,
//   marginRight: theme.spacing(6.25),
//   borderRadius: theme.shape.borderRadius
// }))

// const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//     textAlign: 'center'
//   }
// }))

// const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
//   marginLeft: theme.spacing(4.5),
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//     marginLeft: 0,
//     textAlign: 'center',
//     marginTop: theme.spacing(4)
//   }
// }))

const Newlogin = () => {

  const { user } = userStore()

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    student_year: '',
    school: '',
    course: '',
    religion: '',
    region: ''
  })

  const handleUserInfo = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/account-setting/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.user_id,
          name: formData.name,
          lastname: formData.lastname,
          student_year: formData.student_year,
          school: formData.school,
          course: formData.course,
          religion: formData.religion,
          region: formData.region
        })
      })

      const { data, error } = await response.json()

      if (error) {
        console.error('Error Update data into USers table:', error.message)
      } else {
        console.log('Data Update Success:', data)
        alert('Data Update Success')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error Update data into USers table:', error.message)
    }
  }

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <CardContent>
      <Typography variant='h6' gutterBottom>
        {/* Account Information User {userStoreInstance.user.student_id} */}
      </Typography>
      <form onSubmit={handleUserInfo}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='student id' placeholder='student id' defaultValue={user?.student_id} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Email' placeholder='Email' defaultValue={user?.email} disabled />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Lastname'
              name='lastname'
              value={formData.lastname}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Student_Year'
              name='student_year'
              value={formData.student_year}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='School'
              name='school'
              value={formData.school}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Course'
              name='course'
              value={formData.course}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Religion'
              name='religion'
              value={formData.religion}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Region'
              name='region'
              value={formData.region}
              onChange={handleChange}
            />
            </Grid>



          <Grid item xs={12}>
            <Button type='submit' variant='contained' color='primary'>
              SAVE!
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default Newlogin
