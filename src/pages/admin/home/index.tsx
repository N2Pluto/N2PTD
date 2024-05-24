// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

import LayoutAuth from 'src/layouts/LayoutAuth'
import HeroSection from 'src/views/admin/homeAdmin/heroSection'
import HeroDashboard from 'src/views/dashboardhome/heropage'

const Home = () => {
  return (
    <LayoutAuth>
      <ApexChartWrapper>
        

        <HeroSection />
      </ApexChartWrapper>
    </LayoutAuth>
  )
}

export default Home
