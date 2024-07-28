// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'


import AdminLayout from 'src/layouts/AdminLayout'
import ApexChartWrapper from 'src/@core/styles/libs/adminreact-apexcharts'


import Logadmincontrol from 'src/views/log/user/component/log-admin-Buildeng'

const Log = () => {
  return (
    <AdminLayout>
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='LOGS Building Control' titleTypographyProps={{ variant: 'h6' }} />
            <Logadmincontrol />
          </Card>
        </Grid>
      </Grid>
      </ApexChartWrapper>
      </AdminLayout>

  )
}

export default Log
