// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import ChangeRoomForm from 'src/views/admin/dormitoryResidentForm/changeRoomForm'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ pl: 4 }}>
           Change Room Form{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CardHeader title='ระบบเปิดรอบการจองหอพัก' titleTypographyProps={{ variant: 'h6' }} />
            <ChangeRoomForm />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
