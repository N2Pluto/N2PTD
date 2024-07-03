import { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState<string>('')
  const [studentId, setStudentId] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const router = useRouter()

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    setError(null)
  }

  const handleChangeStudentId = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentId(event.target.value)
    setError(null)
  }

  const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value)
    setError(null)
  }

  const handleChangeOtp = (event: ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value)
    setError(null)
  }

  const handleCheck = async () => {
    if (!email || !studentId) {
      setError('Please enter your email and student ID')
      return
    }

    try {
      const response = await fetch('/api/loginforget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, studentId })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setIsVerified(true)
          setError(null)

          // Generate OTP and store it
          const otp = generateOtp()
          setGeneratedOtp(otp) // Store the generated OTP for later verification

          // Send OTP
         const otpResponse = await fetch('/api/loginforget/nodemailer/nodemailer', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             to: email,
             subject: 'Your OTP Code for Password Reset',
             text: `Your OTP code is ${otp}`,
             html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eeeeee;
            }
            .header img {
              max-width: 100px;
              margin-bottom: 20px;
            }
            .content {
              padding: 20px 0;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #4caf50;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eeeeee;
              font-size: 12px;
              color: #999999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://img5.pic.in.th/file/secure-sv1/logof3d9597dfa097dbd.png" alt="Logo">
              <h2>OTP Code for Password Reset</h2>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Please use the OTP code below to proceed:</p>
              <div class="otp">${otp}</div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thank you.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
           })
         })


          if (otpResponse.ok) {
            setIsOtpSent(true)
          } else {
            setError('Failed to send OTP. Please try again.')
          }
        } else {
          setError('Email or student ID is incorrect')
        }
      } else {
        setError('Email or student ID is not in the system. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSubmit = async () => {
    if (!newPassword) {
      setError('Please enter a new password')
      return
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP sent to your email')
      console.log('Please enter the OTP sent to your email')
      return
    }

    // Verify the OTP
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.')
      console.log('Invalid OTP. Please try again.')
      return
    }

    try {
      const response = await fetch('/api/loginforget/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, studentId, otp, newPassword })
      })

      if (response.ok) {
        router.push('/pages/login')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'An error occurred. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
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
            />
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
              Forgot Your Password?
            </Typography>
            <Typography variant='body2'>Enter your email and student ID to reset your password.</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id='email'
              label='Email'
              onChange={handleChangeEmail}
              value={email}
              sx={{ marginBottom: 4 }}
              required
              disabled={isVerified}
            />
            <TextField
              fullWidth
              id='student_id'
              label='Student ID'
              onChange={handleChangeStudentId}
              value={studentId}
              sx={{ marginBottom: 4 }}
              required
              disabled={isVerified}
            />
            {isVerified && (
              <TextField
                fullWidth
                id='new_password'
                label='New Password'
                type='password'
                onChange={handleChangeNewPassword}
                value={newPassword}
                sx={{ marginBottom: 4 }}
                required
              />
            )}
            {isOtpSent && (
              <TextField
                fullWidth
                id='otp'
                label='OTP'
                onChange={handleChangeOtp}
                value={otp}
                sx={{ marginBottom: 4 }}
                required
              />
            )}
            {error && (
              <Typography color='error' sx={{ marginBottom: 4 }}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={isOtpSent ? handleVerifyOtp : isVerified ? handleSubmit : handleCheck}
            >
              {isOtpSent ? 'Verify OTP' : isVerified ? 'Reset Password' : 'Check'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Remember your password?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/login'>
                  <LinkStyled>Login</LinkStyled>
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

ForgetPasswordPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ForgetPasswordPage
