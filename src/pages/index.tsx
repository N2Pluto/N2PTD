// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

const LandingPage = () => {
  return (
    <Box className='content-center'>
      <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
        <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '1.5rem !important' }}>
            {themeConfig.templateName}
          </Typography>
        </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Welcome to {themeConfig.templateName}
          </Typography>
          <Typography variant='body2'>Please sign-in to your account or register a new one</Typography>
        </Box>
        <Link href='/pages/login'>
          <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }}>
            Login
          </Button>
        </Link>
        <Link href='/pages/register'>
          <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }}>
            Register
          </Button>
        </Link>
      </CardContent>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LandingPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LandingPage
