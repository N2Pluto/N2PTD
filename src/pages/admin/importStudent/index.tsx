// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import AdminLayout from 'src/layouts/AdminLayout'
import UserManagement from 'src/views/admin/user/userManagement'
import UserManagementForm from 'src/views/admin/userManagementForm/userManagementForm'
import StudentTable from 'src/views/admin/importStudent/studentTable'
import ImportStudent from 'src/views/admin/importStudent/importStudent'
import UpdateStudentYear from 'src/views/admin/importStudent/updateStudentYear'

const userManagementpage = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* <Card>
            <UpdateStudentYear />
          </Card> */}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <StudentTable />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default userManagementpage
