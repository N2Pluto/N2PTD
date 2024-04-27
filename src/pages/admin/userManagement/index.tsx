// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import UserManagement from 'src/views/admin/user/userManagement'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            {/* <CardHeader title='User information Table' titleTypographyProps={{ variant: 'h6' }} /> */}
            <UserManagement/>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
