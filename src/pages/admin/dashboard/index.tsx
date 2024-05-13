// ** MUI Imports

// ** Styled Component Import

import { Grid } from '@mui/material'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import LayoutAuth from 'src/layouts/LayoutAuth'
import AppNewsUpdate from 'src/views/admin/dashboard/component/AppNewsUpdate'

import ChartsOverviewDemo from 'src/views/admin/dashboard/component/chart'

import AppWidgetSummary from 'src/views/admin/dashboard/component/one'

const Dashboard = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={4}>
            <AppWidgetSummary
              title='Weekly Sales'
              total={714000}
              color='success'
              icon={<img alt='icon' src='/assets/icons/glass/ic_glass_bag.png' />}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppWidgetSummary
              title='Weekly Sales'
              total={714000}
              color='success'
              icon={<img alt='icon' src='/assets/icons/glass/ic_glass_message.png' />}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppWidgetSummary
              title='Weekly Sales'
              total={714000}
              color='success'
              icon={<img alt='icon' src='/assets/icons/glass/ic_glass_users.png' />}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <ChartsOverviewDemo />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
          />
            </Grid>



        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Dashboard
