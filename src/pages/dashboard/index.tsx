// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import LayoutAuth from 'src/layouts/LayoutAuth'

const Dashboard = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        {/* <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={4}>
            <CardStatisticsVerticalComponent
              icon={<Poll />}
              title='Total Sales'
              statistic='2,367'
              color='primary'
              statisticTitle='Sales'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CardStatisticsVerticalComponent
              icon={<CurrencyUsd />}
              title='Total Earnings'
              statistic='$ 89,500'
              color='success'
              statisticTitle='Earnings'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CardStatisticsVerticalComponent
              icon={<HelpCircleOutline />}
              title='Support Tickets'
              statistic='45'
              color='warning'
              statisticTitle='Tickets'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <CardStatisticsVerticalComponent
              icon={<BriefcaseVariantOutline />}
              title='Business Leads'
              statistic='1,345'
              color='info'
              statisticTitle='Leads'
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StatisticsCard />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Trophy />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TotalEarning />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Table />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <WeeklyOverview />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <DepositWithdraw />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <SalesByCountries />
          </Grid>
        </Grid> */}

      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Dashboard
