// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import Building from 'src/views/admin/building/building'
import Addbuilding from 'src/views/admin/building/addbuilding'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{pl:4}}>Building Control </Typography>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader title='Building Control Table' titleTypographyProps={{ variant: 'h6' }} />
            <Addbuilding />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='Building Control Table' titleTypographyProps={{ variant: 'h6' }} />
            <Building />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
