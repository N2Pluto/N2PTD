// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import AdminLayout from 'src/layouts/AdminLayout'
import CreateGoogleForm from 'src/views/admin/googleForm/createGoogleForm'
import GoogleFormCard from 'src/views/admin/googleForm/googleFormCard'

const MUITable = () => {
  return (
    <AdminLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5' sx={{ pl: 4 }}>
            Create Google Form{' '}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <CreateGoogleForm />
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Card>
            <GoogleFormCard />
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default MUITable
