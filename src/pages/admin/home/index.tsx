// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AdminLayout from 'src/layouts/AdminLayout'

import LayoutAuth from 'src/layouts/LayoutAuth'
import HeroSection from 'src/views/admin/homeAdmin/heroSection'
import HeroDashboard from 'src/views/dashboardhome/heropage'

const Home = () => {
  return (
    <AdminLayout>
      <ApexChartWrapper>


        <HeroSection />
      </ApexChartWrapper>
    </AdminLayout>
  )
}

export default Home
