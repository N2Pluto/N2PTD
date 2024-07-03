// this is pages/login/index.tsx

import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { userStore } from 'src/stores/userStore'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

interface State {
  email_student_id: string
  password: string
  showPassword: boolean
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [student_id, setStudent_id] = useState(null)
  const [check, setCheck] = useState(null)
  const { setUser } = userStore()
  const router = useRouter()

  // ** State
  const [values, setValues] = useState<State>({
    email_student_id: '',
    password: '',
    showPassword: false
  })

  // ** Hook

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleCheck = async () => {
    if (check.trim() !== '') {
      if (check.includes('@')) {
        setEmail(check)
        console.log('email:', check)
        handleLogin(check)
      } else {
        setStudent_id(check)
        console.log('student_id:', check)
        handleLogin(check)
      }
    } else {
      alert('Please fill in all fields')
    }
  }

  const handleLogin = async (check: string) => {
    try {
      let body
      if (check.includes('@')) {
        body = JSON.stringify({ email: check, password })
      } else {
        body = JSON.stringify({ student_id: check, password })
      }

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      })

      if (response.ok) {
        const data = await response.json()

        setUser(data?.user)
        console.log(data?.user)
        localStorage.setItem('accessToken', data.accessToken)

        // Fetch the name from Users_Info
        const userInfoResponse = await fetch(`/api/login/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: data?.user.user_id })
        })
        const userInfoData = await userInfoResponse.json()

        //check role
        if (data?.user.role === 'admin') {
          router.push('/admin/home')
        } else if (data?.user.role === 'user') {
          if (!userInfoData?.name) {
            router.push('/pages/newlogin/personality')
          } else {
            router.push('/dashboard')
          }
        }
      } else {
        const errorData = await response.json()
        alert('Login failed : Email , Student id or password is incorrect.')

        console.log('Login failed:', errorData.message)
      }
    } catch (error) {
      console.log('Error during login:', error)
    }
  }

  useEffect(() => {
    const fetchUserbyUserID = async () => {
      try {
        const response = await fetch('/api/users/').then(res => res.json())
        console.log('data:', response)
        setUser(response.data)

        if (response.data.accessToken === null) {
          router.push('/dashboard')
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error fetching users data:', error)
      }
    }

    fetchUserbyUserID()
  }, [router, setUser])

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
                pt: 6,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}
            </Typography>
            <Typography variant='body2'>Please Login to your account </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id='email_student_id'
              label='Email Walailak University or Student ID'
              onChange={e => setCheck(e.target.value)}
              sx={{ marginBottom: 4 }}
              required
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={password}
                id='auth-login-password'
                onChange={e => setPassword(e.target.value)}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
                required
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <Link passHref href='login/forget'>
                <LinkStyled>Forgot Password?</LinkStyled>
              </Link>
            </Box>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} onClick={handleCheck}>
              Login
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/register'>
                  <LinkStyled>Register Account</LinkStyled>
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
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
