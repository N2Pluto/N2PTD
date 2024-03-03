// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LayoutAuth from 'src/layouts/LayoutAuth'
import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Box } from '@mui/material'
import CreatePersonalityUser from 'src/views/newlogin/CreatePersonalityUser'

const personality = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ paddingBottom: 5 }}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 9 }}>
            <Typography variant='h5'>Personal Information </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Grid item xs={12} sm={12} md={12}>
            <CreatePersonalityUser />
          </Grid>
        </Grid>
      </Grid>
    </LayoutAuth>
  )
}
personality.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default personality
