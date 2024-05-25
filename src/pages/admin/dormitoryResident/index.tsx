// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import ReservationApprove from 'src/views/admin/reservationApprove/reservation-view'
import DormitoryResidentControl from 'src/views/admin/dormitoryResident/dormitoryResidentControl'
import TransferRoomForm from 'src/views/admin/dormitoryResidentForm/transferRoomForm'
import ChangeRoomForm from 'src/views/admin/dormitoryResidentForm/changeRoomForm'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        {/* <Grid item xs={12}>
          <Typography variant='h5' sx={{ pl: 4 }}>
            Dormitory Resident Control{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='ระบบการย้ายห้องพัก' titleTypographyProps={{ variant: 'h6' }} />
            <TransferRoomForm />
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='ระบบเปิดรอบการจองหอพัก' titleTypographyProps={{ variant: 'h6' }} />
            <ChangeRoomForm />
          </Card>
        </Grid> */}
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='ระบบเปิดรอบการจองหอพัก' titleTypographyProps={{ variant: 'h6' }} />
            <DormitoryResidentControl />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
