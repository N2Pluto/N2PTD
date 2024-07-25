// ** MUI Imports
import { Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import LayoutAuth from 'src/layouts/LayoutAuth'
import CardGuid from 'src/views/admin/dashboard/component/guid'
import RenewalChooseForm from 'src/views/admin/renewalDormitory/renewalChooseForm'
import CardImgTop from 'src/views/cards/CardImgTop'
import CardInfluencer from 'src/views/cards/CardInfluencer'
import FacebookPost from 'src/views/dashboardhome/component/facebook'
import Round from 'src/views/dashboardhome/component/round'
import CardBedStatistics from 'src/views/dashboardhome/component/statistics/component/bedStatistics'
import CardBuildingStatistics from 'src/views/dashboardhome/component/statistics/component/buildingStatistics'
import CardRoomStatistics from 'src/views/dashboardhome/component/statistics/component/roomStatistics'
import CardUserStatistics from 'src/views/dashboardhome/component/statistics/component/userStatistics'

const Dashboard = () => {
  return (
    <LayoutAuth>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
        <Grid container spacing={6} sx={{ maxWidth: '1200px' }}>
          <Grid item xs={12}>
            <RenewalChooseForm />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CardUserStatistics />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardBuildingStatistics />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardRoomStatistics />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardBedStatistics />
          </Grid>

          <Grid item xs={12} sm={8}>
            <FacebookPost />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Round />
              </Grid>
              <Grid item xs={12}>
                <CardGuid />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LayoutAuth>
  )
}

export default Dashboard
