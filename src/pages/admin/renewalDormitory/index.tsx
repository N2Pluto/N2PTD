// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import RenewalTable from 'src/views/admin/renewalDormitory/renewalDormitoryTable'
import RenewalForm from 'src/views/admin/renewalDormitory/renewalDormitoryForm'
import RenewalChooseForm from 'src/views/admin/renewalDormitory/renewalChooseForm'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
      
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <RenewalForm />
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <RenewalChooseForm />
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='ระบบต่ออายุ' titleTypographyProps={{ variant: 'h6' }} />
            <RenewalTable />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
