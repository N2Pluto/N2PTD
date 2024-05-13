// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'


import LayoutAuth from 'src/layouts/LayoutAuth'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'

const Dashboard = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={4}>

          <DepositWithdraw />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Dashboard
