// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import ReservationApprove from 'src/views/admin/reservationApprove/reservation-view'


const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ pl: 4 }}>
            Reservation Control{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='ระบบเปิดรอบการจองหอพัก' titleTypographyProps={{ variant: 'h6' }} />
            <ReservationApprove />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
