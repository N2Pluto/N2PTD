// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import AdminLayout from 'src/layouts/AdminLayout'
import UserManagement from 'src/views/admin/user/userManagement'
import UserManagementForm from 'src/views/admin/userManagementForm/userManagementForm'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <UserManagementForm />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
