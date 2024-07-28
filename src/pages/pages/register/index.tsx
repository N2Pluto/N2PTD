// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
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
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
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
  student_id: string
  email: string
  gender: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: theme.spacing(4),
  fontFamily: 'Roboto, sans-serif'
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline'
  }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const Alert = styled(MuiAlert)<AlertProps>(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2)
}))

const RegisterPage = () => {
  const [register, setRegister] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

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
    student_id: '',
    email: '',
    gender: ''
  })

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSignUp = async () => {
    try {
      // Check if student_id exists in the Student table
      const studentResponse = await fetch(`/api/register/student/${values.student_id}`)
      const studentData = await studentResponse.json()

      if (!studentData || !studentData.student_id) {
        setSnackbarMessage('Student ID does not exist in the system.')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }
      const isExistingUser = register.some(user => user.student_id == values.student_id || user.email === values.email)

      if (isExistingUser) {
        setSnackbarMessage('Student ID or email is already in use.')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      if (!values.student_id || !values.email || !values.password) {
        setSnackbarMessage('Please fill in all fields')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      if (!/^\d{8}$/.test(values.student_id)) {
        setSnackbarMessage('Student ID must be a number and exactly 8 digits long')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      if (!/^[\w-]+(\.[\w-]+)*@mail\.wu\.ac\.th$/.test(values.email)) {
        setSnackbarMessage('Invalid email format. It must be @mail.wu.ac.th')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }

      if (values.password.length < 8) {
        setSnackbarMessage('Password must be at least 8 characters long')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
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
        setSnackbarMessage('Register Success')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        router.push('/pages/login')
      } else {
        setSnackbarMessage('Please fill in all fields')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    } catch (error) {
      setSnackbarMessage('Please fill in all fields')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent>
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
                pt: 6,
                fontFamily: '"Roboto", sans-serif'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, fontFamily: '"Roboto", sans-serif' }}>
              REGISTER
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id='student id'
              label='Student ID'
              sx={{ marginBottom: 4, fontFamily: '"Roboto", sans-serif' }}
              onChange={handleChange('student_id')}
            />

            <TextField
              fullWidth
              type='email'
              label='Email'
              sx={{ marginBottom: 4, fontFamily: '"Roboto", sans-serif' }}
              onChange={handleChange('email')}
            />
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

            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7, mt: 4 }} onClick={handleSignUp}>
              Sign up
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2, fontFamily: '"Roboto", sans-serif' }}>
                Already have an account?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/login'>
                  <LinkStyled>Login Instead</LinkStyled>
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'right', pt: 6 }}>
              <Typography variant='body2'>
                <Link passHref href='/'>
                  <LinkStyled>Back to home</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
