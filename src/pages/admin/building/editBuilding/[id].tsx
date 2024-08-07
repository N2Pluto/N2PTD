// ** MUI Imports
import Grid from '@mui/material/Grid'
import AdminLayout from 'src/layouts/AdminLayout'
import EditBuilding from 'src/views/admin/building/editBuilding'
import EditRoom from 'src/views/admin/building/room/editRoom'

const EditBuildingPage = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <EditBuilding />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default EditBuildingPage
