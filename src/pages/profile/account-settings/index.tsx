// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LayoutAuth from 'src/layouts/LayoutAuth'
import AccounSetting from 'src/views/account-settings/Account-settings'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

const accountsetting = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ paddingBottom: 4 }}>
          <Typography variant='h5'>Edit Account</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
        <AccounSetting/>

        </Grid>
      </Grid>

    </LayoutAuth>
  )
}

export default accountsetting
