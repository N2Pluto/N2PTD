// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import Building from 'src/views/admin/building/building'
import Addbuilding from 'src/views/admin/building/building'
import CardShowBuilding from 'src/views/admin/building/showBuilding'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <Addbuilding dorm_id={undefined} />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {/* <CardShowBuilding /> */}
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
