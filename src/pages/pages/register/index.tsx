// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

interface State {
  password: string
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  const [register, setRegister] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/register/checkRegister').then(res => res.json())
        setRegister(data)
      } catch (error) {
        console.error('Error fetching dormitory room data:', error)
      }
    }
    fetchData()
  }, [])

  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
    student_id: '', // Add the 'student_id' property
    email: '', // Add the 'email' property
    gender: ''
  })

  interface State {
    password: string
    showPassword: boolean
    student_id: string
    email: string
    gender: string
  }

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const router = useRouter()

  const handleSignUp = async () => {
    try {
      // Check if student_id or email already exists
      const isExistingUser = register.some(
        (user) => user.student_id == values.student_id || user.email === values.email
      );

      if (isExistingUser) {
        alert('Student ID or email is already in use.');

        return;
      }

      if (!values.student_id || !values.email || !values.password) {
        console.error('Please fill in all fields')
        alert('Please fill in all fields')

        return
      }

      if (!/^\d+$/.test(values.student_id)) {
        console.error('Student ID must be a number')
        alert('Student ID must be a number')

        return
      }

      if (!/^[\w-]+(\.[\w-]+)*@mail\.wu\.ac\.th$/.test(values.email)) {
        console.error('Invalid email format')
        alert('Invalid email format need to be @mail.wu.ac.th')

        return
      }

      if (values.password.length < 8) {
        console.error('Password must be at least 8 characters long')
        alert('Password must be at least 8 characters long')

        return
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: values.student_id,
          email: values.email,
          password: values.password,
          gender: values.gender,
          role: 'user'
        })
      })

      if (response.ok) {
        console.log('Data inserted successfully')
        alert('Register Success')
        router.push('/pages/login')
      } else {
        console.error('Failed to insert data')
      }
    } catch (error) {
      console.error('Error inserting data:', error)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              component='img'
              src={'https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png'}
              sx={{ height: 75, width: 75 }}
              alt='logo'
            ></Box>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important',
                pt: 6
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              REGISTER
            </Typography>
            <Typography variant='body2'>Make your app </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id='student id'
              label='Student ID'
              sx={{ marginBottom: 4 }}
              onChange={handleChange('student_id')}
            />
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel id='gender-label'>Gender</InputLabel>
              <Select
                labelId='gender-label'
                id='gender'
                value={values.gender}
                label='Gender'
                onChange={handleChange('gender')}
              >
                <MenuItem value='male'>male</MenuItem>
                <MenuItem value='female'>female</MenuItem>
              </Select>
            </FormControl>

            <TextField fullWidth type='email' label='Email' sx={{ marginBottom: 4 }} onChange={handleChange('email')} />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-register-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Fragment>
                  <span>I agree to </span>
                  <Link href='/' passHref>
                    <LinkStyled onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                  </Link>
                </Fragment>
              }
            />
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} onClick={handleSignUp}>
              Sign up
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/login'>
                  <LinkStyled>Sign in instead</LinkStyled>
                </Link>
              </Typography>
            </Box>
            {/* <Divider sx={{ my: 5 }}>or</Divider> */}
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
