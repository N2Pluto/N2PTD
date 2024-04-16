// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports


import AdminLayout from 'src/layouts/AdminLayout'
import Discords from 'src/views/admin/discord/page'

const Dashboard = () => {
  return (
    <AdminLayout>
      <ApexChartWrapper>
        <Grid container spacing={6}>
        <Discords />

        </Grid>
      </ApexChartWrapper>
    </AdminLayout>
  )
}

export default Dashboard
