// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AdminLayout from 'src/layouts/AdminLayout'
import RenewalSystem from 'src/views/admin/renewalSystem/renewalSystem'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='ระบบต่ออายุ' titleTypographyProps={{ variant: 'h6' }} />
            <RenewalSystem />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
