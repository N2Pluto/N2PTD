// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import CardUser from 'src/views/cards/CardUser'
import CardImgTop from 'src/views/cards/CardImgTop'
import CardMobile from 'src/views/cards/CardMobile'
import CardSupport from 'src/views/cards/CardSupport'
import CardTwitter from 'src/views/cards/CardTwitter'
import CardFacebook from 'src/views/cards/CardFacebook'
import CardLinkedIn from 'src/views/cards/CardLinkedIn'
import CardAppleWatch from 'src/views/cards/CardAppleWatch'
import CardMembership from 'src/views/cards/CardMembership'
import CardInfluencer from 'src/views/cards/CardInfluencer'
import CardNavigation from 'src/views/cards/CardNavigation'
import CardWithCollapse from 'src/views/cards/CardWithCollapse'
import CardVerticalRatings from 'src/views/cards/CardVerticalRatings'
import CardNavigationCenter from 'src/views/cards/CardNavigationCenter'
import CardHorizontalRatings from 'src/views/cards/CardHorizontalRatings'
import LayoutAuth from 'src/layouts/LayoutAuth'
import AccounSetting from 'src/views/account-settings/Account-settings'
import CreateNewUser from 'src/views/newlogin/CreateNewUser'
import { ReactNode } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Box } from '@mui/material'

const Newlogin = () => {
  return (
    <LayoutAuth>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ paddingBottom: 5 }}>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 9 }}>
            <Typography variant='h5'>Create New User</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Grid item xs={12} sm={12} md={12}>
            <CreateNewUser />
          </Grid>
          <FooterIllustrationsV1 />
        </Grid>
      </Grid>
    </LayoutAuth>
  )
}
Newlogin.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Newlogin
