import { ChangeEvent, useState, useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
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

const Alert = styled(MuiAlert)<AlertProps>(({ theme }) => ({
  width: '100%'
}))

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState<string>('')
  const [studentId, setStudentId] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false)
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false)
  const [generatedOtp, setGeneratedOtp] = useState<string>('')
  const [otpTimestamp, setOtpTimestamp] = useState<Date | null>(null)
  const [cooldownTime, setCooldownTime] = useState<number>(0)
  const [failedAttempts, setFailedAttempts] = useState<number>(0)
  const [lockoutTime, setLockoutTime] = useState<number>(0)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const router = useRouter()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }

    if (lockoutTime > 0) {
      interval = setInterval(() => {
        setLockoutTime(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [cooldownTime, lockoutTime])

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
          setSnackbarMessage('Email and student ID verified successfully.')
          setSnackbarSeverity('success')
          setSnackbarOpen(true)
          setError(null)
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

  const handleRequestOtp = async () => {
    if (!email || !studentId) {
      setError('Please enter your email and student ID')
      return
    }

    if (cooldownTime > 0) {
      setError(`Please wait ${cooldownTime} seconds before requesting a new OTP`)
      return
    }

    const otp = generateOtp()
    setGeneratedOtp(otp)
    setOtpTimestamp(new Date())
    setCooldownTime(60)

    try {
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
                    <p>&copy; ${new Date().getFullYear()} Walailak University. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `
        })
      })

      if (otpResponse.ok) {
        setIsOtpSent(true)
        setSnackbarMessage('OTP sent successfully to your email.')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
      } else {
        setError('Failed to send OTP. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  const handleVerifyOtp = () => {
    if (!otp) {
      setError('Please enter the OTP sent to your email')
      return
    }

    // Increment failed attempts if OTP is incorrect
    if (otp !== generatedOtp) {
      setFailedAttempts(prev => prev + 1)
    }

    // Check if the user should be locked out
    if (failedAttempts >= 3) {
      // Start with 10 seconds for demonstration
      setLockoutTime(60)
      setError(`Too many failed attempts. Please wait 60 seconds before trying again.`)
      const countdown = () => {
        let timeLeft = 60 // Start countdown from 10 seconds
        const timerId = setInterval(() => {
          timeLeft -= 1
          if (timeLeft <= 0) {
            clearInterval(timerId) // Stop the countdown
            setError('') // Optionally clear or update the error message
            setFailedAttempts(0) // Reset failedAttempts after lockout
          } else {
            setError(`Too many failed attempts. Please wait ${timeLeft} seconds before trying again.`)
          }
        }, 1000)
      }
      countdown()
      return
    }

    // If OTP is incorrect, show error and return without verifying further
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.')
      return
    }

    // Check if OTP has expired
    const now = new Date()
    if (otpTimestamp && (now.getTime() - otpTimestamp.getTime()) / 1000 > 900) {
      setError('OTP has expired. Please request a new OTP.')
      return
    }

    // If OTP is correct, not expired, and user is not locked out
    setIsOtpVerified(true)
    setSnackbarMessage('OTP verified successfully.')
    setSnackbarSeverity('success')
    setSnackbarOpen(true)
    setError(null)
    setFailedAttempts(0) // Reset failedAttempts on successful verification
  }

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('Please enter a new password')
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
                fontSize: '1.5rem !important',
                fontFamily: '"Roboto", sans-serif'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, fontFamily: '"Roboto", sans-serif' }}>
              Forgot Your Password?
            </Typography>
            <Typography variant='body2' sx={{ fontFamily: '"Roboto", sans-serif' }}>
              Enter your email and student ID to reset your password.
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id='email'
              label='Email'
              onChange={handleChangeEmail}
              value={email}
              sx={{ marginBottom: 4, fontFamily: '"Roboto", sans-serif' }}
              required
              disabled={isVerified}
            />
            <TextField
              fullWidth
              id='student_id'
              label='Student ID'
              onChange={handleChangeStudentId}
              value={studentId}
              sx={{ marginBottom: 4, fontFamily: '"Roboto", sans-serif' }}
              required
              disabled={isVerified}
            />
            {isOtpSent && (
              <TextField
                fullWidth
                id='otp'
                label='OTP'
                onChange={handleChangeOtp}
                value={otp}
                sx={{ marginBottom: 4, fontFamily: '"Roboto", sans-serif' }}
                required
                disabled={isOtpVerified}
              />
            )}
            {isOtpVerified && (
              <TextField
                fullWidth
                id='new_password'
                label='New Password'
                type='password'
                onChange={handleChangeNewPassword}
                value={newPassword}
                sx={{ marginBottom: 4, fontFamily: '"Roboto", sans-serif' }}
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
              onClick={
                isOtpSent
                  ? isOtpVerified
                    ? handleResetPassword
                    : handleVerifyOtp
                  : isVerified
                  ? handleRequestOtp
                  : handleCheck
              }
              disabled={lockoutTime > 0}
            >
              {isOtpSent ? (isOtpVerified ? 'Reset Password' : 'Verify OTP') : isVerified ? 'Request OTP' : 'Check'}
            </Button>
            {isOtpSent && !isOtpVerified && (
              <Button
                fullWidth
                size='large'
                variant='outlined'
                sx={{ marginBottom: 7 }}
                onClick={handleRequestOtp}
                disabled={cooldownTime > 0}
              >
                Resend OTP {cooldownTime > 0 && `(${cooldownTime}s)`}
              </Button>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2, fontFamily: '"Roboto", sans-serif' }}>
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
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

ForgetPasswordPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ForgetPasswordPage
