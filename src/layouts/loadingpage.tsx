// ** MUI Imports
import Grid from '@mui/material/Grid'
import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Box } from '@mui/material'

import CircularProgress from '@mui/material/CircularProgress';

const LoadingPage = () => {
  return (
      <Grid container spacing={6}>

        <Grid item xs={12} sm={12} md={12}>
        <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>

          <FooterIllustrationsV1 />
        </Grid>
      </Grid>
  )
}
LoadingPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoadingPage
