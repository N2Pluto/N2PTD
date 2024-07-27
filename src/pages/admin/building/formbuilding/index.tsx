// ** MUI Imports
import Grid from '@mui/material/Grid'
import AdminLayout from 'src/layouts/AdminLayout'
import FormBuilding from 'src/views/admin/building/formBuilding'

const FormBuildingpage = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
        <FormBuilding onClose={undefined} setSnackbarOpen={undefined} />
        </Grid>

      </Grid>
    </AdminLayout>
  )
}

export default FormBuildingpage
