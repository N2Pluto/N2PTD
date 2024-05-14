// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import LayoutAuth from 'src/layouts/LayoutAuth'
import HeroDashboard from 'src/views/dashboardhome/heropage'

const Dashboard = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        <HeroDashboard />
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Dashboard
