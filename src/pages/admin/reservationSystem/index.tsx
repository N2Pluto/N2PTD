// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import ReservationControl from 'src/views/admin/reservationSystem/reservationControl'
import ReservationRoundStatus from 'src/views/admin/reservationSystem/reservationRoundStatus'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <ReservationControl />
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='Booking Period Table' titleTypographyProps={{ variant: 'h6' }} />
            <ReservationRoundStatus />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
