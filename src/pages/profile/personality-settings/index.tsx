// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LayoutAuth from 'src/layouts/LayoutAuth'
import PersonalitySettings from 'src/views/personality-settings/personality-settings'

const Personalitysetting = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ paddingBottom: 4 }}>
          <Typography variant='h5'>Edit Account</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <PersonalitySettings />
        </Grid>
      </Grid>
    </LayoutAuth>
  )
}

export default Personalitysetting
