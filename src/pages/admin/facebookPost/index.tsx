// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import ReservationApprove from 'src/views/admin/reservationApprove/reservation-view'
import FormLayoutsFacebookPost from 'src/views/admin/facebookPost/facebookPost'

const FacebookPost = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
        <FormLayoutsFacebookPost />

        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default FacebookPost
