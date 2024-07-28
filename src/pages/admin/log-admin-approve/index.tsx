// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'


import AdminLayout from 'src/layouts/AdminLayout'
import ApexChartWrapper from 'src/@core/styles/libs/adminreact-apexcharts'



import LogsadminApprove from 'src/views/log/user/component/log-admin-approve'

const Log = () => {
  return (
    <AdminLayout>
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='LOGS Approve' titleTypographyProps={{ variant: 'h6' }} />
            <LogsadminApprove />
          </Card>
        </Grid>
      </Grid>
      </ApexChartWrapper>
      </AdminLayout>

  )
}

export default Log
