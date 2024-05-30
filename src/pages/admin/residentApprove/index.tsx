// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import ResidentApprove from 'src/views/admin/residentApprove/residentApprove'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ pl: 4 }}>
            อนุมัติผู้อยู่อาศัย
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='อนุมัติผู้อยู่อาศัย' titleTypographyProps={{ variant: 'h6' }} />
            <ResidentApprove />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
